import {
  DAppConnector,
  HederaJsonRpcMethod,
  HederaChainId,
  transactionToBase64String,
  SignAndExecuteTransactionResult,
} from "@hashgraph/hedera-wallet-connect";
import {
  AccountId,
  LedgerId,
  PublicKey,
  TopicCreateTransaction,
  TransactionId,
  TransactionReceiptQuery,
} from "@hashgraph/sdk";
import { BACKEND_URL, metadata, projectId } from "@/config";
import { useAppKitAccount } from "@reown/appkit/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PUBLIC_KEY } from "@/lib/utils";

export function useTopicManager() {
  const { address } = useAppKitAccount();
  const { topicExists, error } = useTopicExists();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createTopicMutation, isPending } = useMutation({
    mutationFn: async () => createTopic(address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topic", address] });
      console.log("Topic created");
      navigate("/home");
    },
    onError: (error) => {
      console.error("Error creating topic", error);
    },
  });

  return {
    topicExists,
    isPending,
    error,
    createTopicMutation,
  };
}

export function useTopicExists() {
  const { address } = useAppKitAccount();

  const { data, isLoading, error } = useQuery({
    queryKey: ["topic", address],
    queryFn: () => checkTopicExists(address),
    enabled: !!address,
  });

  return {
    topicExists: data,
    isLoading,
    error,
  };
}

async function checkTopicExists(
  accountId: string | undefined
): Promise<boolean> {
  if (!accountId) {
    console.log("No account id");
    return false;
  }
  const data = await fetch(`${BACKEND_URL}/topics/exists/${accountId}`);
  const json = await data.json();
  return json.exists;
}

export async function createTopic(
  accountId: string | undefined
): Promise<
  (SignAndExecuteTransactionResult & { topicId?: string }) | undefined
> {
  if (!accountId) {
    return;
  }

  const dAppConnector = new DAppConnector(
    metadata,
    LedgerId.TESTNET,
    projectId,
    Object.values(HederaJsonRpcMethod),
    [],
    [HederaChainId.Testnet]
  );
  await dAppConnector.init();

  await dAppConnector.openModal();

  // Generate a transaction ID and set it on the transaction
  const signer = dAppConnector.getSigner(AccountId.fromString(accountId));
  const transactionId = TransactionId.generate(accountId);
  const topicTx = new TopicCreateTransaction()
    .setTransactionId(transactionId)
    .setTopicMemo("My new topic via WalletConnect")
    .setAdminKey(PublicKey.fromString(PUBLIC_KEY));

  const result = await dAppConnector.signAndExecuteTransaction({
    signerAccountId: accountId,
    transactionList: transactionToBase64String(topicTx),
  });
  const receiptQuery = new TransactionReceiptQuery().setTransactionId(
    transactionId
  );
  const receipt = await receiptQuery.executeWithSigner(signer);
  const topicId = receipt.topicId?.toString();

  console.log("Topic Id:", topicId);
  //TODO:call the register endpoint from the backend to register the topic id

  return result;
}

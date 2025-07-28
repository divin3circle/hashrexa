import {
  DAppConnector,
  HederaJsonRpcMethod,
  HederaChainId,
  transactionToBase64String,
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
    onSuccess: async (topicId) => {
      queryClient.invalidateQueries({ queryKey: ["topic", address] });
      console.log("Topic created");
      console.log("Topic Id:", topicId);
      const success = await registerTopic(address, topicId);
      if (success) {
        navigate("/home");
      }
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

  if (data.status === 404) {
    return false;
  }

  if (!data.ok) {
    console.error("Failed to check topic exists:", data.status);
    return false;
  }

  const json = await data.json();
  return json.exists;
}

async function registerTopic(
  userAccountId: string | undefined,
  topicId: string | undefined
) {
  if (!userAccountId || !topicId) {
    console.error("No user account id or topic id");
    return false;
  }
  const data = await fetch(
    `${BACKEND_URL}/auth/register/${userAccountId}/${topicId}`,
    {
      method: "POST",
    }
  );
  if (!data.ok) {
    console.error("Failed to register topic:", data.status);
    return false;
  }
  const json = await data.json();
  console.log("Topic registered", json);
  return json.success;
}

export async function createTopic(
  accountId: string | undefined
): Promise<string | undefined> {
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
    .setSubmitKey(PublicKey.fromString(PUBLIC_KEY));

  const result = await dAppConnector.signAndExecuteTransaction({
    signerAccountId: accountId,
    transactionList: transactionToBase64String(topicTx),
  });
  console.log("Result:", result);
  const receiptQuery = new TransactionReceiptQuery().setTransactionId(
    transactionId
  );
  const receipt = await receiptQuery.executeWithSigner(signer);
  const topicId = receipt.topicId?.toString();

  return topicId;
}

import {
  DAppConnector,
  HederaJsonRpcMethod,
  HederaChainId,
  transactionToBase64String,
  queryToBase64String,
  SignAndExecuteTransactionResult,
} from "@hashgraph/hedera-wallet-connect";
import {
  LedgerId,
  TopicCreateTransaction,
  TransactionReceiptQuery,
} from "@hashgraph/sdk";
import { BACKEND_URL, metadata, projectId } from "@/config";
import { useAppKitAccount } from "@reown/appkit/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTopicManager() {
  const { address } = useAppKitAccount();
  const { topicExists, error } = useTopicExists();
  const queryClient = useQueryClient();

  const { mutate: createTopicMutation, isPending } = useMutation({
    mutationFn: async () => createTopic(address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topic", address] });
      console.log("Topic created");
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

  const topicTx = new TopicCreateTransaction().setTopicMemo(
    "My new topic via WalletConnect"
  );

  const result = await dAppConnector.signAndExecuteTransaction({
    signerAccountId: accountId,
    transactionList: transactionToBase64String(topicTx),
  });

  console.log("Result", result);

  return result;
}

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  DAppConnector,
  HederaJsonRpcMethod,
  HederaChainId,
  transactionToBase64String,
} from "@hashgraph/hedera-wallet-connect";
import {
  AccountId,
  LedgerId,
  TokenAssociateTransaction,
  TokenId,
  TransactionId,
  TransactionReceiptQuery,
} from "@hashgraph/sdk";
import { metadata, projectId } from "@/config";
import { useAppKitAccount } from "@reown/appkit/react";

export function useAssociate(tokenId: string | undefined) {
  const { address } = useAppKitAccount();

  const { mutate: associate, isPending } = useMutation({
    mutationFn: async () => await associateToken(tokenId, address),
    onSuccess: () => {
      toast.success("Token associated successfully");
    },
    onError: () => {
      toast.error("Failed to associate token");
    },
  });

  return {
    associate,
    isPending,
  };
}

export async function associateToken(
  tokenId: string | undefined,
  accountId: string | undefined
) {
  if (!tokenId) {
    toast.error("Token ID is required");
    return;
  }
  if (!accountId) {
    toast.error("Account ID is required");
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

  const signer = dAppConnector.getSigner(AccountId.fromString(accountId));
  const transactionId = TransactionId.generate(accountId);
  const associateTx = new TokenAssociateTransaction()
    .setTransactionId(transactionId)
    .setAccountId(AccountId.fromString(accountId))
    .setTokenIds([TokenId.fromString(tokenId)]);

  const result = await dAppConnector.signAndExecuteTransaction({
    signerAccountId: accountId,
    transactionList: transactionToBase64String(associateTx),
  });
  console.log("Associate Result:", result);
  const receiptQuery = new TransactionReceiptQuery().setTransactionId(
    transactionId
  );
  const receipt = await receiptQuery.executeWithSigner(signer);
  const status = receipt.status;

  return status;
}

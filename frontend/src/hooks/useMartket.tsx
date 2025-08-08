import { useAppKitAccount } from "@reown/appkit/react";
import { useMutation } from "@tanstack/react-query";
import {
  DAppConnector,
  HederaJsonRpcMethod,
  HederaChainId,
  transactionToBase64String,
} from "@hashgraph/hedera-wallet-connect";
import {
  AccountId,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  ContractId,
  LedgerId,
  TransactionId,
  AccountAllowanceApproveTransaction,
  TokenId,
} from "@hashgraph/sdk";
import { metadata, projectId } from "@/config";
import { toast } from "react-hot-toast";

const contractId = ContractId.fromString("0.0.6492237");

export const encodedStruct =
  "0x0000000000000000000000000000000000631766000000000000000000000000000000000000000000000000000000000000635c710535a028c31c3d169b74e0b4bb141e064cac2b5c2f4fc5416d96ac447388ead98c8eedb45d6ba820000000000000000000000000000000000000000000000000bef55718ad60000";

export function useDepositHash() {
  const { address } = useAppKitAccount();
  const { mutate: depositHash, isPending } = useMutation({
    mutationFn: async (params: {
      amountToDeposit: number;
      shares: number;
      callData: string;
    }) => {
      if (!address) throw new Error("No address");
      await approveAllowance(params.amountToDeposit, address);
      return depositHashFunction(
        params.amountToDeposit,
        params.shares,
        address,
        params.callData
      );
    },
    onSuccess: () => {
      if (address) {
        checkAllowance(address);
      }
      toast.success("Deposit successful");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Deposit failed");
    },
  });
  return { depositHash, isPending };
}

async function depositHashFunction(
  amountToDeposit: number,
  shares: number,
  userAccountId: string,
  callData: string
) {
  if (!userAccountId) {
    return;
  }

  const accountId = AccountId.fromString(userAccountId).toString();
  const evmAddress = accountIdToEvmAddress(accountId);

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
  const transactionId = TransactionId.generate(accountId);

  const callDataBytes = callData.startsWith("0x")
    ? new Uint8Array(Buffer.from(callData.slice(2), "hex"))
    : new Uint8Array(Buffer.from(callData, "hex"));

  const depositTx = new ContractExecuteTransaction()
    .setTransactionId(transactionId)
    .setContractId(contractId)
    .setGas(15_000_000)
    .setFunction(
      "supply",
      new ContractFunctionParameters()
        .addBytes(new Uint8Array(Buffer.from(encodedStruct.slice(2), "hex")))
        .addUint256(amountToDeposit)
        .addUint256(shares)
        .addAddress(evmAddress)
        .addBytes(callDataBytes)
    );

  await dAppConnector.signAndExecuteTransaction({
    signerAccountId: accountId,
    transactionList: transactionToBase64String(depositTx),
  });
}

function accountIdToEvmAddress(accountIdString: string): string {
  const accountId = AccountId.fromString(accountIdString);
  const evmAddress = accountId.toSolidityAddress();
  return `0x${evmAddress}`;
}

async function approveAllowance(amount: number, userAccountId: string) {
  try {
    const accountId = AccountId.fromString(userAccountId).toString();
    const hashTokenId = TokenId.fromString("0.0.6494054");

    console.log("Approving allowance:", {
      tokenId: hashTokenId.toString(),
      owner: accountId,
      spender: contractId.toString(),
      amount: 2 * 10 ** 6,
    });

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

    const transaction = new AccountAllowanceApproveTransaction()
      .approveTokenAllowance(
        hashTokenId,
        accountId,
        contractId.toString(),
        amount * 10 ** 6
      )
      .setTransactionId(TransactionId.generate(accountId));

    console.log("Transaction created:", transaction);

    const result = await dAppConnector.signAndExecuteTransaction({
      signerAccountId: accountId,
      transactionList: transactionToBase64String(transaction),
    });

    console.log("Allowance approval result:", result);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    return result;
  } catch (error) {
    console.error("Allowance approval failed:", error);
    throw error;
  }
}

async function checkAllowance(userAccountId: string) {
  const accountId = AccountId.fromString(userAccountId);
  const hashTokenId = TokenId.fromString("0.0.6494054");

  try {
    console.log("Checking allowance for:", {
      owner: accountId.toString(),
      spender: contractId.toString(),
      token: hashTokenId.toString(),
    });
  } catch (error) {
    console.error("Failed to check allowance:", error);
  }
}

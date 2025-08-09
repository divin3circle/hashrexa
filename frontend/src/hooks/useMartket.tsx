import { useAppKitAccount } from "@reown/appkit/react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  EvmAddress,
} from "@hashgraph/sdk";
import { BACKEND_URL, metadata, projectId } from "@/config";
import { toast } from "react-hot-toast";

import { PoolPosition } from "@/types";
import axios from "axios";

const contractId = ContractId.fromString("0.0.6532033");
const userEvmAddress = "0x0eab38daf1be107e0981c55bff252f351bd0ee7f";

export function useDepositHash() {
  const { address } = useAppKitAccount();
  const { mutate: depositHash, isPending } = useMutation({
    mutationFn: async (params: {
      amountToDeposit: number;
      shares: number;
      callData: string;
    }) => {
      if (!address) throw new Error("No address");
      await approveAllowance(params.amountToDeposit, address, "0.0.6494054");
      return depositHashFunction(
        params.amountToDeposit,
        params.shares,
        address,
        params.callData
      );
    },
    onSuccess: () => {
      toast.success("Deposit successful");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Deposit failed");
    },
  });
  return { depositHash, isPending };
}

export function useBorrowHash() {
  const { address } = useAppKitAccount();
  const { mutate: borrowHash, isPending } = useMutation({
    mutationFn: async (params: {
      amountToBorrow: number;
      callData: string;
    }) => {
      if (!address) throw new Error("No address");
      await approveAllowance(100, address, "0.0.6509511");
      // wait for 5 seconds
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return supplyAndBorrow(address, params.amountToBorrow, params.callData);
    },
    onSuccess: async (_, params) => {
      await sendLoanStatus(address, 100, params.amountToBorrow, 0.0);
      toast.success("Borrow successful");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Borrow failed");
    },
  });
  return { borrowHash, isPending };
}

export function useUserPosition() {
  const evmAddress = "0x0eab38daf1be107e0981c55bff252f351bd0ee7f";
  const { data: userPosition, isLoading } = useQuery({
    queryKey: ["userPosition", evmAddress],
    queryFn: () => getUserPosition(evmAddress),
  });
  return { userPosition, isLoading };
}

async function getUserPosition(
  address: string | undefined
): Promise<PoolPosition> {
  if (!address) {
    return {
      supplyShares: 0,
      borrowShares: 0,
      collateral: 0,
    };
  }
  const response = await fetch(`${BACKEND_URL}/user-position/${address}`);
  const data = await response.json();
  return data.position as PoolPosition;
}

export function useWithdrawCollateralHash() {
  const { address } = useAppKitAccount();
  const { mutate: withdrawCollateralHash, isPending } = useMutation({
    mutationFn: async () => {
      return withdrawCollateralHashFunction(address);
    },
    onSuccess: () => {
      toast.success("Withdraw collateral successful");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Withdraw collateral failed");
    },
  });
  return { withdrawCollateralHash, isPending };
}

async function withdrawCollateralHashFunction(address: string | undefined) {
  if (!address) {
    return;
  }
  const accountId = AccountId.fromString(address).toString();
  const evmAddress = accountIdToEvmAddress(accountId);
  console.log("evmAddress on withdraw", evmAddress);
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
  const withdrawTx = new ContractExecuteTransaction()
    .setTransactionId(transactionId)
    .setContractId(contractId)
    .setGas(15_000_000)
    .setFunction(
      "withdrawCollateral",
      new ContractFunctionParameters()
        .addUint256(100)
        .addAddress(EvmAddress.fromString(userEvmAddress))
        .addAddress(EvmAddress.fromString(userEvmAddress))
    );

  await dAppConnector.signAndExecuteTransaction({
    signerAccountId: accountId,
    transactionList: transactionToBase64String(withdrawTx),
  });
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

async function supplyAndBorrow(
  address: string | undefined,
  amountToBorrow: number,
  callData: string
) {
  if (!address) {
    return;
  }
  const accountId = AccountId.fromString(address).toString();
  const evmAddress = accountIdToEvmAddress(accountId);
  console.log("evmAddress on supply", evmAddress);
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

  // supply collateral function call
  const transactionId = TransactionId.generate(accountId);
  const supplyTx = new ContractExecuteTransaction()
    .setTransactionId(transactionId)
    .setContractId(contractId)
    .setGas(15_000_000)
    .setFunction(
      "supplyCollateral",
      new ContractFunctionParameters()
        .addUint256(100)
        .addAddress(EvmAddress.fromString(userEvmAddress))
        .addBytes(new Uint8Array(Buffer.from(callData || "0x", "hex")))
    );

  await dAppConnector.signAndExecuteTransaction({
    signerAccountId: accountId,
    transactionList: transactionToBase64String(supplyTx),
  });
  console.log("supplyTx", supplyTx);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await borrowHashFunction(
    accountId,
    evmAddress,
    amountToBorrow,
    dAppConnector
  );
}

async function borrowHashFunction(
  accountId: string,
  evmAddress: string,
  _amountToBorrow: number,
  dAppConnector: DAppConnector
) {
  console.log("evmAddress on borrow", evmAddress);
  // borrow hash contract call
  const borrowTransactionId = TransactionId.generate(accountId);
  const borrowTx = new ContractExecuteTransaction()
    .setTransactionId(borrowTransactionId)
    .setContractId(contractId)
    .setGas(15_000_000)
    .setFunction(
      "borrow",
      new ContractFunctionParameters()
        .addUint256(1000000)
        .addUint256(0)
        .addAddress(EvmAddress.fromString(userEvmAddress))
        .addAddress(EvmAddress.fromString(userEvmAddress))
    );

  await dAppConnector.signAndExecuteTransaction({
    signerAccountId: accountId,
    transactionList: transactionToBase64String(borrowTx),
  });
}

function accountIdToEvmAddress(accountIdString: string): string {
  const accountId = AccountId.fromString(accountIdString);
  const evmAddress = accountId.toSolidityAddress();
  return `0x${evmAddress}`;
}

async function approveAllowance(
  amount: number,
  userAccountId: string,
  tokenId: string
) {
  try {
    const accountId = AccountId.fromString(userAccountId).toString();
    const hashTokenId = TokenId.fromString(tokenId);

    console.log("Approving allowance:", {
      tokenId: hashTokenId.toString(),
      owner: accountId,
      spender: contractId.toString(),
      amount: amount / 10 ** 6,
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
        amount
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

async function sendLoanStatus(
  address: string | undefined,
  collateralAmount: number,
  borrowedAmount: number,
  apy: number
) {
  if (!address) {
    return;
  }
  const accountId = AccountId.fromString(address).toString();
  const evmAddress = accountIdToEvmAddress(accountId);
  console.log("evmAddress on sendLoanStatus", evmAddress);
  const response = await axios.post(
    `${BACKEND_URL}/user-loan-status/${address}`,
    {
      collateral_token: "dAAPL",
      collateral_amount: collateralAmount,
      borrowed_token: "HASH",
      borrowed_amount: borrowedAmount,
      apy: apy,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status !== 200) {
    console.error("Failed to send loan status:", response.status);
    throw new Error("Failed to send loan status");
  }
  return response.data;
}

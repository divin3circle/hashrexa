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
import { MarketParams } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { AbiCoder } from "ethers";

const abiCoder = new AbiCoder();

// Encode the struct
const encodedStruct = abiCoder.encode(
  [
    "tuple(address loanToken, address collateralToken, address oracle, address irm, uint256 lltv)",
  ],
  [
    [
      MarketParams.loanToken,
      MarketParams.collateralToken,
      MarketParams.oracle,
      MarketParams.irm,
      MarketParams.lltv,
    ],
  ]
);

export function useDepositHash() {
  const { address } = useAppKitAccount();
  const { mutate: depositHash, isPending } = useMutation({
    mutationFn: async (params: {
      amountToDeposit: number;
      shares: number;
      callData: string;
    }) => {
      if (!address) throw new Error("No address");
      //   await approveAllowance(params.amountToDeposit, address);
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
  const contractId = ContractId.fromString("0.0.6492237");

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
  const depositTx = new ContractExecuteTransaction()
    .setTransactionId(transactionId)
    .setContractId(contractId)
    .setGas(10_000_000)
    .setFunction(
      "supply",
      new ContractFunctionParameters()
        .addBytes(new Uint8Array(Buffer.from(encodedStruct.slice(2), "hex")))
        .addUint256(amountToDeposit)
        .addUint256(shares)
        .addString(evmAddress)
        .addString(callData)
        .addBytesArray([])
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
  const accountId = AccountId.fromString(userAccountId).toString();
  const contractId = ContractId.fromString("0.0.6492237");
  const hashTokenId = TokenId.fromString("0.0.6494054");

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

  const transaction =
    new AccountAllowanceApproveTransaction().approveTokenAllowance(
      hashTokenId,
      accountId,
      contractId,
      amount
    );

  await dAppConnector.signAndExecuteTransaction({
    signerAccountId: accountId,
    transactionList: transactionToBase64String(transaction),
  });
}

// //Create the transaction
// const transaction = new AccountAllowanceApproveTransaction()
//     .approveHbarAllowance(ownerAccount, spenderAccountId, Hbar.from(1));

// //Sign the transaction with the owner account key
// const signTx = await transaction.sign(ownerAccountKey);

// //Sign the transaction with the client operator private key and submit to a Hedera network
// const txResponse = await signTx.execute(client);

// //Request the receipt of the transaction
// const receipt = await txResponse.getReceipt(client);

// //Get the transaction consensus status
// const transactionStatus = receipt.status;

// console.log("The transaction consensus status is " +transactionStatus.toString());

//v2.13.0

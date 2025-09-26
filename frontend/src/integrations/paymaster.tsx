import { type FC, useEffect, useState, useCallback } from "react";
import { connect } from "get-starknet";
import {
  Account,
  PaymasterRpc,
  type TokenData,
  WalletAccount,
  type PaymasterDetails,
} from "starknet";
import { configDotenv } from "dotenv";

const myPaymasterRpc = new PaymasterRpc({
  nodeUrl: "https://starknet.paymaster.avnu.fi",
  headers: { "api-key": process.env.PAYMASTER_API_KEY },
});

export interface UsePaymasterReturn {
  account: Account | undefined;
  gasToken: TokenData | undefined;
  gasTokens: TokenData[];
  loading: boolean;
  tx: string | undefined;

  connectWallet: () => Promise<void>;
  selectGasToken: (token: TokenData) => void;

  isConnected: boolean;
  canExecute: boolean;
}

const myProvider = "";
const accountAddress = "";
const privateKey = "";

const myAccount = new Account({
  provider: myProvider,
  address: accountAddress,
  signer: privateKey,
  paymaster: myPaymasterRpc,
});

const feesDetails: PaymasterDetails = {
  feeMode: { mode: "sponsored" },
};

const res = await myAccount.executePaymasterTransaction([myCall], feesDetails);
const tx = await myProvider.waitForTransaction(res.transaction_hash);

export default Paymaster;

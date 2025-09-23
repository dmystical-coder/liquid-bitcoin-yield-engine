import {
  Account,
  ec,
  json,
  stark,
  RpcProvider,
  hash,
  CallData,
  CairoOption,
  CairoOptionVariant,
  CairoCustomEnum,
} from "starknet";
import {
  StarknetInitializer,
  StarknetKeypairWallet,
  StarknetSigner,
  StarknetInitializerType,
} from "@atomiqlabs/chain-starknet";
import { SwapperFactory, BitcoinNetwork } from "@atomiqlabs/sdk";
import {
  SqliteStorageManager,
  SqliteUnifiedStorage,
} from "@atomiqlabs/storage-sqlite";

require("dotenv").config();

// connect RPC 0.8 provider
const myNodeUrl = process.env.NODE_URL;
const provider = new RpcProvider({ nodeUrl: `${myNodeUrl}` });
// {"id":0,"jsonrpc":"2.0","result":2377826}

//new Argent X account v0.4.0
const argentXaccountClassHash =
  "0x036078334509b514626504edc9fb252328d1a240e4e948bef8d0c08dff45927f";

// Generate public and private key pair.
const privateKeyAX = stark.randomAddress();
console.log("AX_ACCOUNT_PRIVATE_KEY=", privateKeyAX);
const starkKeyPubAX = ec.starkCurve.getStarkKey(privateKeyAX);
console.log("AX_ACCOUNT_PUBLIC_KEY=", starkKeyPubAX);

// Calculate future address of the ArgentX account
const axSigner = new CairoCustomEnum({ Starknet: { pubkey: starkKeyPubAX } });
const axGuardian = new CairoOption<unknown>(CairoOptionVariant.None);
const AXConstructorCallData = CallData.compile({
  owner: axSigner,
  guardian: axGuardian,
});

const AXcontractAddress = hash.calculateContractAddressFromHash(
  starkKeyPubAX,
  argentXaccountClassHash,
  AXConstructorCallData,
  0
);
console.log("Precalculated account address=", AXcontractAddress);

const starknetRpc = process.env.STARK_RPC;

console.log("Rpc acquired");

const Factory = new SwapperFactory<[StarknetInitializerType]>([
  StarknetInitializer,
] as const);

console.log("factory initialized");

const Tokens = Factory.Tokens; //Get the supported tokens for all the specified chains.
const StrkProvider = new RpcProvider({ nodeUrl: starknetRpc });

console.log("provider declared");

const swapper = Factory.newSwapper({
  chains: {
    STARKNET: {
      rpcUrl: StrkProvider, //You can also pass Provider object here
    },
  },
  bitcoinNetwork: BitcoinNetwork.TESTNET, //or BitcoinNetwork.MAINNET, BitcoinNetwork.TESTNET4 - this also sets the network to use for Solana (solana devnet for bitcoin testnet) & Starknet (sepolia for bitcoin testnet)
  swapStorage: (chainId) =>
    new SqliteUnifiedStorage("CHAIN_" + chainId + ".sqlite3"),
  chainStorageCtor: (name) =>
    new SqliteStorageManager("STORE_" + name + ".sqlite3"),
});

console.log("swapper init");

const starknetSigner = new StarknetSigner(
  new StarknetKeypairWallet(StrkProvider, privateKeyAX)
);

console.log("new signer gotten");

swapper
  .init()
  .then(() => {
    console.log("Swapper initialized successfully");
  })
  .catch(console.error);
// Any other code that needs to run after swapper is initialized

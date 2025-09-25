import {
  ec,
  stark,
  RpcProvider,
  hash,
  CallData,
  CairoOption,
  CairoOptionVariant,
  CairoCustomEnum,
} from "starknet";

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

export {
  privateKeyAX,
  starkKeyPubAX,
  AXConstructorCallData,
  AXcontractAddress,
  provider,
  argentXaccountClassHash,
};

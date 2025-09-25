import { Account } from "starknet";
import {
  privateKeyAX,
  starkKeyPubAX,
  AXConstructorCallData,
  AXcontractAddress,
  provider,
  argentXaccountClassHash,
} from "./AccountCreation";

const accountAX = new Account(provider, AXcontractAddress, privateKeyAX);

const deployAccountPayload = {
  classHash: argentXaccountClassHash,
  constructorCalldata: AXConstructorCallData,
  contractAddress: AXcontractAddress,
  addressSalt: starkKeyPubAX,
};

console.log("Deploy account Payload initialized");

async function deployArgentXWallet() {
  const { transaction_hash: AXdAth, contract_address: AXcontractFinalAddress } =
    await accountAX.deployAccount(deployAccountPayload);
  console.log("ArgentX wallet deployed at: ", AXcontractFinalAddress);
}

deployArgentXWallet().catch(console.error);
console.log("wallet deployed");

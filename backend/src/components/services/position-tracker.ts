import { Contract, RpcProvider } from "starknet";
import { CONTRACTS } from "../config/contracts";

export interface Position {
  protocol: "vesu" | "troves";
  amount: string;
  timestamp: number;
  apr: number;
  profit: string;
}

export class PositionTracker {
  private static instance: PositionTracker;
  private provider: RpcProvider;
  private positions: Map<string, Position[]>; // address -> positions

  private constructor() {
    console.log("initializing");
    this.provider = new RpcProvider({
      nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_6",
    });
    this.positions = new Map();
    console.log("initialized rpc provider");
  }

  public static getInstance(): PositionTracker {
    if (!PositionTracker.instance) {
      PositionTracker.instance = new PositionTracker();
    }
    console.log("initialized position tracker");
    return PositionTracker.instance;
  }

  public async addPosition(
    address: string,
    protocol: "vesu" | "troves",
    amount: string,
    apr: number
  ) {
    const position: Position = {
      protocol,
      amount,
      timestamp: Date.now(),
      apr,
      profit: "0",
    };
    console.error();

    console.log("adding positions");
    const userPositions = this.positions.get(address) || [];
    userPositions.push(position);
    this.positions.set(address, userPositions);
  }

  public async getPositions(address: string): Promise<Position[]> {
    return this.positions.get(address) || [];
  }

  public async calculateProfit(
    address: string
  ): Promise<{ vesu: string; troves: string }> {
    const positions = await this.getPositions(address);
    const now = Date.now();

    const profits = positions.reduce(
      (acc, pos) => {
        const timeInYears = (now - pos.timestamp) / (1000 * 60 * 60 * 24 * 365);
        const profit = (
          parseFloat(pos.amount) *
          pos.apr *
          timeInYears
        ).toString();

        if (pos.protocol === "vesu") {
          acc.vesu = (parseFloat(acc.vesu) + parseFloat(profit)).toString();
        } else {
          acc.troves = (parseFloat(acc.troves) + parseFloat(profit)).toString();
        }
        console.log("tracking successful");
        return acc;
      },
      { vesu: "0", troves: "0" }
    );

    return profits;
  }

  public async getTotalDeposited(
    address: string
  ): Promise<{ vesu: string; troves: string }> {
    const positions = await this.getPositions(address);

    return positions.reduce(
      (acc, pos) => {
        if (pos.protocol === "vesu") {
          acc.vesu = (parseFloat(acc.vesu) + parseFloat(pos.amount)).toString();
        } else {
          acc.troves = (
            parseFloat(acc.troves) + parseFloat(pos.amount)
          ).toString();
        }
        console.log("positions");
        console.error();
        return acc;
      },
      { vesu: "0", troves: "0" }
    );
  }
}

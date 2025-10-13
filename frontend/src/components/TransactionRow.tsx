import { ArrowDown, ArrowUp, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface TransactionRowProps {
  type: "deposit" | "withdrawal" | "payment" | "yield" | "withdraw" | "yield_claim" | "lightning_payment" | "bridge" | "swap";
  amount?: string;
  amountBtc?: number;
  token?: string;
  date?: string;
  timestamp?: number;
  status: "completed" | "pending" | "failed" | "confirmed";
  description?: string;
  protocol?: string;
}

export default function TransactionRow({
  type,
  amount,
  amountBtc,
  token,
  date,
  timestamp,
  status,
  description,
  protocol,
}: TransactionRowProps) {
  const icons = {
    deposit: ArrowDown,
    withdrawal: ArrowUp,
    withdraw: ArrowUp,
    payment: Zap,
    lightning_payment: Zap,
    yield: TrendingUp,
    yield_claim: TrendingUp,
    bridge: ArrowDown,
    swap: ArrowDown,
  };

  const iconColors = {
    deposit: "text-[rgb(48,209,88)]",
    withdrawal: "text-[rgb(255,69,58)]",
    withdraw: "text-[rgb(255,69,58)]",
    payment: "text-[rgb(0,122,255)]",
    lightning_payment: "text-[rgb(0,122,255)]",
    yield: "text-[rgb(48,209,88)]",
    yield_claim: "text-[rgb(48,209,88)]",
    bridge: "text-[rgb(48,209,88)]",
    swap: "text-[rgb(0,122,255)]",
  };

  const labels = {
    deposit: "Deposit",
    withdrawal: "Withdrawal",
    withdraw: "Withdrawal",
    payment: "Payment",
    lightning_payment: "Lightning Payment",
    yield: "Yield Earned",
    yield_claim: "Yield Claimed",
    bridge: "Bridge",
    swap: "Swap",
  }; const Icon = icons[type] || ArrowDown;
  const isPositive = ["deposit", "yield", "yield_claim", "bridge"].includes(type);

  // Handle both old and new data formats
  const displayAmount = amount || (amountBtc ? amountBtc.toString() : '0');
  const displayToken = token || 'BTC';
  const displayDate = date || (timestamp ? new Date(timestamp).toLocaleDateString() : 'Unknown');
  const displayDescription = description || labels[type] || 'Transaction';

  return (
    <motion.div
      className="flex items-center gap-4 p-4 bg-[rgb(25,25,35)] rounded-[12px] border border-[rgb(45,45,55)]"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
    >
      {/* Icon */}
      <div
        className={`p-2.5 rounded-full bg-[rgb(35,35,45)] ${iconColors[type] || iconColors.deposit}`}
      >
        <Icon className="w-5 h-5" strokeWidth={1.5} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="body-primary text-primary">
          {displayDescription}
          {protocol && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
              {protocol}
            </span>
          )}
        </div>
        <div className="body-secondary text-secondary">{displayDate}</div>
      </div>

      {/* Amount */}
      <div className="text-right">
        <div
          className={`body-primary ${isPositive ? "text-[rgb(48,209,88)]" : "text-[rgb(245,245,255)]"
            }`}
        >
          {isPositive ? "+" : "-"}
          {displayToken === 'USDC' ? '$' : ''}
          {parseFloat(displayAmount).toFixed(displayToken === 'USDC' ? 2 : 5)} {displayToken}
        </div>
        {(status === "pending" || status === "confirmed") && (
          <div className="body-secondary text-[rgb(255,165,0)]">
            {status === "confirmed" ? "Confirmed" : "Pending"}
          </div>
        )}
        {status === "failed" && (
          <div className="body-secondary text-[rgb(255,69,58)]">Failed</div>
        )}
      </div>
    </motion.div>
  );
}

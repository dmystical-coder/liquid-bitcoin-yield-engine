import { ArrowDown, ArrowUp, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface TransactionRowProps {
  type: "deposit" | "withdrawal" | "payment" | "yield";
  amountBtc: number;
  date: string;
  status: "completed" | "pending" | "failed";
}

export default function TransactionRow({
  type,
  amountBtc,
  date,
  status,
}: TransactionRowProps) {
  const icons = {
    deposit: ArrowDown,
    withdrawal: ArrowUp,
    payment: Zap,
    yield: TrendingUp,
  };

  const iconColors = {
    deposit: "text-[rgb(48,209,88)]",
    withdrawal: "text-[rgb(255,69,58)]",
    payment: "text-[rgb(0,122,255)]",
    yield: "text-[rgb(48,209,88)]",
  };

  const labels = {
    deposit: "Deposit",
    withdrawal: "Withdrawal",
    payment: "Payment",
    yield: "Yield Earned",
  };

  const Icon = icons[type];
  const isPositive = type === "deposit" || type === "yield";

  return (
    <motion.div
      className="flex items-center gap-4 p-4 bg-[rgb(25,25,35)] rounded-[12px] border border-[rgb(45,45,55)]"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
    >
      {/* Icon */}
      <div
        className={`p-2.5 rounded-full bg-[rgb(35,35,45)] ${iconColors[type]}`}
      >
        <Icon className="w-5 h-5" strokeWidth={1.5} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="body-primary text-primary">{labels[type]}</div>
        <div className="body-secondary text-secondary">{date}</div>
      </div>

      {/* Amount */}
      <div className="text-right">
        <div
          className={`body-primary ${
            isPositive ? "text-[rgb(48,209,88)]" : "text-[rgb(245,245,255)]"
          }`}
        >
          {isPositive ? "+" : "-"}
          {Math.abs(amountBtc).toFixed(5)} BTC
        </div>
        {status === "pending" && (
          <div className="body-secondary text-[rgb(255,165,0)]">Pending</div>
        )}
        {status === "failed" && (
          <div className="body-secondary text-[rgb(255,69,58)]">Failed</div>
        )}
      </div>
    </motion.div>
  );
}

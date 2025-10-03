import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface BalanceDisplayProps {
  btcAmount: number;
  usdAmount: number;
  showAPY?: boolean;
  apy?: number;
}

export default function BalanceDisplay({
  btcAmount,
  usdAmount,
  showAPY = false,
  apy = 0,
}: BalanceDisplayProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="display-large text-primary"
        key={`btc-${btcAmount}`}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {btcAmount.toFixed(5)} BTC
      </motion.div>

      <motion.div
        className="display-small text-secondary"
        key={`usd-${usdAmount}`}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        $
        {usdAmount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </motion.div>

      {showAPY && apy > 0 && (
        <motion.div
          className="flex items-center gap-1 px-3 py-1.5 bg-[rgb(48,209,88)]/10 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TrendingUp
            className="w-4 h-4 text-[rgb(48,209,88)]"
            strokeWidth={2}
          />
          <span className="body-secondary text-[rgb(48,209,88)]">
            {apy.toFixed(2)}% APY
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

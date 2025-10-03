import { motion } from "framer-motion";
import { useEffect } from "react";
import BalanceDisplay from "../components/BalanceDisplay";
import TransactionRow from "../components/TransactionRow";
import BottomNav from "../components/BottomNav";
import useAppStore from "../store/useAppStore";
import ResponsiveContainer from "../components/ResponsiveContainer";

export default function DashboardScreen() {
  const {
    balance,
    yieldInfo,
    transactions,
    activeTab,
    setActiveTab,
    fetchDashboardData,
  } = useAppStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Open modals based on tab
    if (tab === "Pay") {
      useAppStore.getState().setPayModalOpen(true);
      setActiveTab("Home");
    } else if (tab === "AddFunds") {
      useAppStore.getState().setAddFundsModalOpen(true);
      setActiveTab("Home");
    } else if (tab === "More") {
      useAppStore.getState().setMoreScreenOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <ResponsiveContainer>
          {/* Balance Section */}
          <motion.div
            className="pt-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BalanceDisplay
              btcAmount={balance.btc}
              usdAmount={balance.usd}
              showAPY={true}
              apy={yieldInfo.apy}
            />
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="body-primary font-semibold text-primary mb-4">
              Recent Activity
            </h2>

            <div className="flex flex-col gap-3">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-secondary body-primary">
                    No transactions yet
                  </p>
                </div>
              ) : (
                transactions.map((transaction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TransactionRow {...transaction} />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </ResponsiveContainer>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

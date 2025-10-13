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
    dashboardData,
    recentDemoTransactions,
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
              btcAmount={dashboardData ? parseFloat(dashboardData.btcBalance) : balance.btc}
              usdAmount={dashboardData ? parseFloat(dashboardData.totalBalance) : balance.usd}
              showAPY={true}
              apy={dashboardData ? 9.2 : yieldInfo.apy}
            />
          </motion.div>

          {/* Active Yield Positions */}
          {dashboardData?.positions && dashboardData.positions.length > 0 && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="body-primary font-semibold text-primary">
                  Active Positions
                </h2>
                <button
                  onClick={() => useAppStore.getState().setYieldStrategiesModalOpen(true)}
                  className="text-[rgb(0,122,255)] text-sm font-medium hover:underline"
                >
                  Manage
                </button>
              </div>

              <div className="grid gap-3">
                {dashboardData.positions.map((position, index) => (
                  <motion.div
                    key={index}
                    className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-[12px] border border-green-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{position.protocol}</span>
                          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {position.apy}% APY
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{position.strategy}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Deposited: ${position.deposited}</span>
                          <span className="text-green-600 font-medium">Earned: +${position.earned}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

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
              {/* Show demo transactions if available, fallback to regular transactions */}
              {(recentDemoTransactions.length > 0 ? recentDemoTransactions : transactions).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-secondary body-primary">
                    No transactions yet
                  </p>
                </div>
              ) : (
                (recentDemoTransactions.length > 0 ? recentDemoTransactions : transactions).map((transaction, index) => (
                  <motion.div
                    key={'id' in transaction ? transaction.id : index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TransactionRow
                      type={transaction.type}
                      amount={'amount' in transaction ? transaction.amount : undefined}
                      token={'token' in transaction ? transaction.token : undefined}
                      amountBtc={'amountBtc' in transaction ? transaction.amountBtc : undefined}
                      date={'date' in transaction ? transaction.date : undefined}
                      status={transaction.status}
                      timestamp={'timestamp' in transaction ? transaction.timestamp : undefined}
                      description={'description' in transaction ? transaction.description : undefined}
                      protocol={'protocol' in transaction ? transaction.protocol : undefined}
                    />
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

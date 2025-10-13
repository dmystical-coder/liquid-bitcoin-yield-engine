import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import Button from "../components/Button";
import Input from "../components/Input";
import useAppStore from "../store/useAppStore";
import { TrendingUp, Shield, Zap, Clock, DollarSign, AlertTriangle } from "lucide-react";

export default function YieldStrategiesModal() {
  const {
    isYieldStrategiesModalOpen,
    setYieldStrategiesModalOpen,
    availableStrategies,
    dashboardData,
    depositToYieldStrategy,
    isLoading,
    fetchDemoData
  } = useAppStore();

  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [showDepositForm, setShowDepositForm] = useState(false);

  useEffect(() => {
    if (isYieldStrategiesModalOpen) {
      fetchDemoData();
    }
  }, [isYieldStrategiesModalOpen, fetchDemoData]);

  const handleDeposit = async () => {
    if (selectedStrategyId && depositAmount) {
      try {
        await depositToYieldStrategy(selectedStrategyId, depositAmount);
        setDepositAmount('');
        setShowDepositForm(false);
        setSelectedStrategyId('');
        setYieldStrategiesModalOpen(false);
      } catch (error) {
        console.error('Deposit failed:', error);
      }
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <Shield className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <Zap className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const handleClose = () => {
    setYieldStrategiesModalOpen(false);
    setShowDepositForm(false);
    setSelectedStrategyId('');
    setDepositAmount('');
  };

  const currentUSDC = dashboardData?.usdcBalance ? parseFloat(dashboardData.usdcBalance) : 0;

  return (
    <Modal
      isOpen={isYieldStrategiesModalOpen}
      onClose={handleClose}
      title={showDepositForm ? "Deposit to Strategy" : "DeFi Yield Strategies"}
    >
      <div className="flex flex-col gap-6">
        {!showDepositForm ? (
          <>
            {/* Portfolio Summary */}
            {dashboardData && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-[12px] border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Available USDC</span>
                  <span className="text-lg font-bold text-gray-900">${dashboardData.usdcBalance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Total Yield Earned</span>
                  <span className="text-lg font-bold text-green-600">+${dashboardData.totalYieldEarned}</span>
                </div>
              </div>
            )}

            {/* Active Positions */}
            {dashboardData?.positions && dashboardData.positions.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Active Positions</h3>
                <div className="space-y-3">
                  {dashboardData.positions.map((position, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{position.protocol}</p>
                          <p className="text-sm text-gray-600">{position.strategy}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${position.deposited}</p>
                          <p className="text-sm text-green-600">+${position.earned} earned</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-sm text-gray-600">{position.apy}% APY</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Strategies */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Available Strategies</h3>
              <div className="space-y-3">
                {availableStrategies.map((strategy) => (
                  <div key={strategy.id} className="p-4 border rounded-[12px] hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{strategy.name}</h4>
                          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {strategy.protocol}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{strategy.description}</p>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="font-semibold text-green-600">{strategy.apy}% APY</span>
                          </div>
                          <div className={`flex items-center gap-1 ${getRiskColor(strategy.riskLevel)}`}>
                            {getRiskIcon(strategy.riskLevel)}
                            <span className="capitalize">{strategy.riskLevel} Risk</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <DollarSign className="w-3 h-3" />
                            <span>Min: ${strategy.minimumDeposit}</span>
                          </div>
                        </div>

                        {strategy.lockPeriod && (
                          <div className="flex items-center gap-1 text-sm text-orange-600 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>Lock: {strategy.lockPeriod}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">TVL: {strategy.tvl}</span>
                          {strategy.rewards && (
                            <div className="flex gap-1">
                              {strategy.rewards.map((reward, i) => (
                                <span key={i} className="px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">
                                  {reward}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSelectedStrategyId(strategy.id);
                        setShowDepositForm(true);
                      }}
                      className="w-full"
                      disabled={currentUSDC < strategy.minimumDeposit}
                    >
                      {currentUSDC < strategy.minimumDeposit
                        ? `Need $${strategy.minimumDeposit} minimum`
                        : "Deposit to Strategy"
                      }
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Deposit Form */
          <>
            {(() => {
              const strategy = availableStrategies.find(s => s.id === selectedStrategyId);
              return strategy ? (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{strategy.name}</h4>
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {strategy.protocol}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="font-semibold text-green-600">{strategy.apy}% APY</span>
                      </div>
                      <div className={`flex items-center gap-1 ${getRiskColor(strategy.riskLevel)}`}>
                        {getRiskIcon(strategy.riskLevel)}
                        <span className="capitalize">{strategy.riskLevel} Risk</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deposit Amount (USDC)
                    </label>
                    <Input
                      type="number"
                      value={depositAmount}
                      onChange={setDepositAmount}
                      placeholder={`Minimum: ${strategy.minimumDeposit}`}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Available: ${currentUSDC.toFixed(2)}</span>
                      <button
                        onClick={() => setDepositAmount(Math.min(currentUSDC, 1000).toString())}
                        className="text-blue-600 hover:underline"
                      >
                        Use Max
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => setShowDepositForm(false)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleDeposit}
                      isLoading={isLoading}
                      disabled={!depositAmount || parseFloat(depositAmount) < strategy.minimumDeposit}
                      className="flex-1"
                    >
                      Deposit ${depositAmount || '0'}
                    </Button>
                  </div>
                </div>
              ) : null;
            })()}
          </>
        )}
      </div>
    </Modal>
  );
}

import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import Button from "../components/Button";
import StrategyCard from "../components/StrategyCard";
import useAppStore from "../store/useAppStore";
import * as api from "../services/apiService";

export default function YieldStrategiesModal() {
  const {
    isYieldStrategiesModalOpen,
    setYieldStrategiesModalOpen,
    yieldInfo,
    updateStrategy,
    isLoading,
  } = useAppStore();

  const [strategies, setStrategies] = useState<any[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState(
    yieldInfo.currentStrategy
  );

  useEffect(() => {
    if (isYieldStrategiesModalOpen) {
      loadStrategies();
    }
  }, [isYieldStrategiesModalOpen]);

  const loadStrategies = async () => {
    const data = await api.getYieldStrategies();
    setStrategies(data);
  };

  const handleConfirm = async () => {
    if (selectedStrategy !== yieldInfo.currentStrategy) {
      await updateStrategy(selectedStrategy as "Standard" | "Turbo" | "Maxi");
    } else {
      setYieldStrategiesModalOpen(false);
    }
  };

  const handleClose = () => {
    setYieldStrategiesModalOpen(false);
    setSelectedStrategy(yieldInfo.currentStrategy);
  };

  return (
    <Modal
      isOpen={isYieldStrategiesModalOpen}
      onClose={handleClose}
      title="Select Your Yield Strategy"
    >
      <div className="flex flex-col gap-6">
        {/* Info */}
        <div className="p-4 bg-[rgb(0,122,255)]/10 rounded-[12px] border border-[rgb(0,122,255)]/20">
          <p className="body-secondary text-secondary">
            Choose how your Bitcoin earns yield. You can change this anytime.
          </p>
        </div>

        {/* Strategies */}
        <div className="flex flex-col gap-3">
          {strategies.map((strategy) => (
            <StrategyCard
              key={strategy.name}
              title={strategy.name}
              apyRange={strategy.apyRange}
              description={strategy.description}
              isActive={selectedStrategy === strategy.name}
              onSelect={() => setSelectedStrategy(strategy.name)}
            />
          ))}
        </div>

        {/* Confirm Button */}
        <Button
          variant="primary"
          onClick={handleConfirm}
          isLoading={isLoading}
          disabled={selectedStrategy === yieldInfo.currentStrategy}
          className="w-full"
        >
          {selectedStrategy === yieldInfo.currentStrategy
            ? "Current Strategy"
            : "Confirm Change"}
        </Button>
      </div>
    </Modal>
  );
}

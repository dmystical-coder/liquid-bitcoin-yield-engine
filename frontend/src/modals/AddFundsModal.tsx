import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Button from "../components/Button";
import Input from "../components/Input";
import useAppStore from "../store/useAppStore";
import { Copy, Check, Zap, ArrowRight, Clock, CheckCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function AddFundsModal() {
  const {
    isAddFundsModalOpen,
    setAddFundsModalOpen,
    depositAddress,
    fetchDepositAddress,
    user,
    xverseBalance,
    fetchXverseBalance,
    bridgeBitcoin,
    isLoading,
    dashboardData,
    recentDemoTransactions
  } = useAppStore();

  const [copied, setCopied] = useState(false);
  const [btcAmount, setBtcAmount] = useState('');
  const [step, setStep] = useState<'amount' | 'address' | 'pending' | 'complete'>('amount');
  const [bridgeTransaction, setBridgeTransaction] = useState<any>(null);

  useEffect(() => {
    if (
      isAddFundsModalOpen &&
      !depositAddress &&
      user.authMethod !== "xverse"
    ) {
      fetchDepositAddress();
    }
    if (isAddFundsModalOpen && user.authMethod === "xverse") {
      fetchXverseBalance();
    }
  }, [
    isAddFundsModalOpen,
    depositAddress,
    user.authMethod,
    fetchDepositAddress,
    fetchXverseBalance,
  ]);

  const handleCopy = () => {
    if (depositAddress) {
      navigator.clipboard.writeText(depositAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Monitor for completed bridge transactions
  useEffect(() => {
    if (bridgeTransaction) {
      const tx = recentDemoTransactions.find(t => t.id === bridgeTransaction.id);
      if (tx && tx.status === 'confirmed') {
        setStep('complete');
      }
    }
  }, [recentDemoTransactions, bridgeTransaction]);

  const handleStartBridge = async () => {
    if (!btcAmount || parseFloat(btcAmount) <= 0) return;

    setStep('pending');
    try {
      const tx = await bridgeBitcoin(btcAmount);
      setBridgeTransaction(tx);

      // Generate deposit address for this bridge
      await fetchDepositAddress();
      setStep('address');
    } catch (error) {
      console.error('Bridge failed:', error);
      setStep('amount');
    }
  };

  const handleSimulateDeposit = () => {
    if (depositAddress) {
      setStep('pending');

      // Simulate BTC confirmation after 10 seconds
      setTimeout(() => {
        setStep('complete');
      }, 10000);
    }
  };

  const handleClose = () => {
    setAddFundsModalOpen(false);
    setCopied(false);
    setStep('amount');
    setBtcAmount('');
    setBridgeTransaction(null);
  };

  const getStepTitle = () => {
    switch (step) {
      case 'amount': return 'Add Funds';
      case 'address': return 'Send Bitcoin';
      case 'pending': return 'Processing...';
      case 'complete': return 'Deposit Complete';
      default: return 'Add Funds';
    }
  };

  return (
    <Modal isOpen={isAddFundsModalOpen} onClose={handleClose} title={getStepTitle()}>
      {step === 'amount' && (
        <div className="flex flex-col gap-6">
          {/* Amount Input */}
          <div className="flex flex-col gap-3">
            <label className="body-secondary text-secondary">
              How much Bitcoin do you want to deposit?
            </label>
            <Input
              type="number"
              placeholder="0.00000000"
              value={btcAmount}
              onChange={setBtcAmount}
              className="text-right"
            />
            <div className="flex justify-between text-sm">
              <span className="text-secondary">≈ ${((parseFloat(btcAmount) || 0) * 65000).toLocaleString()} USD</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setBtcAmount('0.001')}
                  className="text-[rgb(0,122,255)] hover:underline"
                >
                  0.001
                </button>
                <button
                  onClick={() => setBtcAmount('0.01')}
                  className="text-[rgb(0,122,255)] hover:underline"
                >
                  0.01
                </button>
                <button
                  onClick={() => setBtcAmount('0.1')}
                  className="text-[rgb(0,122,255)] hover:underline"
                >
                  0.1
                </button>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            variant="primary"
            onClick={handleStartBridge}
            disabled={!btcAmount || parseFloat(btcAmount) <= 0 || isLoading}
            isLoading={isLoading}
            className="w-full"
          >
            <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
            Continue to Deposit
          </Button>

          {/* Info */}
          <div className="p-4 bg-[rgb(0,122,255)]/10 rounded-[12px] border border-[rgb(0,122,255)]/20">
            <p className="body-secondary text-secondary">
              Your Bitcoin will be bridged to Starknet and converted to USDC for yield farming.
            </p>
          </div>
        </div>
      )}

      {step === 'address' && (
        <div className="flex flex-col gap-6">
          {/* Amount Summary */}
          <div className="p-4 bg-[rgb(10,10,15)] rounded-[12px] border border-[rgb(45,45,55)]">
            <div className="flex justify-between">
              <span className="body-secondary text-secondary">Depositing</span>
              <span className="body-secondary text-primary">{btcAmount} BTC</span>
            </div>
            <div className="flex justify-between">
              <span className="body-secondary text-secondary">Expected USDC</span>
              <span className="body-secondary text-primary">≈ ${((parseFloat(btcAmount) || 0) * 65000).toLocaleString()}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center p-8 bg-white rounded-[16px]">
            {depositAddress ? (
              <QRCodeSVG
                value={`bitcoin:${depositAddress}?amount=${btcAmount}`}
                size={200}
                level="H"
                includeMargin={true}
              />
            ) : (
              <div className="w-[200px] h-[200px] flex items-center justify-center bg-[rgb(25,25,35)]">
                <div className="animate-spin w-8 h-8 border-4 border-[rgb(0,122,255)] border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>

          {/* Address Display */}
          <div className="flex flex-col gap-3">
            <label className="body-secondary text-secondary">
              Send exactly {btcAmount} BTC to:
            </label>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-3 bg-[rgb(10,10,15)] rounded-[12px] border border-[rgb(45,45,55)] break-all body-secondary text-primary">
                {depositAddress || "Loading..."}
              </div>
              <Button
                variant="secondary"
                onClick={handleCopy}
                disabled={!depositAddress}
                className="!px-4"
              >
                {copied ? (
                  <Check
                    className="w-5 h-5 text-[rgb(48,209,88)]"
                    strokeWidth={2}
                  />
                ) : (
                  <Copy className="w-5 h-5" strokeWidth={1.5} />
                )}
              </Button>
            </div>
          </div>

          {/* Simulate Button for Demo */}
          <Button
            variant="primary"
            onClick={handleSimulateDeposit}
            className="w-full"
          >
            <Clock className="w-5 h-5" strokeWidth={1.5} />
            Simulate Bitcoin Deposit (Demo)
          </Button>

          {/* Info */}
          <div className="p-4 bg-[rgb(0,122,255)]/10 rounded-[12px] border border-[rgb(0,122,255)]/20">
            <p className="body-secondary text-secondary">
              Send Bitcoin to this address. Your deposit will be confirmed after 1 block confirmation and bridged to Starknet USDC.
            </p>
          </div>
        </div>
      )}

      {step === 'pending' && (
        <div className="flex flex-col gap-6 items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[rgb(0,122,255)]/20 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-[rgb(0,122,255)] border-t-transparent rounded-full"></div>
          </div>

          <div>
            <h3 className="heading-3 text-primary mb-2">Processing Deposit</h3>
            <p className="body-secondary text-secondary">
              Waiting for Bitcoin confirmation and bridging to Starknet...
            </p>
          </div>

          <div className="w-full p-4 bg-[rgb(10,10,15)] rounded-[12px]">
            <div className="flex justify-between mb-2">
              <span className="body-secondary text-secondary">Amount</span>
              <span className="body-secondary text-primary">{btcAmount} BTC</span>
            </div>
            <div className="flex justify-between">
              <span className="body-secondary text-secondary">Status</span>
              <span className="body-secondary text-[rgb(255,159,10)]">Confirming...</span>
            </div>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div className="flex flex-col gap-6 items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[rgb(48,209,88)]/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-[rgb(48,209,88)]" strokeWidth={1.5} />
          </div>

          <div>
            <h3 className="heading-3 text-primary mb-2">Deposit Complete!</h3>
            <p className="body-secondary text-secondary">
              Your Bitcoin has been successfully bridged to USDC on Starknet.
            </p>
          </div>

          <div className="w-full p-4 bg-[rgb(10,10,15)] rounded-[12px]">
            <div className="flex justify-between mb-2">
              <span className="body-secondary text-secondary">Deposited</span>
              <span className="body-secondary text-primary">{btcAmount} BTC</span>
            </div>
            <div className="flex justify-between">
              <span className="body-secondary text-secondary">Received</span>
              <span className="body-secondary text-[rgb(48,209,88)]">${((parseFloat(btcAmount) || 0) * 65000).toLocaleString()} USDC</span>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleClose}
            className="w-full"
          >
            Start Earning Yield
          </Button>
        </div>
      )}
    </Modal>
  );
}

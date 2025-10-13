import { useState } from "react";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Button from "../components/Button";
import QRScanner from "../components/QRScanner";
import useAppStore from "../store/useAppStore";
import { Scan, Zap, Coffee, Utensils, ShoppingCart, Gamepad2 } from "lucide-react";

export default function PayModal() {
  const { isPayModalOpen, setPayModalOpen, initiatePayment, makeLightningPayment, dashboardData, isLoading } =
    useAppStore();
  const [invoice, setInvoice] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [showQuickPay, setShowQuickPay] = useState(true);
  const [customAmount, setCustomAmount] = useState("");

  // Quick pay options for demo
  const quickPayOptions = [
    { name: "Coffee Shop", amount: "0.00015", icon: Coffee, description: "Local Cafe" },
    { name: "Restaurant", amount: "0.00085", icon: Utensils, description: "Dinner for 2" },
    { name: "Online Store", amount: "0.0003", icon: ShoppingCart, description: "Digital goods" },
    { name: "Gaming Credit", amount: "0.0005", icon: Gamepad2, description: "In-game purchase" },
  ];

  const handlePay = async () => {
    if (!invoice.trim()) return;
    await initiatePayment(invoice);
    setInvoice("");
    setShowScanner(false);
  };

  const handleQuickPay = async (option: typeof quickPayOptions[0]) => {
    await makeLightningPayment(option.amount, `Payment to ${option.name}`);
    setPayModalOpen(false);
  };

  const handleCustomPay = async () => {
    if (!customAmount) return;
    await makeLightningPayment(customAmount, "Custom Lightning payment");
    setCustomAmount("");
    setPayModalOpen(false);
  };

  const handleClose = () => {
    setPayModalOpen(false);
    setInvoice("");
    setShowScanner(false);
    setShowQuickPay(true);
    setCustomAmount("");
  };

  const availableBTC = dashboardData ? parseFloat(dashboardData.btcBalance) : 0;

  return (
    <Modal
      isOpen={isPayModalOpen}
      onClose={handleClose}
      title="Pay with Lightning"
    >
      <div className="flex flex-col gap-6">
        {/* Balance Display */}
        <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-[12px] border border-orange-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Available Bitcoin</span>
            <span className="text-lg font-bold text-gray-900">
              ⚡ {availableBTC.toFixed(5)} BTC
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ~${(availableBTC * 65000).toFixed(2)} USD
          </div>
        </div>

        {/* Toggle between quick pay and manual */}
        <div className="flex border border-gray-200 rounded-[8px] overflow-hidden">
          <button
            onClick={() => setShowQuickPay(true)}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${showQuickPay
                ? 'bg-blue-500 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
          >
            Quick Pay
          </button>
          <button
            onClick={() => setShowQuickPay(false)}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${!showQuickPay
                ? 'bg-blue-500 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
          >
            Manual Invoice
          </button>
        </div>

        {showQuickPay ? (
          /* Quick Pay Options */
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Demo Merchants</h3>
            {quickPayOptions.map((option, index) => {
              const Icon = option.icon;
              const amountUSD = (parseFloat(option.amount) * 65000).toFixed(2);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-[12px] hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-[8px]">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{option.name}</p>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">⚡ {option.amount} BTC</p>
                    <p className="text-sm text-gray-500">${amountUSD}</p>
                    <Button
                      variant="secondary"
                      onClick={() => handleQuickPay(option)}
                      isLoading={isLoading}
                      className="mt-2 text-xs px-3 py-1"
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              );
            })}

            {/* Custom Amount */}
            <div className="p-4 border border-dashed border-gray-300 rounded-[12px]">
              <p className="text-sm font-medium text-gray-700 mb-3">Custom Amount</p>
              <div className="flex gap-3">
                <Input
                  type="number"
                  value={customAmount}
                  onChange={setCustomAmount}
                  placeholder="0.00001"
                  className="flex-1"
                />
                <Button
                  variant="primary"
                  onClick={handleCustomPay}
                  isLoading={isLoading}
                  disabled={!customAmount}
                  className="px-6"
                >
                  Pay
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Min: 0.00001 BTC | Max: {availableBTC.toFixed(5)} BTC
              </div>
            </div>
          </div>
        ) : (
          /* Manual Invoice Input */
          <>
            {/* QR Scanner Section */}
            {showScanner ? (
              <div className="relative aspect-square bg-[rgb(10,10,15)] rounded-[16px] overflow-hidden">
                <video
                  id="qr-video"
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white rounded-[12px] relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[rgb(0,122,255)]"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[rgb(0,122,255)]"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[rgb(0,122,255)]"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[rgb(0,122,255)]"></div>
                  </div>
                </div>
                <button
                  onClick={() => setShowScanner(false)}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
                >
                  <Scan className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowScanner(true)}
                className="aspect-square bg-[rgb(10,10,15)] rounded-[16px] flex items-center justify-center hover:bg-[rgb(20,20,25)] transition-colors border-2 border-dashed border-[rgb(45,45,55)] hover:border-[rgb(0,122,255)]"
              >
                <div className="text-center">
                  <Scan
                    className="w-16 h-16 text-action mx-auto mb-3"
                    strokeWidth={1.5}
                  />
                  <p className="text-action body-primary font-semibold">
                    Scan QR Code
                  </p>
                </div>
              </button>
            )}

            {/* Manual Input */}
            <div className="flex flex-col gap-3">
              <div className="relative">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center">
                  <div className="flex-1 border-t border-[rgb(45,45,55)]"></div>
                  <span className="px-3 text-secondary body-secondary">or</span>
                  <div className="flex-1 border-t border-[rgb(45,45,55)]"></div>
                </div>
              </div>

              <Input
                value={invoice}
                onChange={setInvoice}
                placeholder="Paste Lightning invoice"
                label="Lightning Invoice"
              />

              <Button
                variant="primary"
                onClick={handlePay}
                isLoading={isLoading}
                disabled={!invoice.trim()}
                className="w-full"
              >
                Pay Invoice
              </Button>
            </div>
          </>
        )}
      </div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={(result) => {
          setInvoice(result);
          setShowScanner(false);
        }}
        title="Scan Lightning Invoice"
        description="Point your camera at a Lightning QR code"
      />
    </Modal>
  );
}

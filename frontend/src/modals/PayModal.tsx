import { useState } from "react";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Button from "../components/Button";
import useAppStore from "../store/useAppStore";
import { Scan } from "lucide-react";

export default function PayModal() {
  const { isPayModalOpen, setPayModalOpen, initiatePayment, isLoading } =
    useAppStore();
  const [invoice, setInvoice] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const handlePay = async () => {
    if (!invoice.trim()) return;
    await initiatePayment(invoice);
    setInvoice("");
    setShowScanner(false);
  };

  const handleClose = () => {
    setPayModalOpen(false);
    setInvoice("");
    setShowScanner(false);
  };

  return (
    <Modal
      isOpen={isPayModalOpen}
      onClose={handleClose}
      title="Pay with Lightning"
    >
      <div className="flex flex-col gap-6">
        {/* QR Scanner Section */}
        {showScanner ? (
          <div className="relative aspect-square bg-[rgb(10,10,15)] rounded-[16px] flex items-center justify-center">
            {/* Placeholder for QR scanner - requires react-qr-reader */}
            <div className="text-center">
              <Scan
                className="w-16 h-16 text-secondary mx-auto mb-4"
                strokeWidth={1.5}
              />
              <p className="text-secondary body-primary">
                QR Scanner placeholder
              </p>
              <p className="text-secondary body-secondary mt-2">
                Install react-qr-reader to enable scanning
              </p>
            </div>
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
      </div>
    </Modal>
  );
}

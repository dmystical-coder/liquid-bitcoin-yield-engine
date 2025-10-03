import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Button from "../components/Button";
import useAppStore from "../store/useAppStore";
import { Copy, Check, Zap } from "lucide-react";
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
  } = useAppStore();

  const [copied, setCopied] = useState(false);

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

  const handleClose = () => {
    setAddFundsModalOpen(false);
    setCopied(false);
  };

  return (
    <Modal isOpen={isAddFundsModalOpen} onClose={handleClose} title="Add Funds">
      {user.authMethod === "xverse" ? (
        // Xverse-specific deposit flow
        <div className="flex flex-col gap-6">
          <div className="p-6 bg-[rgb(10,10,15)] rounded-[16px] text-center">
            <p className="body-secondary text-secondary mb-2">
              Your Xverse Balance
            </p>
            <p className="display-small text-primary">
              {xverseBalance?.toFixed(5) || "0.00000"} BTC
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button variant="primary" className="w-full">
              <Zap className="w-5 h-5" strokeWidth={1.5} />
              Deposit via Lightning ⚡️
            </Button>

            <Button variant="secondary" className="w-full">
              Deposit On-Chain
            </Button>
          </div>
        </div>
      ) : (
        // Standard deposit flow (social/passkey)
        <div className="flex flex-col gap-6">
          {/* QR Code */}
          <div className="flex justify-center p-8 bg-white rounded-[16px]">
            {depositAddress ? (
              <QRCodeSVG
                value={depositAddress}
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
              Bitcoin Address
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

          {/* Info */}
          <div className="p-4 bg-[rgb(0,122,255)]/10 rounded-[12px] border border-[rgb(0,122,255)]/20">
            <p className="body-secondary text-secondary">
              Send Bitcoin to this address. Your deposit will be confirmed after
              1 block confirmation.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}

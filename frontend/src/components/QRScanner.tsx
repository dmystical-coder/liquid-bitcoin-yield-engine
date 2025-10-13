import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { X, Camera, CameraOff } from 'lucide-react';
import Button from './Button';

interface QRScannerProps {
    isOpen: boolean;
    onClose: () => void;
    onScan: (result: string) => void;
    title?: string;
    description?: string;
}

export default function QRScanner({
    isOpen,
    onClose,
    onScan,
    title = "Scan QR Code",
    description = "Point your camera at a QR code to scan"
}: QRScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string>('');
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const readerRef = useRef<BrowserMultiFormatReader | null>(null);

    useEffect(() => {
        if (isOpen) {
            startScanning();
        } else {
            stopScanning();
        }

        return () => {
            stopScanning();
        };
    }, [isOpen]);

    const startScanning = async () => {
        try {
            setError('');
            setIsScanning(true);

            // Request camera permission
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setHasPermission(true);

            // Stop the temporary stream
            stream.getTracks().forEach(track => track.stop());

            // Initialize ZXing reader
            const codeReader = new BrowserMultiFormatReader();
            readerRef.current = codeReader;

            if (videoRef.current) {
                try {
                    const result = await codeReader.decodeOnceFromVideoDevice(undefined, videoRef.current);

                    if (result) {
                        onScan(result.getText());
                        onClose();
                    }
                } catch (err) {
                    if (err instanceof NotFoundException) {
                        // Continue scanning - this is normal when no QR code is found
                        console.log('No QR code found, continuing to scan...');
                    } else {
                        console.error('Scanning error:', err);
                        setError('Failed to scan QR code. Please try again.');
                    }
                }
            }
        } catch (err) {
            console.error('Camera access error:', err);
            setHasPermission(false);
            setError('Camera access denied. Please enable camera permissions and try again.');
        } finally {
            setIsScanning(false);
        }
    };

    const stopScanning = () => {
        if (readerRef.current) {
            readerRef.current.reset();
            readerRef.current = null;
        }
        setIsScanning(false);
    };

    const handleRetry = () => {
        setError('');
        setHasPermission(null);
        startScanning();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[16px] w-full max-w-md mx-auto shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="heading-3 text-primary">{title}</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-secondary" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    {description && (
                        <p className="body-secondary text-secondary mb-4 text-center">
                            {description}
                        </p>
                    )}

                    {/* Camera View */}
                    <div className="relative bg-black rounded-[12px] overflow-hidden mb-4">
                        <video
                            ref={videoRef}
                            className="w-full aspect-square object-cover"
                            autoPlay
                            playsInline
                            muted
                        />

                        {/* Scanning Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 border-2 border-white rounded-[12px] relative">
                                {/* Corner indicators */}
                                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[rgb(0,122,255)]"></div>
                                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[rgb(0,122,255)]"></div>
                                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[rgb(0,122,255)]"></div>
                                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[rgb(0,122,255)]"></div>

                                {/* Scanning line animation */}
                                {isScanning && (
                                    <div className="absolute top-0 left-0 w-full h-0.5 bg-[rgb(0,122,255)] animate-pulse"></div>
                                )}
                            </div>
                        </div>

                        {/* Status indicators */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            {isScanning ? (
                                <div className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full">
                                    <Camera className="w-4 h-4" />
                                    <span className="text-sm font-medium">Scanning...</span>
                                </div>
                            ) : hasPermission === false ? (
                                <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
                                    <CameraOff className="w-4 h-4" />
                                    <span className="text-sm font-medium">No Camera</span>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 mb-4">
                            <p className="body-secondary text-red-600 text-center mb-3">{error}</p>
                            <Button
                                variant="secondary"
                                onClick={handleRetry}
                                className="w-full"
                            >
                                Try Again
                            </Button>
                        </div>
                    )}

                    {/* Permission State */}
                    {hasPermission === false && !error && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-[12px] p-4 mb-4">
                            <div className="text-center">
                                <CameraOff className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                                <h3 className="heading-4 text-primary mb-2">Camera Access Required</h3>
                                <p className="body-secondary text-secondary mb-4">
                                    Please enable camera permissions in your browser settings to scan QR codes.
                                </p>
                                <Button
                                    variant="primary"
                                    onClick={handleRetry}
                                    className="w-full"
                                >
                                    Enable Camera
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Manual Input Fallback */}
                    <div className="text-center">
                        <p className="body-secondary text-tertiary mb-2">
                            Can't scan? You can also paste the code manually.
                        </p>
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            className="w-full"
                        >
                            Enter Manually
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
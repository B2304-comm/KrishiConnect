import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBookings } from "@/hooks/useBookings";
import { QrCode, CheckCircle, Camera, X, Wallet, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ScanQRModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScanQRModal = ({ open, onOpenChange }: ScanQRModalProps) => {
  const { findByQRCode, markReady, completeBooking } = useBookings();
  const [qrCode, setQrCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsScanning(true);
      toast.info("Point camera at QR code");
    } catch (error) {
      toast.error("Could not access camera");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (!open) {
      stopCamera();
      setBooking(null);
      setQrCode("");
      setShowPayment(false);
      setPaymentProcessing(null);
    }
  }, [open]);

  const handleSearch = async () => {
    if (!qrCode.trim()) return;
    setIsLoading(true);
    const result = await findByQRCode(qrCode.trim());
    setBooking(result);
    setShowPayment(false);
    setIsLoading(false);
  };

  const handleMarkReady = async () => {
    if (booking) {
      await markReady(booking.id);
      setBooking({ ...booking, status: "ready" });
    }
  };

  const handleComplete = async () => {
    if (booking) {
      await completeBooking(booking.id);
      setBooking(null);
      setQrCode("");
      setShowPayment(false);
      onOpenChange(false);
    }
  };

  const generateUPILink = (app: "gpay" | "phonepe") => {
    const merchantUPI = "krishiconnect@upi";
    const amount = booking?.total_amount || 0;
    const txnNote = `Payment for booking ${booking?.booking_number}`;
    const merchantName = "KrishiConnect";
    const txnId = `KC${Date.now()}`;

    const params = new URLSearchParams({
      pa: merchantUPI,
      pn: merchantName,
      tn: txnNote,
      am: amount.toString(),
      cu: "INR",
      tr: txnId,
    });

    if (app === "gpay") {
      return `tez://upi/pay?${params.toString()}`;
    }
    return `phonepe://pay?${params.toString()}`;
  };

  const handlePayment = (app: "gpay" | "phonepe") => {
    setPaymentProcessing(app);
    const upiLink = generateUPILink(app);
    
    // Try to open UPI app
    window.open(upiLink, "_blank");
    
    toast.info(`Opening ${app === "gpay" ? "Google Pay" : "PhonePe"}...`, {
      description: "Complete payment in the app, then come back to confirm.",
    });

    // Reset processing state after delay
    setTimeout(() => setPaymentProcessing(null), 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Scan Booking QR Code
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isScanning ? (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full aspect-square rounded-lg bg-black object-cover"
                playsInline
                muted
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2"
                onClick={stopCamera}
              >
                <X className="w-4 h-4" />
              </Button>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Point camera at QR code, then enter booking number manually
              </p>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={startCamera}
            >
              <Camera className="w-4 h-4" />
              Open Camera
            </Button>
          )}

          <div className="space-y-2">
            <Label htmlFor="qr-code">Enter Booking Number</Label>
            <div className="flex gap-2">
              <Input
                id="qr-code"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                placeholder="BK123456"
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isLoading || !qrCode}>
                {isLoading ? "..." : "Find"}
              </Button>
            </div>
          </div>

          {booking && (
            <div className="p-4 bg-muted/50 rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Booking #{booking.booking_number}</p>
                <Badge variant={booking.status === "completed" ? "default" : booking.status === "ready" ? "secondary" : "outline"}>
                  {booking.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Product:</p>
                  <p className="font-medium">{booking.products?.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Quantity:</p>
                  <p className="font-medium">{booking.quantity} bags</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total:</p>
                  <p className="font-medium text-primary">₹{booking.total_amount.toLocaleString()}</p>
                </div>
              </div>

              {/* Payment Section */}
              {(booking.status === "pending" || booking.status === "ready") && (
                <>
                  {!showPayment ? (
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => setShowPayment(true)}
                    >
                      <Wallet className="w-4 h-4" />
                      Pay ₹{booking.total_amount.toLocaleString()}
                    </Button>
                  ) : (
                    <div className="space-y-3 p-3 bg-background rounded-lg border border-border">
                      <p className="text-sm font-semibold text-center">Choose Payment Method</p>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 h-14 flex-col gap-1"
                          onClick={() => handlePayment("gpay")}
                          disabled={paymentProcessing !== null}
                        >
                          <Smartphone className="w-5 h-5 text-primary" />
                          <span className="text-xs font-medium">
                            {paymentProcessing === "gpay" ? "Opening..." : "Google Pay"}
                          </span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 h-14 flex-col gap-1"
                          onClick={() => handlePayment("phonepe")}
                          disabled={paymentProcessing !== null}
                        >
                          <Smartphone className="w-5 h-5 text-accent" />
                          <span className="text-xs font-medium">
                            {paymentProcessing === "phonepe" ? "Opening..." : "PhonePe"}
                          </span>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        You'll be redirected to the payment app
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => setShowPayment(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </>
              )}

              {booking.status === "pending" && (
                <Button onClick={handleMarkReady} className="w-full gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Mark Ready for Pickup
                </Button>
              )}

              {booking.status === "ready" && (
                <Button onClick={handleComplete} className="w-full gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Complete Sale
                </Button>
              )}

              {booking.status === "completed" && (
                <div className="text-center text-primary font-medium">
                  ✓ This order has been completed
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

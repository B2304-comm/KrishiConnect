import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Share2, Wallet, Smartphone } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface BookingQRCodeProps {
  bookingNumber: string;
  productName: string;
  quantity: number;
  shopName: string;
  pickupDate?: string;
  totalAmount: number;
}

export const BookingQRCode = ({
  bookingNumber,
  productName,
  quantity,
  shopName,
  pickupDate,
  totalAmount
}: BookingQRCodeProps) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState<string | null>(null);

  const qrData = JSON.stringify({
    type: "fertilizer_booking",
    booking_number: bookingNumber,
    product: productName,
    quantity,
    shop: shopName,
    pickup_date: pickupDate,
    total: totalAmount,
    timestamp: new Date().toISOString()
  });

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      
      const downloadLink = document.createElement("a");
      downloadLink.download = `booking-${bookingNumber}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Booking ${bookingNumber}`,
          text: `Fertilizer booking for ${quantity} units of ${productName} at ${shopName}`,
          url: window.location.href
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    }
  };

  const generateUPILink = (app: "gpay" | "phonepe") => {
    const merchantUPI = "krishiconnect@upi";
    const txnNote = `Payment for booking ${bookingNumber}`;
    const merchantName = "KrishiConnect";
    const txnId = `KC${Date.now()}`;

    const params = new URLSearchParams({
      pa: merchantUPI,
      pn: merchantName,
      tn: txnNote,
      am: totalAmount.toString(),
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
    window.open(upiLink, "_blank");

    toast.info(`Opening ${app === "gpay" ? "Google Pay" : "PhonePe"}...`, {
      description: "Complete payment in the app, then come back to confirm.",
    });

    setTimeout(() => setPaymentProcessing(null), 3000);
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg">Booking Confirmation</CardTitle>
        <Badge variant="secondary" className="mx-auto mt-1">
          {bookingNumber}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div ref={qrRef} className="bg-white p-4 rounded-lg shadow-inner">
          <QRCodeSVG
            value={qrData}
            size={180}
            level="H"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
        
        <div className="text-center space-y-1 text-sm">
          <p className="font-medium">{productName}</p>
          <p className="text-muted-foreground">Quantity: {quantity} units</p>
          <p className="text-muted-foreground">Shop: {shopName}</p>
          {pickupDate && (
            <p className="text-muted-foreground">
              Pickup: {new Date(pickupDate).toLocaleDateString()}
            </p>
          )}
          <p className="font-semibold text-primary">₹{totalAmount.toLocaleString()}</p>
        </div>

        {/* UPI Payment Section */}
        {!showPayment ? (
          <Button className="w-full gap-2" onClick={() => setShowPayment(true)}>
            <Wallet className="w-4 h-4" />
            Pay ₹{totalAmount.toLocaleString()} via UPI
          </Button>
        ) : (
          <div className="w-full space-y-3 p-3 bg-muted/50 rounded-lg border border-border">
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

        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1" />
            Save
          </Button>
          {navigator.share && (
            <Button variant="outline" size="sm" className="flex-1" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Show this QR code at the shop for pickup verification
        </p>
      </CardContent>
    </Card>
  );
};

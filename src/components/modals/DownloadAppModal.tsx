import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Smartphone, Download, Apple, Play } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface DownloadAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DownloadAppModal = ({ open, onOpenChange }: DownloadAppModalProps) => {
  const appDownloadUrl = "https://krishiconnect.app/download";
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Download Farmer App
          </DialogTitle>
          <DialogDescription>
            Get the KrishiConnect app on your mobile device for easy access to fertilizer bookings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6 space-y-6">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-2xl shadow-soft">
            <QRCodeSVG 
              value={appDownloadUrl} 
              size={180}
              level="H"
              includeMargin={true}
            />
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Scan the QR code with your phone camera to download the app
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* App Store Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button variant="outline" className="flex-1 h-12" asChild>
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                <Play className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="text-[10px] leading-none text-muted-foreground">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
            </Button>
            <Button variant="outline" className="flex-1 h-12" asChild>
              <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer">
                <Apple className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="text-[10px] leading-none text-muted-foreground">Download on</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
            </Button>
          </div>

          {/* Features */}
          <div className="bg-muted/50 rounded-xl p-4 w-full">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              App Features
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Find nearby shops with real-time stock
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Book fertilizers in advance
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Check subsidy eligibility
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                SMS support for low connectivity areas
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

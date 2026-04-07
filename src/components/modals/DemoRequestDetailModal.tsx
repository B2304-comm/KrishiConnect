import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle, XCircle, Eye, Mail, Phone, Building, User } from "lucide-react";

type DemoRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  role: string;
  message: string | null;
  status: string;
  created_at: string;
  reviewed_at: string | null;
};

interface Props {
  request: DemoRequest | null;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

const DemoRequestDetailModal = ({ request, onClose, onStatusChange }: Props) => {
  if (!request) return null;

  const handleAction = (status: string) => {
    onStatusChange(request.id, status);
    onClose();
  };

  return (
    <Dialog open={!!request} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Demo Request Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{request.name}</p>
              <Badge variant="outline" className="capitalize">{request.role}</Badge>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" /> {request.email}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" /> {request.phone}
            </div>
            {request.company && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building className="w-4 h-4" /> {request.company}
              </div>
            )}
          </div>

          {request.message && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Message</p>
              <p className="text-sm text-foreground">{request.message}</p>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Submitted {format(new Date(request.created_at), "MMM d, yyyy 'at' h:mm a")}
            {request.reviewed_at && (
              <> · Reviewed {format(new Date(request.reviewed_at), "MMM d, yyyy")}</>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" className="flex-1" onClick={() => handleAction("contacted")}>
              <CheckCircle className="w-4 h-4 mr-1" /> Contacted
            </Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={() => handleAction("reviewed")}>
              <Eye className="w-4 h-4 mr-1" /> Reviewed
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleAction("rejected")}>
              <XCircle className="w-4 h-4 mr-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoRequestDetailModal;

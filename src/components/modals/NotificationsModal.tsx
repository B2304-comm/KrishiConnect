import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, Package, AlertTriangle, CheckCircle, Truck, ShoppingCart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationsModal = ({ open, onOpenChange }: NotificationsModalProps) => {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "stock_alert": return <AlertTriangle className="w-4 h-4 text-secondary" />;
      case "order": return <ShoppingCart className="w-4 h-4 text-primary" />;
      case "delivery": return <Truck className="w-4 h-4 text-accent" />;
      case "success": return <CheckCircle className="w-4 h-4 text-primary" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "stock_alert": return <Badge variant="outline" className="border-secondary text-secondary">Stock</Badge>;
      case "order": return <Badge variant="default">Order</Badge>;
      case "delivery": return <Badge variant="outline" className="border-accent text-accent">Delivery</Badge>;
      case "success": return <Badge variant="default" className="bg-primary">Success</Badge>;
      default: return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">{unreadCount}</Badge>
              )}
            </DialogTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
        </DialogHeader>
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                  notification.is_read 
                    ? "bg-muted/30 border-border" 
                    : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                }`}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm">{notification.title}</p>
                      {getNotificationBadge(notification.type)}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

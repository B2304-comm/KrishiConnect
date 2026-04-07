import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, Store, Building, Factory, Sprout, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import FarmerDashboard from "@/components/dashboard/FarmerDashboard";
import ShopDashboard from "@/components/dashboard/ShopDashboard";
import DealerDashboard from "@/components/dashboard/DealerDashboard";
import CompanyDashboard from "@/components/dashboard/CompanyDashboard";
import { NotificationsModal } from "@/components/modals/NotificationsModal";
import { useNotifications } from "@/hooks/useNotifications";
import { supabase } from "@/integrations/supabase/client";

type Role = "farmer" | "shop" | "dealer" | "company";

const roles = [
  { id: "farmer" as Role, label: "Farmer", icon: User },
  { id: "shop" as Role, label: "Shop", icon: Store },
  { id: "dealer" as Role, label: "Dealer", icon: Building },
  { id: "company" as Role, label: "Company", icon: Factory },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState<Role>("farmer");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { unreadCount } = useNotifications();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .limit(1);

      if (roles && roles.length > 0) {
        setActiveRole(roles[0].role as Role);
      }
    };
    fetchUserRole();
  }, []);

  const renderDashboard = () => {
    switch (activeRole) {
      case "farmer":
        return <FarmerDashboard />;
      case "shop":
        return <ShopDashboard />;
      case "dealer":
        return <DealerDashboard />;
      case "company":
        return <CompanyDashboard />;
      default:
        return <FarmerDashboard />;
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/30 bg-white/45 backdrop-blur-2xl">
        <div className="container mx-auto px-4">
          <div className="flex min-h-20 items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-hero shadow-card">
                <Sprout className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-foreground">KrishiConnect</h1>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">National Distribution System</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handleLogout}
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={() => setNotificationsOpen(true)}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>

              <div className="hidden items-center gap-1 rounded-2xl border border-white/50 bg-white/60 p-1.5 backdrop-blur-xl md:flex">
                {roles.map((role) => (
                  <Button
                    key={role.id}
                    variant={activeRole === role.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveRole(role.id)}
                    className={`gap-2 ${
                      activeRole === role.id
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
                    }`}
                  >
                    <role.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{role.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        <section className="section-shell relative mb-6 overflow-hidden p-6 md:p-8">
          <div className="grid-pattern absolute inset-0 opacity-40" />
          <div className="absolute -top-20 right-0 h-56 w-56 rounded-full bg-secondary/25 blur-3xl" />
          <div className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-xl">
                <Factory className="h-3.5 w-3.5 text-primary" />
                Unified dashboard
              </div>
              <h2 className="display-font text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                Distribution intelligence with a cleaner command surface.
              </h2>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                Monitor inventory, dealer movement, field demand, and operational actions from one polished workspace.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: "Live roles", value: "4" },
                { label: "Unread alerts", value: unreadCount > 9 ? "9+" : unreadCount.toString() },
                { label: "Session state", value: activeRole },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/55 bg-white/60 px-4 py-3 backdrop-blur-xl">
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</div>
                  <div className="mt-1 text-lg font-extrabold capitalize text-foreground">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 md:hidden">
          {roles.map((role) => (
            <Button
              key={role.id}
              variant={activeRole === role.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveRole(role.id)}
              className="gap-2 whitespace-nowrap"
            >
              <role.icon className="w-4 h-4" />
              {role.label}
            </Button>
          ))}
        </div>

        {renderDashboard()}
      </main>

      <NotificationsModal open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </div>
  );
};

export default Dashboard;

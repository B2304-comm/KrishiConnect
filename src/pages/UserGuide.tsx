import { ArrowLeft, BookOpen, Users, Store, Truck, Building2, Sprout, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";

const guides = [
  {
    role: "Farmer",
    icon: Sprout,
    color: "text-green-600",
    steps: [
      { title: "Create an Account", desc: "Sign up with your email and verify your account to get started." },
      { title: "Find Nearby Shops", desc: "Use the 'Find Fertilizer' feature on the homepage to discover shops near your location with real-time stock information." },
      { title: "Book Fertilizer", desc: "Select a product, choose quantity, and book your order. You'll receive a booking number and QR code." },
      { title: "Make Payment", desc: "Pay via UPI (Google Pay, PhonePe, Paytm) using the payment links on your booking confirmation." },
      { title: "Collect from Shop", desc: "Visit the shop on your pickup date. Show your QR code for instant verification and collection." },
    ]
  },
  {
    role: "Shop Owner / Retailer",
    icon: Store,
    color: "text-blue-600",
    steps: [
      { title: "Register Your Shop", desc: "Click 'Register Shop' and fill in your shop details. You'll be linked to a dealer for inventory." },
      { title: "Manage Inventory", desc: "View real-time inventory levels on your dashboard. Inventory updates automatically when dealers deliver stock." },
      { title: "Order from Dealer", desc: "Place orders to your assigned dealer when stock runs low. Track order status from pending to delivered." },
      { title: "Handle Farmer Bookings", desc: "Scan QR codes from farmer bookings to verify and complete orders. Mark bookings as fulfilled." },
      { title: "View Order History", desc: "Track all your past orders to dealers and booking history with farmers." },
    ]
  },
  {
    role: "Dealer / Distributor",
    icon: Truck,
    color: "text-orange-600",
    steps: [
      { title: "Register as Dealer", desc: "Sign up and register as a dealer by providing your business name and region of operation." },
      { title: "Manage Incoming Orders", desc: "View all orders from shops in your network. Filter by status, priority, and date." },
      { title: "Process & Ship Orders", desc: "Approve, ship, and deliver orders. Inventory automatically transfers to shops on delivery." },
      { title: "Add Shops", desc: "Onboard new retail shops into your distribution network directly from your dashboard." },
      { title: "Track Inventory", desc: "Monitor your total inventory and distribution metrics across all connected shops." },
    ]
  },
  {
    role: "Company / Manufacturer",
    icon: Building2,
    color: "text-purple-600",
    steps: [
      { title: "Register Company", desc: "Create your company profile with business details and contact information." },
      { title: "Market Coverage Analysis", desc: "View state-wise market coverage with district-level breakdowns of dealers and shops." },
      { title: "Manage Dealers", desc: "Add and manage dealers by state. Track which dealers are covering which regions." },
      { title: "Expand to New States", desc: "Use the state expansion tool to add districts, assign dealers, and track coverage progress." },
      { title: "View Analytics", desc: "Access production reports, distribution analytics, and national coverage dashboards." },
    ]
  },
];

const faqs = [
  { q: "How do I reset my password?", a: "Go to the login page and click 'Forgot Password'. Enter your email and follow the reset link sent to your inbox." },
  { q: "Can I register as both a shop and a dealer?", a: "Each account can hold multiple roles. However, we recommend using separate accounts for different business roles for cleaner management." },
  { q: "How is inventory updated?", a: "Inventory updates automatically. When a dealer marks an order as 'Delivered', the corresponding shop's inventory increases in real-time." },
  { q: "What payment methods are supported?", a: "Currently, UPI payments via Google Pay, PhonePe, and Paytm are supported for farmer bookings." },
  { q: "How do I contact support?", a: "Visit the 'Contact Us' page from the footer or email support@krishiconnect.gov.in." },
  { q: "Is my data secure?", a: "Yes. All data is protected with row-level security policies. Users can only access their own data." },
];

const UserGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/10 border-b">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">User Guide</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Step-by-step instructions for all stakeholders — Farmers, Shop Owners, Dealers, and Companies.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {guides.map((guide, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <guide.icon className={`w-5 h-5 ${guide.color}`} />
                {guide.role}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {guide.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserGuide;

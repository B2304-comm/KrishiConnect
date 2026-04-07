import { ArrowLeft, Mail, Phone, MapPin, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const ContactUs = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Message sent successfully! We'll respond within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/10 border-b">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Contact Us</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Get in touch with KrishiConnect support or government authorities for any assistance.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Contact Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Address</p>
                    <p className="text-sm text-muted-foreground">Department of Fertilizers, Ministry of Chemicals & Fertilizers, Shastri Bhawan, New Delhi - 110001</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Phone</p>
                    <p className="text-sm text-muted-foreground">Helpline: 1800-180-1551 (Toll Free)</p>
                    <p className="text-sm text-muted-foreground">Office: +91-11-23389418</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Email</p>
                    <p className="text-sm text-muted-foreground">support@krishiconnect.gov.in</p>
                    <p className="text-sm text-muted-foreground">grievance@fert.gov.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Office Hours</p>
                    <p className="text-sm text-muted-foreground">Mon–Fri: 9:30 AM – 5:30 PM IST</p>
                    <p className="text-sm text-muted-foreground">Helpline: 24/7</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Website</p>
                    <a href="https://fert.nic.in" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">https://fert.nic.in</a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Send a Message</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required placeholder="What is this about?" />
                </div>
                <div className="space-y-2">
                  <Label>Message *</Label>
                  <Textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} required placeholder="Your message..." rows={5} />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

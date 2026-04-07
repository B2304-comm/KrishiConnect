import { useState } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ReportIssue = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", state: "", category: "", description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Issue reported successfully! Reference number: ISS-" + Math.random().toString(36).substring(2, 8).toUpperCase());
    setForm({ name: "", email: "", phone: "", state: "", category: "", description: "" });
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
            <AlertTriangle className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Report an Issue</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Report fertilizer-related issues such as black marketing, overpricing, stock shortages, 
            or quality concerns. All reports are reviewed by authorities.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Submit a Report</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Your Name *</Label>
                  <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Full name" />
                </div>
                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>State *</Label>
                  <Input value={form.state} onChange={e => setForm({...form, state: e.target.value})} required placeholder="e.g., Maharashtra" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Issue Category *</Label>
                <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overpricing">Overpricing / MRP Violation</SelectItem>
                    <SelectItem value="black_marketing">Black Marketing</SelectItem>
                    <SelectItem value="shortage">Stock Shortage</SelectItem>
                    <SelectItem value="quality">Quality Issue</SelectItem>
                    <SelectItem value="forced_bundling">Forced Bundling</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required placeholder="Describe the issue in detail — include shop/dealer name, location, and any evidence." rows={5} />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting || !form.category}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Your identity will be kept confidential. Reports are reviewed within 48 hours.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportIssue;

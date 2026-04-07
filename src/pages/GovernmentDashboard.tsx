import { ArrowLeft, Building, BarChart3, Shield, Eye, TrendingUp, MapPin, AlertTriangle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

const stateData = [
  { state: "Maharashtra", dealers: 342, shops: 2810, coverage: 87, subsidy: "₹4,200 Cr", alerts: 3 },
  { state: "Uttar Pradesh", dealers: 498, shops: 4120, coverage: 72, subsidy: "₹6,100 Cr", alerts: 12 },
  { state: "Punjab", dealers: 198, shops: 1650, coverage: 94, subsidy: "₹3,800 Cr", alerts: 1 },
  { state: "Madhya Pradesh", dealers: 275, shops: 2340, coverage: 68, subsidy: "₹3,400 Cr", alerts: 8 },
  { state: "Rajasthan", dealers: 220, shops: 1890, coverage: 63, subsidy: "₹2,900 Cr", alerts: 5 },
  { state: "Karnataka", dealers: 180, shops: 1520, coverage: 79, subsidy: "₹2,200 Cr", alerts: 2 },
  { state: "Tamil Nadu", dealers: 165, shops: 1380, coverage: 82, subsidy: "₹2,000 Cr", alerts: 0 },
  { state: "Gujarat", dealers: 210, shops: 1750, coverage: 76, subsidy: "₹2,800 Cr", alerts: 4 },
];

const GovernmentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/10 border-b">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Building className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Government Fertilizer Dashboard</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            National overview of fertilizer distribution, subsidy utilization, and supply chain transparency.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* National Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">580 LMT</p>
              <p className="text-xs text-muted-foreground">Total Fertilizer Sold (FY26)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">₹1.62L Cr</p>
              <p className="text-xs text-muted-foreground">Subsidy Disbursed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">2,088</p>
              <p className="text-xs text-muted-foreground">Active Dealers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold">35</p>
              <p className="text-xs text-muted-foreground">Active Shortage Alerts</p>
            </CardContent>
          </Card>
        </div>

        {/* Transparency Principles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Transparency Measures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <Eye className="w-5 h-5 text-primary mb-2" />
                <p className="font-semibold text-sm">Real-time Tracking</p>
                <p className="text-xs text-muted-foreground">Every bag of fertilizer tracked from factory to farm via QR codes and DBT</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <BarChart3 className="w-5 h-5 text-primary mb-2" />
                <p className="font-semibold text-sm">Open Data</p>
                <p className="text-xs text-muted-foreground">State-wise distribution data publicly accessible for accountability</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <Shield className="w-5 h-5 text-primary mb-2" />
                <p className="font-semibold text-sm">Anti-Diversion</p>
                <p className="text-xs text-muted-foreground">Aadhaar-linked sales prevent black marketing and ensure genuine farmer access</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* State-wise Table */}
        <Card>
          <CardHeader>
            <CardTitle>State-wise Fertilizer Distribution Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>State</TableHead>
                  <TableHead>Dealers</TableHead>
                  <TableHead>Shops</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Subsidy (FY26)</TableHead>
                  <TableHead>Alerts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stateData.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{s.state}</TableCell>
                    <TableCell>{s.dealers}</TableCell>
                    <TableCell>{s.shops}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={s.coverage} className="w-16 h-2" />
                        <span className="text-xs">{s.coverage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{s.subsidy}</TableCell>
                    <TableCell>
                      {s.alerts > 0 ? (
                        <Badge variant="destructive">{s.alerts}</Badge>
                      ) : (
                        <Badge variant="secondary">0</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GovernmentDashboard;

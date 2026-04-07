import { ArrowLeft, IndianRupee, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";

// Fallback static data in case DB is empty
const staticProducts = [
  { name: "Urea (46% N)", price: 242, unit: "45 kg bag", category: "Nitrogenous", controlled: true },
  { name: "DAP (18-46-0)", price: 1350, unit: "50 kg bag", category: "Phosphatic", controlled: false },
  { name: "MOP (0-0-60)", price: 1700, unit: "50 kg bag", category: "Potassic", controlled: false },
  { name: "NPK (10-26-26)", price: 1470, unit: "50 kg bag", category: "Complex", controlled: false },
  { name: "NPK (12-32-16)", price: 1470, unit: "50 kg bag", category: "Complex", controlled: false },
  { name: "NPK (20-20-0-13)", price: 1175, unit: "50 kg bag", category: "Complex", controlled: false },
  { name: "SSP (0-16-0)", price: 600, unit: "50 kg bag", category: "Phosphatic", controlled: false },
  { name: "Ammonium Sulphate", price: 1000, unit: "50 kg bag", category: "Nitrogenous", controlled: false },
  { name: "Zinc Sulphate (21%)", price: 450, unit: "10 kg", category: "Micronutrient", controlled: false },
  { name: "Boron (20%)", price: 280, unit: "5 kg", category: "Micronutrient", controlled: false },
  { name: "Neem Coated Urea", price: 242, unit: "45 kg bag", category: "Nitrogenous", controlled: true },
  { name: "Potash (SOP)", price: 1900, unit: "50 kg bag", category: "Potassic", controlled: false },
];

const PriceList = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [search, setSearch] = useState("");

  const hasDbProducts = products.length > 0;

  const filteredStatic = staticProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDb = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/10 border-b">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <IndianRupee className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Fertilizer Price List</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Government-controlled and market prices for all major fertilizers. 
            Prices are inclusive of subsidies and may vary slightly by region.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search fertilizer by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Badge variant="outline">Prices as of April 2026</Badge>
        </div>

        {/* DB Products */}
        {hasDbProducts && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Platform Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Price (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDb.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-muted-foreground">{p.description || "—"}</TableCell>
                      <TableCell>{p.unit || "bag"}</TableCell>
                      <TableCell className="text-right font-semibold">₹{p.base_price.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Standard Reference Prices */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Government Reference Prices (MRP)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fertilizer</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">MRP (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStatic.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.category}</Badge>
                    </TableCell>
                    <TableCell>{p.unit}</TableCell>
                    <TableCell>
                      {p.controlled ? (
                        <Badge variant="default" className="bg-green-600">Controlled</Badge>
                      ) : (
                        <Badge variant="outline">Decontrolled</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">₹{p.price.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> Prices are indicative and based on government notifications. 
              Actual prices may vary by state, dealer, and transport costs. Controlled fertilizers have 
              MRP fixed by the Government of India. For decontrolled fertilizers, companies set MRP 
              within reasonable limits as per NBS policy guidelines.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PriceList;

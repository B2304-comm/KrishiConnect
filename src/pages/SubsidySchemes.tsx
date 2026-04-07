import { ArrowLeft, IndianRupee, Leaf, Sprout, Users, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const schemes = [
  {
    name: "Nutrient Based Subsidy (NBS)",
    ministry: "Department of Fertilizers",
    description: "Subsidy on phosphatic and potassic (P&K) fertilizers based on nutrient content. Rates are decided annually considering international prices, exchange rate, and inventory levels.",
    eligibility: "All farmers purchasing P&K fertilizers from authorized retailers",
    benefits: [
      "Fixed subsidy per kg of nutrient (N, P, K, S)",
      "Applicable on DAP, MOP, SSP, and complex fertilizers",
      "Passed directly to manufacturers; farmers pay subsidized MRP"
    ],
    status: "Active",
    link: "https://fert.nic.in"
  },
  {
    name: "Urea Subsidy Scheme",
    ministry: "Department of Fertilizers",
    description: "The government fixes the Maximum Retail Price of urea and pays the difference between the cost of production/import and MRP as subsidy to manufacturers/importers.",
    eligibility: "All farmers purchasing urea from authorized dealers",
    benefits: [
      "Urea available at ₹242/45 kg bag (controlled MRP)",
      "Neem-coated urea improves nitrogen use efficiency",
      "Direct Benefit Transfer (DBT) ensures transparency"
    ],
    status: "Active",
    link: "https://fert.nic.in"
  },
  {
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    ministry: "Ministry of Agriculture",
    description: "Income support of ₹6,000 per year to all landholding farmer families in three equal instalments of ₹2,000 each, to supplement their financial needs for purchasing inputs including fertilizers.",
    eligibility: "All landholding farmer families with cultivable land",
    benefits: [
      "₹6,000/year in 3 instalments",
      "Direct transfer to bank account",
      "Can be used for fertilizer purchases"
    ],
    status: "Active",
    link: "https://pmkisan.gov.in"
  },
  {
    name: "Soil Health Card Scheme",
    ministry: "Ministry of Agriculture",
    description: "Provides soil health cards to farmers every 2 years, which carry crop-wise recommendations of nutrients and fertilizers required, helping farmers optimize fertilizer usage.",
    eligibility: "All farmers across India",
    benefits: [
      "Free soil testing and health card",
      "Crop-wise fertilizer recommendations",
      "Reduces over-use of chemical fertilizers",
      "Promotes balanced nutrient application"
    ],
    status: "Active",
    link: "https://soilhealth.dac.gov.in"
  },
  {
    name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    ministry: "Ministry of Agriculture",
    description: "Promotes organic farming by providing financial assistance to farmers for adopting organic farming practices and reducing dependency on chemical fertilizers.",
    eligibility: "Farmer groups (clusters of 50+ farmers covering 50 acres)",
    benefits: [
      "₹50,000/hectare over 3 years",
      "Training on organic inputs preparation",
      "Certification and marketing support"
    ],
    status: "Active",
    link: "https://pgsindia-ncof.gov.in"
  }
];

const SubsidySchemes = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/10 border-b">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <IndianRupee className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Government Subsidy Schemes</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Comprehensive list of government subsidy schemes for fertilizers and agriculture. 
            These schemes help farmers access quality fertilizers at affordable prices.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <IndianRupee className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">₹1.62L Cr</p>
              <p className="text-xs text-muted-foreground">Annual Fertilizer Subsidy</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">12+ Cr</p>
              <p className="text-xs text-muted-foreground">Farmers Benefited</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Leaf className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">5+</p>
              <p className="text-xs text-muted-foreground">Active Schemes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Sprout className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">100%</p>
              <p className="text-xs text-muted-foreground">DBT Coverage</p>
            </CardContent>
          </Card>
        </div>

        {/* Schemes List */}
        {schemes.map((scheme, idx) => (
          <Card key={idx}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{scheme.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{scheme.ministry}</p>
                </div>
                <Badge variant="default" className="bg-green-600">{scheme.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{scheme.description}</p>
              <div>
                <p className="text-sm font-semibold mb-1">Eligibility:</p>
                <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Key Benefits:</p>
                <ul className="list-disc list-inside space-y-1">
                  {scheme.benefits.map((b, i) => (
                    <li key={i} className="text-sm text-muted-foreground">{b}</li>
                  ))}
                </ul>
              </div>
              <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-3 h-3 mr-1" /> Official Website
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubsidySchemes;

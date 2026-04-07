import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Leaf, Sparkles, Upload, FlaskConical } from "lucide-react";
import { toast } from "sonner";
import { generateAdvisorFallback } from "@/lib/aiFallback";

type FertilizerPlan = {
  fertilizer: string;
  purpose: string;
  timing: string;
  application_rate: string;
  estimated_total_quantity: string;
  effectiveness_score: number;
  effectiveness_label: string;
  effectiveness_summary: string;
};

type EffectivenessSummary = {
  score: number;
  label: string;
  confidence: number;
  summary: string;
};

type AdvisorResult = {
  crop_name: string;
  growth_stage: string;
  analysis_summary: string;
  analysis_source: string;
  detection_confidence: number;
  overall_effectiveness: EffectivenessSummary;
  fertilizer_plan: FertilizerPlan[];
  advisory: string[];
  disclaimer: string;
};

const readJsonResponse = async <T,>(response: Response): Promise<T | null> => {
  const rawText = await response.text();
  if (!rawText.trim()) {
    return null;
  }

  try {
    return JSON.parse(rawText) as T;
  } catch {
    throw new Error("AI backend returned an invalid response.");
  }
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof TypeError) {
    return "AI backend is not available, so local fallback analysis was used.";
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};

const AI_API_URL = import.meta.env.VITE_AI_API_URL ?? (import.meta.env.DEV ? "/api/ai" : "http://127.0.0.1:8001");
const SUPPORTED_CROPS = [
  "Rice (Paddy)",
  "Wheat",
  "Sugarcane",
  "Cotton",
  "Maize (Corn)",
  "Soybean",
  "Groundnut (Peanut)",
  "Mustard/Rapeseed",
  "Pulses (Tur/Arhar)",
  "Pulses (Urad/Moong)",
  "Pulses (Gram/Chickpea)",
  "Jute",
  "Tea",
  "Coffee",
  "Rubber",
  "Tobacco",
  "Potato",
  "Onion",
  "Mangoes",
];

const CROP_HINTS: Record<string, string> = {
  "Rice (Paddy)": "rice",
  Wheat: "wheat",
  Sugarcane: "sugarcane",
  Cotton: "cotton",
  "Maize (Corn)": "maize",
  Soybean: "soybean",
  "Groundnut (Peanut)": "groundnut",
  "Mustard/Rapeseed": "mustard",
  "Pulses (Tur/Arhar)": "tur",
  "Pulses (Urad/Moong)": "moong",
  "Pulses (Gram/Chickpea)": "gram",
  Jute: "jute",
  Tea: "tea",
  Coffee: "coffee",
  Rubber: "rubber",
  Tobacco: "tobacco",
  Potato: "potato",
  Onion: "onion",
  Mangoes: "mango",
};

const CropFertilizerAdvisor = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [acreage, setAcreage] = useState("1");
  const [areaUnit, setAreaUnit] = useState("acre");
  const [growthStage, setGrowthStage] = useState("vegetative");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [farmerNotes, setFarmerNotes] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AdvisorResult | null>(null);

  const previewUrl = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Unable to read the selected image."));
      reader.readAsDataURL(file);
    });

  const handleAnalyze = async () => {
    if (!imageFile) {
      toast.error("Please upload a crop image first.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const imageBase64 = await fileToDataUrl(imageFile);

      const response = await fetch(`${AI_API_URL}/analyze-crop-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_base64: imageBase64,
          image_filename: imageFile.name,
          acreage: Number(acreage || "1"),
          area_unit: areaUnit,
          growth_stage: growthStage,
          selected_crop: selectedCrop ? CROP_HINTS[selectedCrop] ?? selectedCrop : "",
          farmer_notes: farmerNotes,
        }),
      });

      const data = await readJsonResponse<AdvisorResult & { detail?: string }>(response);

      if (!response.ok) {
        throw new Error(data?.detail || "Unable to analyze the uploaded image.");
      }

      if (!data) {
        throw new Error("AI backend returned an empty response.");
      }

      setResult(data);
      toast.success("Crop recommendation generated.");
    } catch (error: unknown) {
      const fallbackResult = generateAdvisorFallback({
        imageFilename: imageFile.name,
        selectedCrop: selectedCrop ? CROP_HINTS[selectedCrop] ?? selectedCrop : "",
        farmerNotes,
        acreage: Number(acreage || "1"),
        areaUnit,
        growthStage: growthStage as "seedling" | "vegetative" | "flowering" | "fruiting" | "mature",
      });
      setResult(fallbackResult);
      toast.success(getErrorMessage(error, "Local fallback analysis was used."));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="section-shell p-6">
      <div className="mb-5 flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-lg font-bold text-foreground">AI Crop Fertilizer Advisor</h2>
          <p className="text-sm text-muted-foreground">
            Upload a crop image to identify the crop and get fertilizer type and quantity guidance.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4 rounded-[24px] border border-white/60 bg-white/60 p-5 backdrop-blur-xl">
          <div className="rounded-[20px] border border-primary/10 bg-primary/5 p-4">
            <p className="text-sm font-semibold text-foreground">Supported Indian crops</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SUPPORTED_CROPS.map((crop) => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => setSelectedCrop((current) => (current === crop ? "" : crop))}
                  className={`rounded-full px-3 py-1 text-sm transition-colors ${
                    selectedCrop === crop
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-white/80 text-foreground hover:bg-white"
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Tap a crop if you already know it. That hint will be used together with the uploaded image for a more reliable prediction.
            </p>
          </div>

          {selectedCrop && (
            <div className="rounded-[16px] border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
              Selected crop hint: <span className="font-semibold">{selectedCrop}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="crop-image">Crop Image</Label>
            <Input
              id="crop-image"
              type="file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            />
          </div>

          {previewUrl && (
            <div className="overflow-hidden rounded-[20px] border border-white/60 bg-background/70">
              <img src={previewUrl} alt="Crop preview" className="h-64 w-full object-cover" />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="acreage">Field Size</Label>
              <Input
                id="acreage"
                type="number"
                min="0.1"
                step="0.1"
                value={acreage}
                onChange={(event) => setAcreage(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Select value={areaUnit} onValueChange={setAreaUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acre">Acre</SelectItem>
                  <SelectItem value="hectare">Hectare</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Growth Stage</Label>
            <Select value={growthStage} onValueChange={setGrowthStage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seedling">Seedling</SelectItem>
                <SelectItem value="vegetative">Vegetative</SelectItem>
                <SelectItem value="flowering">Flowering</SelectItem>
                <SelectItem value="fruiting">Fruiting</SelectItem>
                <SelectItem value="mature">Mature</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="farmer-notes">Optional Notes</Label>
            <Textarea
              id="farmer-notes"
              rows={4}
              value={farmerNotes}
              onChange={(event) => setFarmerNotes(event.target.value)}
              placeholder="Add crop name if known, symptoms, soil condition, or anything visible in the field."
            />
          </div>

          <Button className="w-full gap-2" onClick={handleAnalyze} disabled={isAnalyzing}>
            <Upload className="h-4 w-4" />
            {isAnalyzing ? "Analyzing Crop..." : "Analyze Image"}
          </Button>
        </div>

        <div className="rounded-[24px] border border-white/60 bg-white/60 p-5 backdrop-blur-xl">
          {result ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-primary" />
                    <h3 className="text-2xl font-bold text-foreground">{result.crop_name}</h3>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{result.analysis_summary}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-foreground text-background">
                    {result.detection_confidence.toFixed(1)}% confidence
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {result.growth_stage}
                  </Badge>
                  <Badge variant="outline" className="border-primary/20 text-muted-foreground">
                    {result.analysis_source}
                  </Badge>
                </div>
              </div>

              <div className="rounded-[20px] border border-white/60 bg-primary/5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall fertilizer effectiveness</p>
                    <h4 className="text-2xl font-bold text-foreground">{result.overall_effectiveness.label}</h4>
                  </div>
                  <div className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">
                    {result.overall_effectiveness.score.toFixed(1)}%
                  </div>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-primary/10">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${result.overall_effectiveness.score}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{result.overall_effectiveness.summary}</p>
              </div>

              <div className="grid gap-3">
                {result.fertilizer_plan.map((item) => (
                  <div key={`${result.crop_name}-${item.fertilizer}`} className="rounded-[20px] border border-white/60 bg-background/70 p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 text-accent" />
                        <h4 className="font-semibold text-foreground">{item.fertilizer}</h4>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {item.effectiveness_score.toFixed(1)}% {item.effectiveness_label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.purpose}</p>
                    <p className="mt-2 text-sm text-foreground">{item.effectiveness_summary}</p>
                    <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Rate</p>
                        <p className="font-medium text-foreground">{item.application_rate}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Estimated Total</p>
                        <p className="font-medium text-foreground">{item.estimated_total_quantity}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">When To Apply</p>
                      <p className="font-medium text-foreground">{item.timing}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-[20px] border border-dashed border-primary/20 bg-primary/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-foreground">Field Advice</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.advisory.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">{result.disclaimer}</p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[20px] border border-dashed border-white/60 bg-background/50 px-6 text-center">
              <Brain className="mb-4 h-10 w-10 text-muted-foreground" />
              <h3 className="text-xl font-semibold text-foreground">Upload any crop image to begin</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                The advisor will identify the likely crop, suggest fertilizer types, and estimate the total quantity based on your field size.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropFertilizerAdvisor;

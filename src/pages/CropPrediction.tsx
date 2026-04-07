import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Leaf, ArrowLeft, Sprout, TestTube2 } from "lucide-react";
import CropFertilizerAdvisor from "@/components/farmer/CropFertilizerAdvisor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { generateSoilPredictionFallback } from "@/lib/aiFallback";

const AI_API_URL = import.meta.env.VITE_AI_API_URL ?? (import.meta.env.DEV ? "/api/ai" : "http://127.0.0.1:8001");

type PredictorInputs = {
  N: string;
  P: string;
  K: string;
  temperature: string;
  humidity: string;
  ph: string;
  rainfall: string;
};

type EffectivenessSummary = {
  score: number;
  label: string;
  confidence: number;
  summary: string;
};

type SoilFertilizerPlan = {
  fertilizer: string;
  purpose: string;
  timing: string;
  application_rate: string;
  estimated_total_quantity: string;
  effectiveness_score: number;
  effectiveness_label: string;
  effectiveness_summary: string;
};

type SoilPredictionResult = {
  crop: string;
  confidence: number;
  overall_effectiveness: EffectivenessSummary;
  fertilizer_plan: SoilFertilizerPlan[];
  advisory: string[];
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
    return "AI backend is not available, so local fallback prediction was used.";
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};

const initialInputs: PredictorInputs = {
  N: "90",
  P: "42",
  K: "43",
  temperature: "20",
  humidity: "80",
  ph: "6.5",
  rainfall: "200",
};

const CropPrediction = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<PredictorInputs>(initialInputs);
  const [predictionResult, setPredictionResult] = useState<SoilPredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [backendReady, setBackendReady] = useState<boolean | null>(null);
  const [supportedCrops, setSupportedCrops] = useState<string[]>([]);

  useEffect(() => {
    const loadBackendMeta = async () => {
      try {
        const [healthResponse, cropsResponse] = await Promise.all([
          fetch(`${AI_API_URL}/healthz`),
          fetch(`${AI_API_URL}/supported-crops`),
        ]);

        setBackendReady(healthResponse.ok);

        if (cropsResponse.ok) {
          const cropsData = await cropsResponse.json();
          setSupportedCrops(Array.isArray(cropsData.crops) ? cropsData.crops : []);
        }
      } catch {
        setBackendReady(false);
      }
    };

    void loadBackendMeta();
  }, []);

  const handleInputChange = (field: keyof PredictorInputs, value: string) => {
    setInputs((current) => ({ ...current, [field]: value }));
  };

  const handlePredict = async () => {
    setIsPredicting(true);

    try {
        const response = await fetch(`${AI_API_URL}/predict`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          N: Number(inputs.N),
          P: Number(inputs.P),
          K: Number(inputs.K),
          temperature: Number(inputs.temperature),
          humidity: Number(inputs.humidity),
          ph: Number(inputs.ph),
          rainfall: Number(inputs.rainfall),
        }),
      });

      const data = await readJsonResponse<SoilPredictionResult & { detail?: string }>(response);
      if (!response.ok) {
        throw new Error(data?.detail || "Unable to predict crop.");
      }

      if (!data) {
        throw new Error("AI backend returned an empty response.");
      }

      setPredictionResult(data);
      toast.success("Crop prediction generated.");
    } catch (error: unknown) {
      const fallbackResult = generateSoilPredictionFallback({
        N: Number(inputs.N),
        P: Number(inputs.P),
        K: Number(inputs.K),
        temperature: Number(inputs.temperature),
        humidity: Number(inputs.humidity),
        ph: Number(inputs.ph),
        rainfall: Number(inputs.rainfall),
      });
      setPredictionResult(fallbackResult);
      toast.success(getErrorMessage(error, "Local fallback prediction was used."));
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 md:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">AI tools</p>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">AI Crop Prediction</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
              Use image-based crop analysis and soil-condition prediction from one page. This screen is designed as the dedicated AI entry point for farmers.
            </p>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <Badge variant="secondary" className="bg-primary/10 px-3 py-1 text-primary">
            {backendReady === null ? "Checking AI backend..." : backendReady ? "AI backend connected" : "AI backend unavailable"}
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-muted-foreground">
            Image upload + fertilizer guidance
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-muted-foreground">
            Soil-input crop prediction
          </Badge>
        </div>

        {supportedCrops.length > 0 && (
          <section className="section-shell mb-6 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Supported Crops From Backend</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {supportedCrops.map((crop) => (
                <Badge key={crop} variant="outline" className="bg-white/60 px-3 py-1 text-foreground">
                  {crop}
                </Badge>
              ))}
            </div>
          </section>
        )}

        <CropFertilizerAdvisor />

        <section className="section-shell mt-6 p-6">
          <div className="mb-5 flex items-center gap-2">
            <TestTube2 className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-foreground">Soil-Based Crop Predictor</h2>
              <p className="text-sm text-muted-foreground">
                Enter nutrient and climate values to predict the most suitable crop from the trained model.
              </p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
            <div className="rounded-[24px] border border-white/60 bg-white/70 p-5 backdrop-blur-xl">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { key: "N", label: "Nitrogen (N)", hint: "Leaf and stem growth" },
                  { key: "P", label: "Phosphorus (P)", hint: "Root and flowering support" },
                  { key: "K", label: "Potassium (K)", hint: "Strength and stress tolerance" },
                  { key: "temperature", label: "Temperature", hint: "Average field temperature" },
                  { key: "humidity", label: "Humidity", hint: "Moisture in the air" },
                  { key: "ph", label: "Soil pH", hint: "Soil acidity or alkalinity" },
                  { key: "rainfall", label: "Rainfall", hint: "Expected or observed rainfall" },
                ].map((field) => (
                  <div key={field.key} className="rounded-[20px] border border-white/60 bg-background/60 p-4">
                    <div className="mb-3">
                      <Label htmlFor={field.key} className="text-sm font-semibold text-foreground">
                        {field.label}
                      </Label>
                      <p className="mt-1 text-xs text-muted-foreground">{field.hint}</p>
                    </div>
                    <Input
                      id={field.key}
                      type="number"
                      step="0.1"
                      value={inputs[field.key as keyof PredictorInputs]}
                      onChange={(event) => handleInputChange(field.key as keyof PredictorInputs, event.target.value)}
                      className="bg-white/80"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 rounded-[20px] border border-primary/10 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Ready to predict</p>
                  <p className="text-sm text-muted-foreground">
                    Review the nutrient and climate values, then generate the crop recommendation.
                  </p>
                </div>
                <Button className="gap-2 sm:min-w-44" onClick={handlePredict} disabled={isPredicting}>
                  <Sprout className="h-4 w-4" />
                  {isPredicting ? "Predicting..." : "Predict Crop"}
                </Button>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/60 bg-white/70 p-5 backdrop-blur-xl">
              {predictionResult ? (
                <div className="space-y-4 rounded-[20px] border border-primary/10 bg-primary/5 p-5">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold text-foreground">AI Analysis Results</h3>
                  </div>

                  <div className="rounded-[20px] border border-white/60 bg-white/85 p-5 text-center">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Recommended Crop</p>
                    <p className="mt-2 text-3xl font-extrabold capitalize text-foreground">{predictionResult.crop}</p>
                    <div className="mt-4 inline-flex rounded-full bg-foreground px-5 py-3 text-lg font-bold text-background">
                      {predictionResult.confidence.toFixed(1)}% Confidence
                    </div>
                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-primary/10">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${predictionResult.overall_effectiveness.score}%` }}
                      />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-foreground">
                      {predictionResult.overall_effectiveness.label} Fertilizer Effectiveness
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {predictionResult.overall_effectiveness.summary}
                    </p>
                  </div>

                  <div className="rounded-[20px] border border-white/60 bg-white/85 p-5">
                    <h4 className="font-semibold text-foreground">Recommended Fertilizer Plan</h4>
                    <div className="mt-4 space-y-3">
                      {predictionResult.fertilizer_plan.map((item) => (
                        <div key={`${predictionResult.crop}-${item.fertilizer}`} className="rounded-2xl border border-border bg-background/80 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-semibold text-foreground">{item.fertilizer}</p>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              {item.effectiveness_score.toFixed(1)}% {item.effectiveness_label}
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{item.purpose}</p>
                          <p className="mt-2 text-sm text-foreground">{item.effectiveness_summary}</p>
                          <div className="mt-3 grid gap-2 text-sm lg:grid-cols-2">
                            <p className="text-muted-foreground">
                              Rate: <span className="font-medium text-foreground">{item.application_rate}</span>
                            </p>
                            <p className="text-muted-foreground">
                              Dose: <span className="font-medium text-foreground">{item.estimated_total_quantity}</span>
                            </p>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Timing: <span className="font-medium text-foreground">{item.timing}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[20px] border border-white/60 bg-white/85 p-5">
                    <h4 className="font-semibold text-foreground">Field Recommendations</h4>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {predictionResult.advisory.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[20px] border border-dashed border-white/60 bg-background/50 px-6 text-center">
                  <Sprout className="mb-4 h-10 w-10 text-muted-foreground" />
                  <h3 className="text-xl font-semibold text-foreground">Model prediction will appear here</h3>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Fill in the soil and climate values, then use the predict button to get the best matching crop from the backend model.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CropPrediction;

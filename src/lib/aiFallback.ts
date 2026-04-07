type GrowthStage = "seedling" | "vegetative" | "flowering" | "fruiting" | "mature";

type FertilizerGuide = {
  fertilizer: string;
  purpose: string;
  timing: string;
  kgPerAcre: number;
};

type CropGuide = {
  aliases: string[];
  fertilizers: FertilizerGuide[];
};

const STAGE_EFFECTIVENESS: Record<GrowthStage, number> = {
  seedling: 0.88,
  vegetative: 0.95,
  flowering: 0.9,
  fruiting: 0.85,
  mature: 0.72,
};

const CROP_GUIDES: Record<string, CropGuide> = {
  rice: {
    aliases: ["rice", "paddy"],
    fertilizers: [
      { fertilizer: "DAP", purpose: "Basal phosphorus support", timing: "Before transplanting or sowing", kgPerAcre: 50 },
      { fertilizer: "Urea", purpose: "Nitrogen for tillering and grain growth", timing: "Split across vegetative and panicle stages", kgPerAcre: 45 },
      { fertilizer: "MOP", purpose: "Potassium balance and grain filling", timing: "Basal or first top dressing", kgPerAcre: 20 },
    ],
  },
  wheat: {
    aliases: ["wheat"],
    fertilizers: [
      { fertilizer: "DAP", purpose: "Starter phosphorus", timing: "At sowing", kgPerAcre: 45 },
      { fertilizer: "Urea", purpose: "Nitrogen for tillering", timing: "Two split applications", kgPerAcre: 40 },
      { fertilizer: "MOP", purpose: "Potassium support", timing: "At sowing when soil is low in K", kgPerAcre: 15 },
    ],
  },
  sugarcane: {
    aliases: ["sugarcane", "cane"],
    fertilizers: [
      { fertilizer: "DAP", purpose: "Basal phosphorus", timing: "At planting", kgPerAcre: 60 },
      { fertilizer: "Urea", purpose: "Nitrogen for cane growth", timing: "Split over 3 applications", kgPerAcre: 90 },
      { fertilizer: "MOP", purpose: "Potassium for cane weight and juice quality", timing: "Early growth stage", kgPerAcre: 35 },
    ],
  },
  cotton: {
    aliases: ["cotton"],
    fertilizers: [
      { fertilizer: "DAP", purpose: "Root establishment and phosphorus", timing: "At sowing", kgPerAcre: 40 },
      { fertilizer: "Urea", purpose: "Vegetative nitrogen support", timing: "Split after establishment", kgPerAcre: 35 },
      { fertilizer: "MOP", purpose: "Boll development and stress tolerance", timing: "Square initiation stage", kgPerAcre: 20 },
    ],
  },
  maize: {
    aliases: ["maize", "corn"],
    fertilizers: [
      { fertilizer: "NPK 20:20:20", purpose: "Balanced basal nutrition", timing: "Basal application", kgPerAcre: 25 },
      { fertilizer: "Urea", purpose: "Nitrogen boost during rapid growth", timing: "At knee-high and pre-tasseling stages", kgPerAcre: 50 },
      { fertilizer: "MOP", purpose: "Potassium for cob development", timing: "Basal or early vegetative stage", kgPerAcre: 18 },
    ],
  },
  soybean: {
    aliases: ["soybean", "soyabean", "soy"],
    fertilizers: [
      { fertilizer: "DAP", purpose: "Phosphorus-rich basal nutrition", timing: "At sowing", kgPerAcre: 40 },
      { fertilizer: "MOP", purpose: "Potassium support for pod filling", timing: "Basal application", kgPerAcre: 15 },
      { fertilizer: "Gypsum", purpose: "Sulphur and calcium support", timing: "Basal or early vegetative stage", kgPerAcre: 20 },
    ],
  },
  groundnut: {
    aliases: ["groundnut", "peanut"],
    fertilizers: [
      { fertilizer: "DAP", purpose: "Starter phosphorus support", timing: "At sowing", kgPerAcre: 35 },
      { fertilizer: "Gypsum", purpose: "Calcium and sulphur for pod development", timing: "Flowering stage", kgPerAcre: 40 },
      { fertilizer: "MOP", purpose: "Pod filling and plant strength", timing: "Basal application", kgPerAcre: 12 },
    ],
  },
  mustard: {
    aliases: ["mustard", "rapeseed"],
    fertilizers: [
      { fertilizer: "DAP", purpose: "Basal phosphorus nutrition", timing: "At sowing", kgPerAcre: 35 },
      { fertilizer: "Urea", purpose: "Nitrogen for vegetative growth", timing: "Split between sowing and first irrigation", kgPerAcre: 25 },
      { fertilizer: "MOP", purpose: "Potassium support for siliqua formation", timing: "Basal application", kgPerAcre: 10 },
    ],
  },
  tur: {
    aliases: ["tur", "arhar", "pigeon pea"],
    fertilizers: [
      { fertilizer: "DAP", purpose: "Basal phosphorus support", timing: "At sowing", kgPerAcre: 30 },
      { fertilizer: "NPK 12:32:16", purpose: "Balanced starter nutrition", timing: "Basal application", kgPerAcre: 20 },
      { fertilizer: "Gypsum", purpose: "Sulphur support", timing: "Early vegetative stage", kgPerAcre: 15 },
    ],
  },
  urad_moong: {
    aliases: ["urad", "moong", "mung", "black gram", "green gram"],
    fertilizers: [
      { fertilizer: "DAP", purpose: "Starter phosphorus", timing: "At sowing", kgPerAcre: 25 },
      { fertilizer: "NPK 19:19:19", purpose: "Balanced foliar or starter support", timing: "Early vegetative stage", kgPerAcre: 10 },
      { fertilizer: "Gypsum", purpose: "Sulphur support", timing: "Basal application", kgPerAcre: 12 },
    ],
  },
  gram: {
    aliases: ["gram", "chickpea", "chana"],
    fertilizers: [
      { fertilizer: "DAP", purpose: "Basal phosphorus and nitrogen support", timing: "At sowing", kgPerAcre: 35 },
      { fertilizer: "MOP", purpose: "Potassium support in low-K soils", timing: "Basal application", kgPerAcre: 10 },
      { fertilizer: "Gypsum", purpose: "Sulphur supply for pulses", timing: "Early growth", kgPerAcre: 15 },
    ],
  },
  jute: {
    aliases: ["jute"],
    fertilizers: [
      { fertilizer: "Urea", purpose: "Nitrogen for vegetative growth", timing: "Split applications", kgPerAcre: 35 },
      { fertilizer: "DAP", purpose: "Basal phosphorus support", timing: "At sowing", kgPerAcre: 30 },
      { fertilizer: "MOP", purpose: "Fiber quality and plant strength", timing: "Basal application", kgPerAcre: 15 },
    ],
  },
  tea: {
    aliases: ["tea"],
    fertilizers: [
      { fertilizer: "NPK 20:10:10", purpose: "Leaf flush and balanced growth", timing: "Split seasonal applications", kgPerAcre: 35 },
      { fertilizer: "Urea", purpose: "Nitrogen for leaf production", timing: "During flush periods", kgPerAcre: 20 },
      { fertilizer: "MOP", purpose: "Bush vigor and stress tolerance", timing: "Seasonal split", kgPerAcre: 12 },
    ],
  },
  coffee: {
    aliases: ["coffee"],
    fertilizers: [
      { fertilizer: "NPK 17:17:17", purpose: "Balanced plantation nutrition", timing: "Pre and post-monsoon splits", kgPerAcre: 30 },
      { fertilizer: "Urea", purpose: "Nitrogen support for vegetative growth", timing: "Split with irrigation or rain", kgPerAcre: 15 },
      { fertilizer: "MOP", purpose: "Berry development and stress management", timing: "Fruit development stage", kgPerAcre: 15 },
    ],
  },
  rubber: {
    aliases: ["rubber"],
    fertilizers: [
      { fertilizer: "NPK 10:10:10", purpose: "Balanced tree nutrition", timing: "Seasonal split applications", kgPerAcre: 30 },
      { fertilizer: "Urea", purpose: "Nitrogen support in young plantations", timing: "Early growth phase", kgPerAcre: 12 },
      { fertilizer: "MOP", purpose: "Root vigor and latex support", timing: "Monsoon season", kgPerAcre: 12 },
    ],
  },
  tobacco: {
    aliases: ["tobacco"],
    fertilizers: [
      { fertilizer: "NPK 10:26:26", purpose: "Basal phosphorus and potash support", timing: "Before transplanting", kgPerAcre: 30 },
      { fertilizer: "Calcium Nitrate", purpose: "Nitrogen source with low chloride risk", timing: "Post-establishment", kgPerAcre: 12 },
      { fertilizer: "MOP", purpose: "Use carefully depending on tobacco type and quality target", timing: "Only where suitable", kgPerAcre: 8 },
    ],
  },
  potato: {
    aliases: ["potato"],
    fertilizers: [
      { fertilizer: "NPK 12:32:16", purpose: "Basal phosphorus-heavy feed", timing: "At planting", kgPerAcre: 50 },
      { fertilizer: "Urea", purpose: "Nitrogen for canopy growth", timing: "After emergence", kgPerAcre: 30 },
      { fertilizer: "MOP", purpose: "Tuber size and quality", timing: "At earthing up", kgPerAcre: 25 },
    ],
  },
  onion: {
    aliases: ["onion", "pyaj"],
    fertilizers: [
      { fertilizer: "DAP", purpose: "Basal phosphorus nutrition", timing: "At transplanting or sowing", kgPerAcre: 45 },
      { fertilizer: "Urea", purpose: "Nitrogen for bulb development", timing: "Split between establishment and bulb initiation", kgPerAcre: 30 },
      { fertilizer: "MOP", purpose: "Bulb size and firmness", timing: "At bulb initiation", kgPerAcre: 20 },
    ],
  },
  mango: {
    aliases: ["mango", "mangoes"],
    fertilizers: [
      { fertilizer: "NPK 10:26:26", purpose: "Flowering and fruit set support", timing: "Pre-flowering stage", kgPerAcre: 25 },
      { fertilizer: "Urea", purpose: "Vegetative support in young orchards", timing: "Post-harvest or growth flush", kgPerAcre: 15 },
      { fertilizer: "MOP", purpose: "Fruit quality and size", timing: "Fruit development stage", kgPerAcre: 20 },
    ],
  },
  "general crop": {
    aliases: ["general crop"],
    fertilizers: [
      { fertilizer: "NPK 19:19:19", purpose: "Balanced starter nutrition", timing: "Early vegetative stage", kgPerAcre: 20 },
      { fertilizer: "Urea", purpose: "Nitrogen support when leaves are pale or growth is weak", timing: "Split top dressing", kgPerAcre: 25 },
      { fertilizer: "MOP", purpose: "Potassium support for flowering and stress tolerance", timing: "Before flowering or fruiting", kgPerAcre: 10 },
    ],
  },
};

const prettyCropName = (cropName: string) => cropName.replace(/_/g, "/").replace(/\b\w/g, (char) => char.toUpperCase());

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

const scoreLabel = (score: number) => {
  if (score >= 90) return "Very High";
  if (score >= 80) return "High";
  if (score >= 65) return "Moderate";
  return "Low";
};

const normalizeCropName = (value?: string) => {
  const input = value?.trim().toLowerCase();
  if (!input) return "general crop";

  for (const [cropName, guide] of Object.entries(CROP_GUIDES)) {
    if (input === cropName || guide.aliases.includes(input)) {
      return cropName;
    }
  }

  for (const [cropName, guide] of Object.entries(CROP_GUIDES)) {
    if (guide.aliases.some((alias) => input.includes(alias))) {
      return cropName;
    }
  }

  return "general crop";
};

const inferCropName = (hints: string[]) => {
  const joined = hints.join(" ").toLowerCase();
  return normalizeCropName(joined);
};

const formatQuantity = (kgPerAcre: number, acreage: number, areaUnit: string) => {
  const acres = areaUnit === "hectare" ? acreage * 2.47105 : acreage;
  const totalKg = Math.round(kgPerAcre * acres * 10) / 10;

  return {
    application_rate: `${kgPerAcre} kg/acre`,
    estimated_total_quantity: `${totalKg} kg for ${acreage} ${areaUnit}${acreage === 1 ? "" : "s"}`,
  };
};

const fertilizerEffectiveness = (purpose: string, growthStage: GrowthStage, confidence: number) => {
  let score = STAGE_EFFECTIVENESS[growthStage] * 70 + confidence * 22;
  if (growthStage === "vegetative" && purpose.toLowerCase().includes("nitrogen")) score += 6;
  if (growthStage === "flowering" && purpose.toLowerCase().includes("flower")) score += 5;
  if (growthStage === "fruiting" && purpose.toLowerCase().includes("fruit")) score += 5;
  const rounded = Math.round(clamp(score / 100) * 1000) / 10;

  return {
    effectiveness_score: rounded,
    effectiveness_label: scoreLabel(rounded),
    effectiveness_summary: `Estimated field effectiveness is ${rounded}% when applied at the recommended timing.`,
  };
};

const overallEffectiveness = (growthStage: GrowthStage, confidence: number, fertilizerCount: number, cropName: string) => {
  const stageFactor = STAGE_EFFECTIVENESS[growthStage];
  const confidenceFactor = 0.65 + clamp(confidence / 100) * 0.35;
  const planStrength = Math.min(1, 0.78 + fertilizerCount * 0.05);
  const score = Math.round(clamp(stageFactor * confidenceFactor * planStrength) * 1000) / 10;
  return {
    score,
    label: scoreLabel(score),
    confidence,
    summary: `The suggested fertilizer plan is expected to work with ${score}% effectiveness for ${prettyCropName(cropName)} under the selected ${growthStage} stage.`,
  };
};

const buildRecommendation = (cropName: string, acreage: number, areaUnit: string, growthStage: GrowthStage, confidence: number, analysisSource: string, analysisSummary: string) => {
  const guide = CROP_GUIDES[cropName] ?? CROP_GUIDES["general crop"];
  const fertilizer_plan = guide.fertilizers.map((item) => ({
    fertilizer: item.fertilizer,
    purpose: item.purpose,
    timing: item.timing,
    ...formatQuantity(item.kgPerAcre, acreage, areaUnit),
    ...fertilizerEffectiveness(item.purpose, growthStage, confidence),
  }));

  return {
    crop_name: prettyCropName(cropName),
    growth_stage: growthStage,
    analysis_summary: analysisSummary,
    analysis_source: analysisSource,
    detection_confidence: confidence,
    overall_effectiveness: overallEffectiveness(growthStage, confidence, fertilizer_plan.length, cropName),
    fertilizer_plan,
    advisory: [
      "Use a soil test before finalizing the exact dose whenever possible.",
      "Split nitrogen fertilizers like urea across stages instead of applying everything at once.",
      "Reduce recommendation slightly if the crop already looks dark green and vigorous.",
      "Consult a local agronomist immediately if the crop shows severe disease, pest attack, or chemical burn symptoms.",
    ],
    disclaimer: "This is an offline fallback recommendation for initial guidance only.",
  };
};

export const generateAdvisorFallback = (params: {
  imageFilename: string;
  selectedCrop?: string;
  farmerNotes?: string;
  acreage: number;
  areaUnit: string;
  growthStage: GrowthStage;
}) => {
  const cropName = inferCropName([params.selectedCrop ?? "", params.farmerNotes ?? "", params.imageFilename]);
  const selected = normalizeCropName(params.selectedCrop);
  const confidence = selected !== "general crop" ? 92 : cropName !== "general crop" ? 74 : 58;
  const source = selected !== "general crop" ? "selected-crop-hint" : "offline-fallback";
  const summary =
    selected !== "general crop"
      ? "Recommendation used the selected crop hint together with the uploaded image details."
      : "Backend was unavailable, so the app used the selected hints and local crop rules.";

  return buildRecommendation(cropName, params.acreage, params.areaUnit, params.growthStage, confidence, source, summary);
};

export const generateSoilPredictionFallback = (inputs: {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}) => {
  let cropName = "general crop";

  if (inputs.rainfall >= 180 && inputs.humidity >= 75) cropName = "rice";
  else if (inputs.temperature <= 24 && inputs.ph >= 6 && inputs.ph <= 7.5) cropName = "wheat";
  else if (inputs.temperature >= 26 && inputs.rainfall >= 100 && inputs.K >= 40) cropName = "maize";
  else if (inputs.temperature >= 24 && inputs.humidity < 70 && inputs.K >= 35) cropName = "cotton";
  else if (inputs.temperature >= 24 && inputs.rainfall >= 120 && inputs.N >= 80) cropName = "sugarcane";
  else if (inputs.P >= 35 && inputs.K >= 30 && inputs.temperature >= 20) cropName = "soybean";

  const confidence = cropName === "general crop" ? 62 : 84;
  const recommendation = buildRecommendation(
    cropName,
    1,
    "acre",
    "vegetative",
    confidence,
    "offline-soil-fallback",
    "Backend was unavailable, so the app used offline soil heuristics based on nutrient and climate values.",
  );

  return {
    crop: cropName,
    confidence,
    overall_effectiveness: recommendation.overall_effectiveness,
    fertilizer_plan: recommendation.fertilizer_plan,
    advisory: recommendation.advisory,
  };
};

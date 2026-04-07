import base64
import json
import os
import pickle
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "crop_model.pkl"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with MODEL_PATH.open("rb") as model_file:
    model = pickle.load(model_file)

MODEL_FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_VISION_MODEL = os.getenv("OPENAI_VISION_MODEL", "gpt-4.1-mini")

CROP_GUIDES = {
    "rice": {
        "aliases": ["rice", "paddy", "???"],
        "fertilizers": [
            {"name": "DAP", "purpose": "Basal phosphorus support", "kg_per_acre": 50, "timing": "Before transplanting or sowing"},
            {"name": "Urea", "purpose": "Nitrogen for tillering and grain growth", "kg_per_acre": 45, "timing": "Split across vegetative and panicle stages"},
            {"name": "MOP", "purpose": "Potassium balance and grain filling", "kg_per_acre": 20, "timing": "Basal or first top dressing"},
        ],
    },
    "wheat": {
        "aliases": ["wheat", "?????"],
        "fertilizers": [
            {"name": "DAP", "purpose": "Starter phosphorus", "kg_per_acre": 45, "timing": "At sowing"},
            {"name": "Urea", "purpose": "Nitrogen for tillering", "kg_per_acre": 40, "timing": "Two split applications"},
            {"name": "MOP", "purpose": "Potassium support", "kg_per_acre": 15, "timing": "At sowing when soil is low in K"},
        ],
    },
    "sugarcane": {
        "aliases": ["sugarcane", "cane", "?????"],
        "fertilizers": [
            {"name": "DAP", "purpose": "Basal phosphorus", "kg_per_acre": 60, "timing": "At planting"},
            {"name": "Urea", "purpose": "Nitrogen for cane growth", "kg_per_acre": 90, "timing": "Split over 3 applications"},
            {"name": "MOP", "purpose": "Potassium for cane weight and juice quality", "kg_per_acre": 35, "timing": "Early growth stage"},
        ],
    },
    "cotton": {
        "aliases": ["cotton", "????"],
        "fertilizers": [
            {"name": "DAP", "purpose": "Root establishment and phosphorus", "kg_per_acre": 40, "timing": "At sowing"},
            {"name": "Urea", "purpose": "Vegetative nitrogen support", "kg_per_acre": 35, "timing": "Split after establishment"},
            {"name": "MOP", "purpose": "Boll development and stress tolerance", "kg_per_acre": 20, "timing": "Square initiation stage"},
        ],
    },
    "maize": {
        "aliases": ["maize", "corn", "?????"],
        "fertilizers": [
            {"name": "NPK 20:20:20", "purpose": "Balanced basal nutrition", "kg_per_acre": 25, "timing": "Basal application"},
            {"name": "Urea", "purpose": "Nitrogen boost during rapid growth", "kg_per_acre": 50, "timing": "At knee-high and pre-tasseling stages"},
            {"name": "MOP", "purpose": "Potassium for cob development", "kg_per_acre": 18, "timing": "Basal or early vegetative stage"},
        ],
    },
    "soybean": {
        "aliases": ["soybean", "soyabean", "soy", "???????"],
        "fertilizers": [
            {"name": "DAP", "purpose": "Phosphorus-rich basal nutrition", "kg_per_acre": 40, "timing": "At sowing"},
            {"name": "MOP", "purpose": "Potassium support for pod filling", "kg_per_acre": 15, "timing": "Basal application"},
            {"name": "Gypsum", "purpose": "Sulphur and calcium support", "kg_per_acre": 20, "timing": "Basal or early vegetative stage"},
        ],
    },
    "groundnut": {
        "aliases": ["groundnut", "peanut", "moongphali", "???????"],
        "fertilizers": [
            {"name": "DAP", "purpose": "Starter phosphorus support", "kg_per_acre": 35, "timing": "At sowing"},
            {"name": "Gypsum", "purpose": "Calcium and sulphur for pod development", "kg_per_acre": 40, "timing": "Flowering stage"},
            {"name": "MOP", "purpose": "Pod filling and plant strength", "kg_per_acre": 12, "timing": "Basal application"},
        ],
    },
    "mustard": {
        "aliases": ["mustard", "rapeseed", "sarson", "?????"],
        "fertilizers": [
            {"name": "DAP", "purpose": "Basal phosphorus nutrition", "kg_per_acre": 35, "timing": "At sowing"},
            {"name": "Urea", "purpose": "Nitrogen for vegetative growth", "kg_per_acre": 25, "timing": "Split between sowing and first irrigation"},
            {"name": "MOP", "purpose": "Potassium support for siliqua formation", "kg_per_acre": 10, "timing": "Basal application"},
        ],
    },
    "tur": {
        "aliases": ["tur", "arhar", "pigeon pea", "pigeonpea", "???", "????"],
        "fertilizers": [
            {"name": "DAP", "purpose": "Basal phosphorus support", "kg_per_acre": 30, "timing": "At sowing"},
            {"name": "NPK 12:32:16", "purpose": "Balanced starter nutrition", "kg_per_acre": 20, "timing": "Basal application"},
            {"name": "Gypsum", "purpose": "Sulphur support", "kg_per_acre": 15, "timing": "Early vegetative stage"},
        ],
    },
    "urad_moong": {
        "aliases": ["urad", "moong", "mung", "black gram", "green gram", "????", "????"],
        "fertilizers": [
            {"name": "DAP", "purpose": "Starter phosphorus", "kg_per_acre": 25, "timing": "At sowing"},
            {"name": "NPK 19:19:19", "purpose": "Balanced foliar or starter support", "kg_per_acre": 10, "timing": "Early vegetative stage"},
            {"name": "Gypsum", "purpose": "Sulphur support", "kg_per_acre": 12, "timing": "Basal application"},
        ],
    },
    "gram": {
        "aliases": ["gram", "chickpea", "chana", "???"],
        "fertilizers": [
            {"name": "DAP", "purpose": "Basal phosphorus and nitrogen support", "kg_per_acre": 35, "timing": "At sowing"},
            {"name": "MOP", "purpose": "Potassium support in low-K soils", "kg_per_acre": 10, "timing": "Basal application"},
            {"name": "Gypsum", "purpose": "Sulphur supply for pulses", "kg_per_acre": 15, "timing": "Early growth"},
        ],
    },
    "jute": {
        "aliases": ["jute"],
        "fertilizers": [
            {"name": "Urea", "purpose": "Nitrogen for vegetative growth", "kg_per_acre": 35, "timing": "Split applications"},
            {"name": "DAP", "purpose": "Basal phosphorus support", "kg_per_acre": 30, "timing": "At sowing"},
            {"name": "MOP", "purpose": "Fiber quality and plant strength", "kg_per_acre": 15, "timing": "Basal application"},
        ],
    },
    "tea": {
        "aliases": ["tea"],
        "fertilizers": [
            {"name": "NPK 20:10:10", "purpose": "Leaf flush and balanced growth", "kg_per_acre": 35, "timing": "Split seasonal applications"},
            {"name": "Urea", "purpose": "Nitrogen for leaf production", "kg_per_acre": 20, "timing": "During flush periods"},
            {"name": "MOP", "purpose": "Bush vigor and stress tolerance", "kg_per_acre": 12, "timing": "Seasonal split"},
        ],
    },
    "coffee": {
        "aliases": ["coffee"],
        "fertilizers": [
            {"name": "NPK 17:17:17", "purpose": "Balanced plantation nutrition", "kg_per_acre": 30, "timing": "Pre and post-monsoon splits"},
            {"name": "Urea", "purpose": "Nitrogen support for vegetative growth", "kg_per_acre": 15, "timing": "Split with irrigation or rain"},
            {"name": "MOP", "purpose": "Berry development and stress management", "kg_per_acre": 15, "timing": "Fruit development stage"},
        ],
    },
    "rubber": {
        "aliases": ["rubber"],
        "fertilizers": [
            {"name": "NPK 10:10:10", "purpose": "Balanced tree nutrition", "kg_per_acre": 30, "timing": "Seasonal split applications"},
            {"name": "Urea", "purpose": "Nitrogen support in young plantations", "kg_per_acre": 12, "timing": "Early growth phase"},
            {"name": "MOP", "purpose": "Root vigor and latex support", "kg_per_acre": 12, "timing": "Monsoon season"},
        ],
    },
    "tobacco": {
        "aliases": ["tobacco"],
        "fertilizers": [
            {"name": "NPK 10:26:26", "purpose": "Basal phosphorus and potash support", "kg_per_acre": 30, "timing": "Before transplanting"},
            {"name": "Calcium Nitrate", "purpose": "Nitrogen source with low chloride risk", "kg_per_acre": 12, "timing": "Post-establishment"},
            {"name": "MOP", "purpose": "Use carefully depending on tobacco type and quality target", "kg_per_acre": 8, "timing": "Only where suitable"},
        ],
    },
    "potato": {
        "aliases": ["potato", "???"],
        "fertilizers": [
            {"name": "NPK 12:32:16", "purpose": "Basal phosphorus-heavy feed", "kg_per_acre": 50, "timing": "At planting"},
            {"name": "Urea", "purpose": "Nitrogen for canopy growth", "kg_per_acre": 30, "timing": "After emergence"},
            {"name": "MOP", "purpose": "Tuber size and quality", "kg_per_acre": 25, "timing": "At earthing up"},
        ],
    },
    "onion": {
        "aliases": ["onion", "?????", "pyaj"],
        "fertilizers": [
            {"name": "DAP", "purpose": "Basal phosphorus nutrition", "kg_per_acre": 45, "timing": "At transplanting or sowing"},
            {"name": "Urea", "purpose": "Nitrogen for bulb development", "kg_per_acre": 30, "timing": "Split between establishment and bulb initiation"},
            {"name": "MOP", "purpose": "Bulb size and firmness", "kg_per_acre": 20, "timing": "At bulb initiation"},
        ],
    },
    "mango": {
        "aliases": ["mango", "mangoes", "??"],
        "fertilizers": [
            {"name": "NPK 10:26:26", "purpose": "Flowering and fruit set support", "kg_per_acre": 25, "timing": "Pre-flowering stage"},
            {"name": "Urea", "purpose": "Vegetative support in young orchards", "kg_per_acre": 15, "timing": "Post-harvest or growth flush"},
            {"name": "MOP", "purpose": "Fruit quality and size", "kg_per_acre": 20, "timing": "Fruit development stage"},
        ],
    },
    "general crop": {
        "aliases": ["general crop"],
        "fertilizers": [
            {"name": "NPK 19:19:19", "purpose": "Balanced starter nutrition", "kg_per_acre": 20, "timing": "Early vegetative stage"},
            {"name": "Urea", "purpose": "Nitrogen support when leaves are pale or growth is weak", "kg_per_acre": 25, "timing": "Split top dressing"},
            {"name": "MOP", "purpose": "Potassium support for flowering and stress tolerance", "kg_per_acre": 10, "timing": "Before flowering or fruiting"},
        ],
    },
}

SUPPORTED_CROP_NAMES = [
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
    "General Crop",
]

STAGE_EFFECTIVENESS = {
    "seedling": 0.88,
    "vegetative": 0.95,
    "flowering": 0.9,
    "fruiting": 0.85,
    "mature": 0.72,
}


def clamp(value: float, minimum: float = 0.0, maximum: float = 1.0) -> float:
    return max(minimum, min(maximum, value))


def score_to_label(score: float) -> str:
    if score >= 0.9:
        return "Very High"
    if score >= 0.8:
        return "High"
    if score >= 0.65:
        return "Moderate"
    return "Low"


def build_effectiveness_summary(
    crop_name: str,
    growth_stage: str,
    confidence: float,
    fertilizer_count: int,
) -> dict[str, Any]:
    stage_factor = STAGE_EFFECTIVENESS.get(growth_stage, 0.82)
    confidence_factor = 0.65 + (clamp(confidence) * 0.35)
    plan_strength = min(1.0, 0.78 + (fertilizer_count * 0.05))
    effectiveness_score = round(clamp(stage_factor * confidence_factor * plan_strength) * 100, 1)

    return {
        "score": effectiveness_score,
        "label": score_to_label(effectiveness_score / 100),
        "confidence": round(clamp(confidence) * 100, 1),
        "summary": f"The suggested fertilizer plan is expected to work with {effectiveness_score:.1f}% effectiveness for {crop_name.title().replace('_', ' ')} under the selected {growth_stage} stage.",
    }


def fertilizer_effectiveness(item: dict[str, Any], growth_stage: str, confidence: float) -> dict[str, Any]:
    stage_factor = STAGE_EFFECTIVENESS.get(growth_stage, 0.82)
    purpose_bonus = 0.06 if "nitrogen" in item["purpose"].lower() and growth_stage == "vegetative" else 0.0
    purpose_bonus += 0.05 if "flower" in item["purpose"].lower() and growth_stage == "flowering" else 0.0
    purpose_bonus += 0.05 if "fruit" in item["purpose"].lower() and growth_stage == "fruiting" else 0.0
    score = round(clamp((stage_factor * 0.7) + (clamp(confidence) * 0.22) + purpose_bonus) * 100, 1)
    return {
        "score": score,
        "label": score_to_label(score / 100),
        "summary": f"Estimated field effectiveness is {score:.1f}% when applied at the recommended timing.",
    }


def extract_image_bytes(image_payload: str) -> tuple[bytes, str]:
    if not image_payload:
        raise HTTPException(status_code=400, detail="Image data is required")

    if "," in image_payload and image_payload.startswith("data:"):
        header, encoded = image_payload.split(",", 1)
        content_type = header.split(";")[0].replace("data:", "", 1) or "image/jpeg"
    else:
        encoded = image_payload
        content_type = "image/jpeg"

    try:
        return base64.b64decode(encoded), content_type
    except Exception as error:
        raise HTTPException(status_code=400, detail="Invalid image encoding") from error


@app.get("/healthz")
def healthz() -> dict[str, Any]:
    return {
        "status": "ok",
        "vision_enabled": bool(OPENAI_API_KEY),
        "supported_crops_count": len(SUPPORTED_CROP_NAMES) - 1,
    }


@app.get("/supported-crops")
def supported_crops() -> dict[str, Any]:
    return {
        "crops": SUPPORTED_CROP_NAMES[:-1],
        "includes_general_fallback": True,
    }


def normalize_crop_name(crop_name: str | None) -> str:
    if not crop_name:
        return "general crop"

    lower_name = crop_name.strip().lower()
    for canonical_name, guide in CROP_GUIDES.items():
        if lower_name == canonical_name or lower_name in guide["aliases"]:
            return canonical_name

    for canonical_name, guide in CROP_GUIDES.items():
        if any(alias in lower_name for alias in guide["aliases"]):
            return canonical_name

    return "general crop"


def infer_crop_without_external_ai(filename: str, farmer_notes: str) -> str:
    haystack = f"{filename} {farmer_notes}".lower()
    for canonical_name, guide in CROP_GUIDES.items():
        if canonical_name == "general crop":
            continue
        if any(alias in haystack for alias in guide["aliases"]):
            return canonical_name
    return "general crop"


def resolve_selected_crop(selected_crop: str) -> str:
    normalized = normalize_crop_name(selected_crop)
    return normalized if normalized in CROP_GUIDES else "general crop"


def format_quantity(kg_per_acre: float, acreage: float, area_unit: str) -> dict[str, str]:
    acres = acreage if area_unit == "acre" else acreage * 2.47105
    total_kg = round(kg_per_acre * acres, 1)
    return {
        "rate": f"{kg_per_acre:g} kg/acre",
        "total": f"{total_kg:g} kg for {acreage:g} {area_unit}{'' if acreage == 1 else 's'}",
    }


def build_recommendation_payload(
    crop_name: str,
    acreage: float,
    area_unit: str,
    growth_stage: str,
    analysis_summary: str,
    analysis_source: str,
    detection_confidence: float = 0.78,
) -> dict[str, Any]:
    canonical_name = normalize_crop_name(crop_name)
    guide = CROP_GUIDES[canonical_name]
    fertilizers = []

    for item in guide["fertilizers"]:
        quantity = format_quantity(item["kg_per_acre"], acreage, area_unit)
        effectiveness = fertilizer_effectiveness(item, growth_stage, detection_confidence)
        fertilizers.append(
            {
                "fertilizer": item["name"],
                "purpose": item["purpose"],
                "timing": item["timing"],
                "application_rate": quantity["rate"],
                "estimated_total_quantity": quantity["total"],
                "effectiveness_score": effectiveness["score"],
                "effectiveness_label": effectiveness["label"],
                "effectiveness_summary": effectiveness["summary"],
            }
        )

    overall_effectiveness = build_effectiveness_summary(
        crop_name=canonical_name,
        growth_stage=growth_stage,
        confidence=detection_confidence,
        fertilizer_count=len(fertilizers),
    )

    return {
        "crop_name": canonical_name.title().replace("_", "/"),
        "growth_stage": growth_stage,
        "analysis_summary": analysis_summary,
        "analysis_source": analysis_source,
        "detection_confidence": round(clamp(detection_confidence) * 100, 1),
        "overall_effectiveness": overall_effectiveness,
        "fertilizer_plan": fertilizers,
        "advisory": [
            "Use a soil test before finalizing the exact dose whenever possible.",
            "Split nitrogen fertilizers like urea across stages instead of applying everything at once.",
            "Reduce recommendation slightly if the crop already looks dark green and vigorous.",
            "Consult a local agronomist immediately if the crop shows severe disease, pest attack, or chemical burn symptoms.",
        ],
        "disclaimer": "This is an AI-assisted recommendation for initial guidance only. Final fertilizer choice and dose should be confirmed with soil condition, irrigation availability, and local agronomy advice.",
    }


def analyze_crop_with_openai(
    image_bytes: bytes,
    content_type: str,
    farmer_notes: str,
    growth_stage: str,
    selected_crop: str = "",
) -> dict[str, Any]:
    encoded_image = base64.b64encode(image_bytes).decode("utf-8")
    supported_crops_text = ", ".join(SUPPORTED_CROP_NAMES)
    prompt = (
        "You are an agricultural crop identification assistant. "
        "Look at the uploaded field image and identify the most likely crop. "
        f"Growth stage: {growth_stage}. "
        f"User-selected crop hint: {selected_crop or 'None provided'}. "
        f"Farmer notes: {farmer_notes or 'None provided'}. "
        f"Only choose from these crop names when possible: {supported_crops_text}. "
        "Return strict JSON with keys: crop_name, confidence, analysis_summary. "
        "If the image is unclear, use General Crop. "
        "Give extra weight to the user-selected crop hint when it matches the image reasonably well. "
        "Keep crop_name short and normalized to one supported crop."
    )

    payload = {
        "model": OPENAI_VISION_MODEL,
        "input": [
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": prompt},
                    {
                        "type": "input_image",
                        "image_url": f"data:{content_type};base64,{encoded_image}",
                    },
                ],
            }
        ],
        "text": {"format": {"type": "json_object"}},
    }

    request = Request(
        "https://api.openai.com/v1/responses",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_API_KEY}",
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=60) as response:
            response_data = json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        detail = error.read().decode("utf-8", errors="ignore")
        raise HTTPException(status_code=502, detail=f"Vision API error: {detail}") from error
    except URLError as error:
        raise HTTPException(status_code=502, detail=f"Unable to reach vision API: {error.reason}") from error

    output_text = ""
    for item in response_data.get("output", []):
        for content in item.get("content", []):
            if content.get("type") in {"output_text", "text"}:
                output_text += content.get("text", "")

    if not output_text:
        raise HTTPException(status_code=502, detail="Vision API returned an empty analysis")

    try:
        return json.loads(output_text)
    except json.JSONDecodeError as error:
        raise HTTPException(status_code=502, detail="Vision API returned invalid JSON") from error


@app.post("/predict")
def predict(data: dict):
    import pandas as pd

    feature_row = {
        "N": data["N"],
        "P": data["P"],
        "K": data["K"],
        "temperature": data["temperature"],
        "humidity": data["humidity"],
        "ph": data["ph"],
        "rainfall": data["rainfall"],
    }
    feature_frame = pd.DataFrame([feature_row], columns=MODEL_FEATURES)

    prediction = model.predict(feature_frame)
    probabilities = model.predict_proba(feature_frame)[0] if hasattr(model, "predict_proba") else None
    confidence = float(max(probabilities)) if probabilities is not None else 0.82
    crop_name = str(prediction[0])
    normalized_crop = normalize_crop_name(crop_name)
    growth_stage = "vegetative"
    recommendation = build_recommendation_payload(
        crop_name=normalized_crop,
        acreage=1.0,
        area_unit="acre",
        growth_stage=growth_stage,
        analysis_summary="Crop suitability predicted from nutrient, soil pH, temperature, humidity, and rainfall values.",
        analysis_source="soil-ml-model",
        detection_confidence=confidence,
    )

    return {
        "crop": crop_name,
        "confidence": round(clamp(confidence) * 100, 1),
        "overall_effectiveness": recommendation["overall_effectiveness"],
        "fertilizer_plan": recommendation["fertilizer_plan"],
        "advisory": recommendation["advisory"],
    }


@app.post("/analyze-crop-image")
def analyze_crop_image(data: dict[str, Any]):
    image_payload = data.get("image_base64", "")
    image_filename = data.get("image_filename", "") or ""
    acreage = float(data.get("acreage", 1.0))
    area_unit = str(data.get("area_unit", "acre"))
    growth_stage = str(data.get("growth_stage", "vegetative"))
    selected_crop = str(data.get("selected_crop", ""))
    farmer_notes = str(data.get("farmer_notes", ""))
    selected_crop_name = resolve_selected_crop(selected_crop)

    image_bytes, content_type = extract_image_bytes(image_payload)
    if not content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload a valid crop image")

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded image is empty")

    if acreage <= 0:
        raise HTTPException(status_code=400, detail="Area must be greater than zero")

    if area_unit not in {"acre", "hectare"}:
        raise HTTPException(status_code=400, detail="Area unit must be acre or hectare")

    if OPENAI_API_KEY:
        ai_result = analyze_crop_with_openai(
            image_bytes,
            content_type,
            farmer_notes,
            growth_stage,
            selected_crop=selected_crop_name if selected_crop_name != "general crop" else "",
        )
        crop_name = ai_result.get("crop_name") or selected_crop_name or "general crop"
        analysis_summary = ai_result.get("analysis_summary") or "Crop detected from uploaded image."
        analysis_source = f"vision-model:{OPENAI_VISION_MODEL}"
        detection_confidence = float(ai_result.get("confidence") or 0.86)
    else:
        crop_name = (
            selected_crop_name
            if selected_crop_name != "general crop"
            else infer_crop_without_external_ai(image_filename, farmer_notes)
        )
        analysis_summary = (
            "Recommendation used the selected crop hint together with the uploaded image details."
            if selected_crop_name != "general crop"
            else "AI vision key is not configured, so this recommendation used crop hints from the provided notes or file name."
        )
        analysis_source = "selected-crop-hint" if selected_crop_name != "general crop" else "knowledge-base-fallback"
        detection_confidence = 0.92 if selected_crop_name != "general crop" else 0.74 if crop_name != "general crop" else 0.58

    return build_recommendation_payload(
        crop_name=crop_name,
        acreage=acreage,
        area_unit=area_unit,
        growth_stage=growth_stage,
        analysis_summary=analysis_summary,
        analysis_source=analysis_source,
        detection_confidence=detection_confidence,
    )

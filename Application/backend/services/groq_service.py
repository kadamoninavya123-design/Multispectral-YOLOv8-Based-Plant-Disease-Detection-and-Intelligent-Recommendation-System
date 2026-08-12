import logging
from groq import Groq
from config import Config

logger = logging.getLogger(__name__)

_client = None


def init_groq():
    """Initialize Groq client."""
    global _client
    if Config.GROQ_API_KEY:
        _client = Groq(api_key=Config.GROQ_API_KEY)
        logger.info("Groq API client initialized")
    else:
        logger.warning("GROQ_API_KEY not set — mitigation suggestions will be unavailable")


def get_mitigation(disease_name: str) -> dict:
    """
    Call Groq LLM to generate structured mitigation suggestions for a disease.
    Returns dict with keys: cause, prevention, treatment, fertilizer_advice, environmental_conditions
    """
    if _client is None:
        return _fallback_response(disease_name)

    prompt = f"""You are an expert agricultural plant pathologist. A plant has been diagnosed with: **{disease_name}**

Provide a detailed, structured mitigation and prevention guide. Respond ONLY in this exact JSON format (no markdown fences, no extra text):

{{
  "disease": "{disease_name}",
  "cause": "Detailed explanation of what causes this disease (pathogen, conditions, vectors)",
  "prevention": "Step-by-step prevention measures (5-6 practical steps)",
  "treatment": "Recommended treatment methods including organic and chemical options",
  "fertilizer_advice": "Specific fertilizer recommendations to strengthen plant resistance",
  "environmental_conditions": "Optimal environmental conditions to prevent this disease (temperature, humidity, soil pH, etc.)"
}}"""

    try:
        response = _client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert plant pathologist. Always respond with valid JSON only. No markdown code fences.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=1200,
        )

        text = response.choices[0].message.content.strip()

        # Strip markdown fences if present
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
        if text.endswith("```"):
            text = text.rsplit("```", 1)[0]
        text = text.strip()

        import json
        data = json.loads(text)
        return data

    except Exception as e:
        logger.error(f"Groq API error: {e}")
        return _fallback_response(disease_name)


def _fallback_response(disease_name: str) -> dict:
    """Return a placeholder when Groq API is unavailable."""
    return {
        "disease": disease_name,
        "cause": "Groq API key not configured. Please set GROQ_API_KEY environment variable for AI-powered suggestions.",
        "prevention": "N/A",
        "treatment": "N/A",
        "fertilizer_advice": "N/A",
        "environmental_conditions": "N/A",
    }

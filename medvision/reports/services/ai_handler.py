import os 
import google.generativeai as genai
from django.conf import settings
import json

#Setup

genai.confinguer(api_key=os.environ.get("GEMINI_API_KEY"))

def analyze_scan(image_path):
    # We use Gemini 1.5 Flash it's fast for demos

    model = genai.GenerativeModel(
        model_name='gemini-1.5-flash',
        generation_config={"response_mime_type": "application/json"}
    )
    prompt = """
    You are a professional medical assistant for the Medvision platform.
    Analyze the provided medical report and extract the following into JSON:
    {
        "patient_name": "string",
        "age": "integer",
        "diagnosis": "string",
        "recommended_tests": ["list"],
        "severity": "Low/Medium/High"
    }
    If information is missing, use "Unknown"
"""

    # Upload image to Generate 
    sample_file = genai.upload_file(path=file_path)
    response = model.generate_content([prompt, sample_file])
    
    return json.loads(response.text)
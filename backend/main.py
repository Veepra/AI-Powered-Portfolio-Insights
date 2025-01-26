from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow only your React frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Your existing endpoints
class URLInput(BaseModel):
    url: str

@app.get("/")
def read_root():
    return {"message": "Backend is up and running!"}

@app.post("/analyze")
def analyze_url(input_data: URLInput):
    url = input_data.url

    try:
        # Fetch the webpage content
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        # Analyze basic metadata
        title_start = response.text.find("<title>") + len("<title>")
        title_end = response.text.find("</title>", title_start)
        title = response.text[title_start:title_end].strip() if title_start > 0 else "No title found"

        # Return analysis results
        return {
            "url": url,
            "status": "Analysis complete",
            "title": title,
            "length": len(response.text),  # Length of the HTML content
        }
    except requests.exceptions.RequestException as e:
        return {"url": url, "status": "Failed to fetch URL", "error": str(e)}
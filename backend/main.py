from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup

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
        # Fetch the webpage
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        # Parse HTML with BeautifulSoup
        soup = BeautifulSoup(response.text, "html.parser")

        # Extract metadata
        title = soup.title.string.strip() if soup.title else "No title found"
        meta_description = (
            soup.find("meta", {"name": "description"}) or {}
        ).get("content", "No description found")
        keywords = (soup.find("meta", {"name": "keywords"}) or {}).get(
            "content", "No keywords found"
        )

        # Analyze headers
        h1_tags = [h1.text.strip() for h1 in soup.find_all("h1")]
        h2_tags = [h2.text.strip() for h2 in soup.find_all("h2")]

        # Count links
        all_links = soup.find_all("a")
        total_links = len(all_links)
        external_links = [
            link.get("href")
            for link in all_links
            if link.get("href") and link.get("href").startswith("http")
        ]
        internal_links = total_links - len(external_links)

        # Count images
        images = soup.find_all("img")
        total_images = len(images)
        images_missing_alt = sum(1 for img in images if not img.get("alt"))

        # Return analysis results
        return {
            "url": url,
            "status": "Analysis complete",
            "metadata": {
                "title": title,
                "description": meta_description,
                "keywords": keywords,
            },
            "headers": {
                "h1": h1_tags,
                "h2": h2_tags,
            },
            "links": {
                "total_links": total_links,
                "internal_links": internal_links,
                "external_links": len(external_links),
            },
            "images": {
                "total_images": total_images,
                "missing_alt": images_missing_alt,
            },
        }

    except requests.exceptions.RequestException as e:
        return {"url": url, "status": "Failed to fetch URL", "error": str(e)}
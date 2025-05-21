from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import requests
from bs4 import BeautifulSoup

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLRequest(BaseModel):
    urls: List[str]

@app.post("/scrape-images")
def scrape_images(data: URLRequest):
    all_images = {}

    for url in data.urls:
        try:
            response = requests.get(url)
            soup = BeautifulSoup(response.content, "html.parser")
            images = [img.get("src") for img in soup.find_all("img") if img.get("src")]
            all_images[url] = images
        except Exception as e:
            all_images[url] = {"error": str(e)}

    return all_images
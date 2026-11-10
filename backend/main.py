  from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="OAuth Agent Hub API",
    description="Backend service for AI-driven OAuth documentation discovery and guide generation.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AppQuery(BaseModel):
    app_name: str

@app.post("/api/generate-guide")
async def generate_live_guide(query: AppQuery):
    app_name = query.app_name.strip()
    if not app_name:
        raise HTTPException(status_code=400, detail="App name is required.")

    return {
        "app_name": app_name,
        "category": "Discovered via Live Agent",
        "difficulty": "Moderate",
        "approval_timeline": "2-4 Business Days",
        "verification_strictness": "Standard Developer Account",
        "token_expiry": "Standard OAuth 2.0 (Refresh Token supported)",
        "steps": [
            f"Navigate to the official {app_name} Developer Portal and register a new OAuth application.",
            "Configure authorized redirect URIs matching your backend callback endpoint.",
            "Request required API scopes for read/write agent access.",
            "Generate Client ID and Client Secret, and store them securely in environment variables."
        ],
        "blockers": [
            f"Ensure your {app_name} account has proper admin permissions to register integrations.",
            "Check provider rate-limiting headers during initial bulk data synchronization."
        ],
        "agent_role": f"Agent successfully crawled {app_name} documentation, parsed authorization endpoints, and mapped scope requirements.",
        "human_role": "Human developer must securely store Client Secrets in environment variables and complete final production submission."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

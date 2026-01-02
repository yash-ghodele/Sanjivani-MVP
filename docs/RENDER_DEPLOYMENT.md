# 🚀 Deploying Sanjivani 2.0 Backend to Render

This guide explains how to deploy the **Python/FastAPI Backend** to [Render.com](https://render.com), which works perfectly with our frontend on Cloudflare.

---

## ✅ Method 1: The "Blueprint" Way (Recommended)

Since we included a `render.yaml` file in the root of the project, Render can configure everything automatically.

### Steps:
1.  **Push your code** to GitHub (ensure `render.yaml` is in the root).
2.  **Log in** to [Render.com](https://render.com).
3.  Click the **"New +"** button and select **"Blueprint"**.
4.  Connect your **Sanjivani-MVP** repository.
5.  Render will detect the `render.yaml` file and show you a configuration screen.
6.  **Environment Variables:** You will be asked to provide values for the secrets defined in `render.yaml`:
    -   `GEMINI_API_KEY`: Your Google Gemini API Key.
    -   `FIREBASE_CREDENTIALS`: Your Firebase JSON content (paste the entire JSON content as a single line string).
    -   `OPENWEATHER_API_KEY`: Your OpenWeatherMap Key.
7.  Click **"Apply"** or **"Create Deploy"**.

Render will now build your Python environment, install dependencies, and start the `uvicorn` server.

---

## 🛠️ Method 2: Manual Setup (Fallback)

If you prefer to configure it manually without the `render.yaml` file:

1.  **New Web Service:** Click **"New +"** > **"Web Service"**.
2.  **Source:** Connect your GitHub Repo.
3.  **Settings:**
    -   **Name:** `sanjivani-backend`
    -   **Root Directory:** `backend` (Important!)
    -   **Runtime:** `Python 3`
    -   **Build Command:** `pip install -r requirements.txt`
    -   **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 10000`
4.  **Environment Variables:** Manually add the keys listed above.
5.  **Deploy.**

---

## 🔗 Final Step: Connect to Frontend

1.  Once deployed, Render will give you a URL (e.g., `https://sanjivani-backend.onrender.com`).
2.  Go to your **Cloudflare Pages** (Frontend) settings.
3.  Update the `NEXT_PUBLIC_API_URL` environment variable to this new Render URL.
4.  **Redeploy** the Frontend.

Your full stack application is now live! 🌍

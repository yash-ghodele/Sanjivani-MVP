# ☁️ Deploying Sanjivani 2.0 to Cloudflare Pages

> **IMPORTANT:** Cloudflare Pages is excellent for hosting the **Frontend** (Next.js). However, it **does not support** the Python/FastAPI Backend. You will need to host the backend separately (e.g., on Railway, Render, or a VPS).

---

## 🏗️ Architecture Overview

1.  **Frontend (Next.js):** Hosted on **Cloudflare Pages**.
2.  **Backend (FastAPI):** Hosted on **Railway/Render/VPS**.
3.  **Database:** Firebase (Managed).

---

## 🚀 Step 1: Deploy Frontend to Cloudflare Pages

### Prerequisites
- A Cloudflare account.
- This repository pushed to GitHub.

### configuration
1.  **Log in** to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2.  Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3.  Select the **Sanjivani-MVP** repository.
4.  **Configure the Build:**
    -   **Framework Preset:** `Next.js`
    -   **Build Command:** `npx @cloudflare/next-on-pages@1`
    -   **Build Output Directory:** `.vercel/output/static` (standard for next-on-pages) OR `out` (if doing static export).
    -   *Note:* For dynamic features (SSR), we recommend using the `@cloudflare/next-on-pages` adapter.

### Using `@cloudflare/next-on-pages` (Recommended)
To support SSR (Server Side Rendering) on Cloudflare, you need to add the adapter:

1.  Run this in your local terminal:
    ```bash
    npm install --save-dev @cloudflare/next-on-pages
    ```
2.  Update `frontend/package.json` scripts:
    ```json
    "pages:build": "npx @cloudflare/next-on-pages"
    ```
3.  Commmit and Push.
4.  In Cloudflare Dashboard, set **Build Command** to: `npm run pages:build`.

### Environment Variables
In Cloudflare Pages Settings > **Environment variables**, add:
- `NEXT_PUBLIC_API_URL`: The URL of your deployed Backend (e.g., `https://sanjivani-api.railway.app`).
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase Key.
- ... (Add all other variables from `.env.local`).

---

## 🐍 Step 2: Deploy Backend (Required)

Since Cloudflare blocks Python backends, deploy the `backend/` folder to **Render** or **Railway**.

### Option A: Render (Free Tier available)
1.  Create a **Web Service**.
2.  Connect Repo.
3.  **Root Directory:** `backend`
4.  **Build Command:** `pip install -r requirements.txt`
5.  **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 10000`
6.  **Environment Variables:** Add `GEMINI_API_KEY`, `FIREBASE_CREDENTIALS` (as JSON string), etc.

### Option B: Railway
1.  New Project > Deploy from GitHub.
2.  Set **Root Directory** to `backend`.
3.  Railway automatically detects Python `requirements.txt`.
4.  Set Variables.

---

## 🔗 Step 3: Connect Them

1.  Copy the **Backend URL** (e.g., `https://web-service.onrender.com`).
2.  Go back to Cloudflare Pages > Settings.
3.  Update `NEXT_PUBLIC_API_URL` to point to this Backend URL.
4.  **Redeploy** the Frontend.

✅ **Done!** Your Sanjivani 2.0 app is now globally distributed.

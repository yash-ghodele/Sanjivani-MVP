# Project Analysis Report: SANJIVANI 2.0

## 1. Executive Summary
Sanjivani 2.0 is an AI-powered crop disease detection platform designed with a focus on production-grade architecture. Unlike typical demo projects, it features a robust separation of concerns between the AI inference layer, business logic, API, and frontend. The project targets 3 major crops (Tomato, Potato, Rice) and 10 diseases, aiming for <100ms inference latency.


## 2. Key Features

### 🤖 Advanced AI Engine
- **Multi-Crop Support**: Detects diseases in **Tomato, Potato, and Rice**.
- **High Performance**: Optimized MobileNetV2 architecture delivering **<100ms inference latency**.
- **Edge-Ready**: Model pipeline supports export to `.h5` (server) and `.tflite` (mobile/edge devices).

### 🛡️ Production-Grade Backend
- **Deterministic Knowledge Base**: Unlike pure LLMs, advice is rule-based and strictly mapped to disease labels, ensuring consistent and safe agricultural recommendations.
- **Structured API (v2)**: Fully differentiated "Treatment" (Immediate) vs "Prevention" (Long-term) logic.
- **Response Metadata**: Every API response includes model version, inference time, and request ID for observability.

### 💻 Modern Frontend Experience
- **Glassmorphism UI**: High-end aesthetic with dark mode and transparency effects.
- **Smart Feedback**: Users can validate predictions, creating a data flywheel for future improvements.
- **Weather Integration**: Context-aware insights using OpenWeatherMap API (optional configuration).

## 3. Usage & Quick Start

### Prerequisites
- **Python**: 3.11+
- **Node.js**: 18+ (20+ recommended)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI server (runs on `http://localhost:8000`):
   ```bash
   python main.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Start the Development Server (runs on `http://localhost:3000`):
   ```bash
   npm run dev
   ```

### How to Use
1. Open the web application at `http://localhost:3000`.
2. Click **"Upload Image"** or drag-and-drop a leaf image.
3. The system will process the image through the AI engine (`/api/v2/predict`).
4. View the **Analysis Report**, which includes:
   - **Disease Name** & Confidence Score.
   - **Immediate Actions**: Spray/Treatment steps.
   - **Preventive Measures**: Long-term care advice.

## 4. Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI (Radix Primitives), Lucide Icons
- **State/Data**: Firebase Integration
- **Key Libraries**: `browser-image-compression` for optimizing uploads.

### Backend
- **Framework**: FastAPI (Python)
- **AI/ML**: TensorFlow 2.13+, OpenCV, MobileNetV2 (Transfer Learning)
- **Validation**: Pydantic v2
- **Database**: Firebase Firestore
- **LLM Integration**: Google Generative AI (Gemini)
- **External APIs**: OpenWeatherMap

### DevOps & Tools
- **Containerization**: Docker & Docker Compose
- **Testing**: Pytest (Backend), Jest/React Testing Library (Frontend)
- **Linting**: ESLint

## 5. Architecture Overview
The system follows a clean architecture pattern:
- **Frontend (Next.js)**: Handles UI, user interaction, and communicates with the backend via REST API.
- **API Layer (FastAPI)**: Serves as the gateway, strictly separating concerns. It exposes V2 endpoints for prediction, metadata, alerts, and feedback.
- **AI Layer**: Encapsulated inference engine using MobileNetV2. Supports both `.h5` (server) and `.tflite` (planned edge).
- **Knowledge Layer**: Deterministic logic mapping predictions to treatments and preventive measures, ensuring reliable advice unlike pure LLM responses.
- **Data Layer**: Firestore for storing scan history and feedback.

## 6. Key Components Analysis

### Backend (`backend/`)
- `main.py`: Entry point. Well-structured with CORS, GZip middleware, and organized router includes (`api.v2`).
- `api/v2/`: Modular API structure.
    - `predict.py`: Core inference endpoint.
    - `weather.py`, `ai_analysis.py`: Auxiliary services.
- `ai/`: specialized inference engine logic.
- `knowledge/`: "Knowledge Engine" that likely maps class labels to rich text descriptions and advice.
- **Observations**: The backend explicitly mentions "Portfolio-First Engineering" and "Production-Ready APIs", visible in the versioning and structured responses.

### Frontend (`frontend/`)
- `app/`: Uses Next.js App Router structure.
- `components/`: Component-based UI compatible with Shadcn/Radix.
- `services/`: Likely contains API client wrappers to communicate with the Python backend.

## 7. Status & Code Quality
- **Documentation**: Excellent. The `README.md` is comprehensive, and `docs/` folder suggests further detailed documentation.
- **Code Structure**: High quality. Explicit typing (TypeScript/Pydantic), separation of concerns, and modular design.
- **Testing**: Backend has `tests/` folder with `pytest`. Frontend has `jest` config.

## 8. Recommendations
- **Environment Setup**: Ensure `.env` files are correctly populated based on `.env.example`.
- **Dependency Management**: Monitor `requirements.txt` and `package.json` for updates, especially with `next: "latest"`.
- **Deployment**: The structure supports split deployment (Frontend to Vercel/Netlify, Backend to Render/AWS) as noted in the README.

## 9. Conclusion
Sanjivani 2.0 is a mature, well-architected full-stack AI application. It moves beyond a simple wrapper around a model to a full system with feedback loops, weather integration, and robust API design.

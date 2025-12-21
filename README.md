# CropGuard/SANJIVANI

AI-powered crop disease detection platform for farmers.

## Project Structure

```
CropGuard/
├── frontend/          # React + TypeScript
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Python FastAPI
│   ├── main.py
│   ├── train_model.py
│   ├── requirements.txt
│   └── models/
└── dataset/           # Training data (download separately)
```

## Quick Start

### 1. Frontend (React)

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
# Open http://localhost:5173
```

### 2. Backend (Python API)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run API server
python main.py
# API runs at http://localhost:8000
```

### 3. Train Model (Optional)

```bash
# Download dataset from Kaggle
# https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset

# Train model
python train_model.py
```

## Features

✅ Real-time disease detection via webcam
✅ Image upload support
✅ AI-powered CNN predictions  
✅ Treatment recommendations
✅ Scan history tracking
✅ Mobile-responsive design
✅ Farmer-friendly UI

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide Icons

**Backend:**
- FastAPI
- TensorFlow/Keras
- OpenCV
- Python 3.10+

**ML Model:**
- MobileNetV2 (transfer learning)
- Kaggle Plant Disease Dataset
- 38 disease classes

## API Endpoints

- `POST /predict` - Upload image for disease detection
- `GET /health` - API health check

## Development

See individual READMEs:
- Backend: `backend/README.md`
- Training: `backend/TRAINING.md`

## License

MIT

## Team SANJIVANI - SIH 2024

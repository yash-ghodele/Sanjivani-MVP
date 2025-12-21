# SANJIVANI Backend

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python main.py
```

Or use uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### POST `/predict`
Upload crop image for disease detection

**Request:**
- Content-Type: multipart/form-data
- Body: `file` (image file)

**Response:**
```json
{
  "disease": "Early Blight",
  "confidence": 94.5,
  "severity": "Moderate",
  "treatment": "Apply Chlorothalonil fungicide...",
  "prevention": "Rotate crops, avoid overhead irrigation..."
}
```

### GET `/health`
Check API health status

## Model Setup

Place your trained model file at:
```
backend/models/plant_disease_model.h5
```

If no model is found, the API will use mock predictions for testing.

## Training Your Own Model (Optional)

Use the Kaggle Plant Disease Dataset:
https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset

Example training script coming soon in `train_model.py`

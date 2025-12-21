import firebase_admin
from firebase_admin import credentials, firestore
from pathlib import Path
import os
from datetime import datetime

# Global DB client
db = None

def init_db():
    global db
    try:
        # Check for service account key
        cred_path = Path("backend/serviceAccountKey.json")
        
        if cred_path.exists():
            if not firebase_admin._apps:
                cred = credentials.Certificate(str(cred_path))
                firebase_admin.initialize_app(cred)
            
            db = firestore.client()
            print("✅ Firebase initialized successfully!")
        else:
            print("⚠️ serviceAccountKey.json not found in backend/. Using mock DB mode.")
            db = None
            
    except Exception as e:
        print(f"❌ Error initializing Firebase: {e}")
        db = None

def save_scan(data: dict):
    """Save scan result to Firestore"""
    if not db:
        print("Mock DB: Scan saved (simulated)")
        return "mock_id"
    
    try:
        # Add timestamp
        data["timestamp"] = datetime.now()
        
        # Add to 'scans' collection
        update_time, ref = db.collection("scans").add(data)
        print(f"✅ Scan saved to Firestore with ID: {ref.id}")
        return ref.id
        
    except Exception as e:
        print(f"❌ Error saving to Firestore: {e}")
        return None

def get_recent_scans(limit: int = 10):
    """Get recent scans from Firestore"""
    if not db:
        return []
    
    try:
        scans_ref = db.collection("scans").order_by("timestamp", direction=firestore.Query.DESCENDING).limit(limit)
        docs = scans_ref.stream()
        
        return [{**doc.to_dict(), "id": doc.id} for doc in docs]
        
    except Exception as e:
        print(f"❌ Error fetching from Firestore: {e}")
        return []

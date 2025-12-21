import kagglehub
import shutil
import os
from pathlib import Path

def setup_dataset():
    print("⏳ Downloading dataset from Kaggle...")
    # Download latest version
    try:
        cache_path = kagglehub.dataset_download("vipoooool/new-plant-diseases-dataset")
        print(f"✅ Dataset downloaded to cache: {cache_path}")
    except Exception as e:
        print(f"❌ Failed to download dataset: {e}")
        return

    # Define target paths
    # We want valid/train folders inside backend/dataset/PlantVillage
    base_dir = Path(__file__).parent.absolute() # D:/Projects/CropGuard/backend
    target_dir = base_dir / "dataset" / "PlantVillage"
    
    print(f"📂 Target directory: {target_dir}")

    # Create target directory
    if target_dir.exists():
        print("⚠️ Target directory already exists. Clearing it...")
        shutil.rmtree(target_dir)
    target_dir.mkdir(parents=True, exist_ok=True)

    print("🚀 Moving files...")
    
    # Kaggle dataset "vipoooool/new-plant-diseases-dataset" structure is usually:
    # cache_path/
    #   New Plant Diseases Dataset(Augmented)/
    #     New Plant Diseases Dataset(Augmented)/  <-- sometimes nested twice
    #       train/
    #       valid/
    
    source_path = Path(cache_path)
    
    # Try to find 'train' folder to locate the root of the data
    train_dir = None
    for root, dirs, files in os.walk(source_path):
        if "train" in dirs and "valid" in dirs:
            train_dir = Path(root)
            break
            
    if train_dir:
        print(f"Found data root at: {train_dir}")
        # Copy contents of train_dir to target_dir
        shutil.copytree(train_dir / "train", target_dir / "train", dirs_exist_ok=True)
        shutil.copytree(train_dir / "valid", target_dir / "valid", dirs_exist_ok=True)
        print("✅ Dataset successfully setup in 'dataset/PlantVillage'!")
        print("You can now run: python train_model.py")
    else:
        print("❌ Could not locate 'train' and 'valid' folders in the downloaded dataset.")
        print(f"Please manually check: {cache_path}")

if __name__ == "__main__":
    setup_dataset()

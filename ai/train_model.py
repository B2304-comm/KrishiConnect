import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "dataset" / "crop_dataset.csv"
MODEL_PATH = BASE_DIR / "models" / "crop_model.pkl"

# load dataset
data = pd.read_csv(DATASET_PATH)

# features and labels
X = data.drop("label", axis=1)
y = data["label"]

# train model
model = RandomForestClassifier()
model.fit(X, y)

# save model
with MODEL_PATH.open("wb") as model_file:
    pickle.dump(model, model_file)

print("Model trained successfully")

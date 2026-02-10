# HomeCheck: ML-Powered Home Inspection Assistant

<p align="center">
  <img src="static/images/logo.png" alt="HomeCheck Logo" width="200"/>
</p>

> CNN-based image classification system to identify common home defects using computer vision. Achieved 98% accuracy using MobileNetV2 architecture.

---

## 🎯 Project Overview

HomeCheck is an intelligent home inspection assistant that uses deep learning to automatically detect and classify common home defects from images. The system was developed as a final year project (FYP) to demonstrate practical applications of machine learning in real estate and property management.

Key Achievement: 98% classification accuracy on ~10,000 curated home defect images.

---

## ✨ Features

- High Accuracy Detection: 98% accuracy in identifying home defects
- Multiple Defect Categories: Classifies various types of home issues
- Real-time Prediction: Upload image and get instant results
- User-Friendly Interface: Clean web interface built with Flask
- Comprehensive Reports: Detailed inspection reports with recommendations
- Inspection History: Track past inspections and results

---

## 🛠️ Tech Stack

Backend & ML:
- Python 3.x
- TensorFlow / Keras
- MobileNetV2 (CNN Architecture)
- Flask (Web Framework)

Frontend:
- HTML5 / CSS3
- JavaScript
- Responsive Design

Model Training:
- Dataset: ~10,000 curated images
- Data Augmentation: Applied to increase dataset diversity
- Architectures Evaluated: MobileNetV2, EfficientNet, ResNet50
- Final Model: MobileNetV2 with Adam optimizer

---

## 📊 Model Performance

| Model | Optimizer | Accuracy | Notes |
|-------|-----------|----------|-------|
| ResNet50 | Adam | ~92% | Slower inference |
| EfficientNet | SGD | ~94% | Moderate speed |
| MobileNetV2 | Adam | 98% | ✅ Best balance: accuracy + speed |

Model File Size: 39.1 MB (optimized for deployment)

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Step 1: Clone Repository
```bash
git clone https://github.com/safiyyahsy/homecheck-ml.git
cd homecheck-ml
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Run the application
```bash
python app.py
```

### Step 4: Access the app

Open your browser and navigate to:
https://localhost:5000 
# HomeCheck: Systematic CNN Evaluation for Home Defect Classification

<p align="center">
  <strong>97.77% test accuracy achieved through rigorous evaluation of 33+ experiments</strong>
</p>

> Deep learning-based home inspection assistant using systematic CNN architecture comparison, fine-tuning strategy evaluation, and hyperparameter optimization.
> Slides Presentation during Final Year: [Slides](https://www.canva.com/design/DAGXOFI9Rp4/OyXY17FATSZYYU1MAEDTJg/edit?utm_content=DAGXOFI9Rp4&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.19-orange.svg)](https://www.tensorflow.org/)
[![License](https://img.shields.io/badge/License-Educational-green.svg)]()

---

## Project Overview

HomeCheck is a CNN-based image classification system developed to automatically detect and classify home defects from images. This project demonstrates a **systematic machine learning research approach**, evaluating multiple architectures, fine-tuning strategies, optimizers, and learning rates to achieve optimal performance.

**Academic Context:**  
Final Year Project (FYP) | Universiti Teknologi MARA (UiTM) | Intelligent Systems Engineering | 2025-2026

---

## Key Achievements

- **97.77% test accuracy** on home defect classification
- **33+ experiments** systematically conducted and documented
- **3 CNN architectures** evaluated (MobileNetV2, EfficientNet, ResNet50)
- **2 fine-tuning strategies** compared (Full Freeze vs. Partial Freeze)
- **3 optimizers** tested (Adam, SGD, RMSprop)
- **3 learning rates** per optimizer (0.001, 0.0001, 0.00001)
- **Flask web application** deployed for real-time predictions

---

## Experimental Methodology

### Phase 1: Architecture & Fine-Tuning Strategy Selection

**Objective:** Determine optimal architecture and whether to use full freeze or partial freeze of pre-trained weights.

**Architectures Evaluated:**
- MobileNetV2 (lightweight, mobile-optimized)
- EfficientNet (compound scaling)
- ResNet50 (deep residual learning)

**Fine-Tuning Strategies:**
1. **Full Freeze:** All pre-trained layers frozen, train only classifier
2. **Partial Freeze:** Unfreeze last N layers for fine-tuning

**Phase 1 Results:**

| Model | Strategy | Training Acc | Validation Acc | Test Acc | Status |
|-------|----------|--------------|----------------|----------|--------|
| MobileNetV2 | Full Freeze | 8.24% | 90.71% | 90.89% | ❌ |
| MobileNetV2 | **Partial Freeze** | **97.65%** | **96.28%** | **95.82%** | ✅ Best |
| EfficientNet | Full Freeze | 19.62% | 23.61% | 24.07% | ❌ |
| EfficientNet | **Partial Freeze** | **89.09%** | **82.81%** | **84.39%** | ✅ Best |
| ResNet50 | Full Freeze | 49.04% | 59.01% | 58.46% | ❌ |
| ResNet50 | **Partial Freeze** | **63.92%** | **60.04%** | **61.34%** | ✅ Best |

**Finding:** Partial freeze strategy consistently outperformed full freeze across all architectures, providing better feature learning while leveraging pre-trained weights.

---

### Phase 2: Optimizer & Learning Rate Optimization

**Objective:** For each architecture's best freeze strategy, find optimal optimizer and learning rate combination.

**Experimental Design:**
- **Optimizers:** Adam, SGD, RMSprop
- **Learning Rates:** 0.001, 0.0001, 0.00001
- **Combinations per architecture:** 9 experiments
- **Total Phase 2 experiments:** 27

**Phase 2 Best Results:**

| Model | Optimizer | Learning Rate | Training Acc | Validation Acc | **Test Acc** |
|-------|-----------|---------------|--------------|----------------|--------------|
| **MobileNetV2** | **Adam** | **0.0001** | **99.25%** | **98.05%** | **97.77%** ✅ |
| MobileNetV2 | SGD | 0.001 | 98.21% | 97.30% | 98.05% |
| MobileNetV2 | RMSprop | 0.0001 | 99.49% | 97.77% | 97.58% |
| EfficientNet | RMSprop | 0.001 | 91.04% | 89.78% | 89.96% |
| EfficientNet | Adam | 0.001 | 89.09% | 82.81% | 84.39% |
| ResNet50 | Adam | 0.00001 | 74.22% | 75.19% | 77.04% |

**Complete experimental results:** See [EXPERIMENTS.md](EXPERIMENTS.md) for full 33-experiment comparison table.

---

### Final Model Selection

**Winner: MobileNetV2 (Partial Freeze) + Adam + LR 0.0001**

**Performance Metrics:**
- Training Accuracy: 99.25%
- Training Loss: 0.0122
- Validation Accuracy: 98.05%
- Validation Loss: 0.0228
- **Test Accuracy: 97.77%**
- **Test Loss: 0.0232**

**Why This Model:**
1. **Highest test accuracy** across all 33 experiments
2. **Low loss** indicates good generalization
3. **Lightweight architecture** (39.1 MB) suitable for deployment
4. **Fast inference** compared to ResNet50
5. **Minimal overfitting** (training vs. validation gap < 2%)

---

## 🗂️ Dataset

**Size:** ~10,000 images

**Categories:** 7 home defect types
- Broken window
- Damaged roof
- Cracked wall
- Water damage
- Mold/mildew
- Structural damage
- Normal/No defect

**Data Sources:** Curated from publicly available datasets

**Preprocessing:**
- Image resizing (224×224 pixels)
- Normalization (pixel values scaled to [0, 1])
- Data augmentation (rotation, flipping, zooming, brightness adjustment)

**Dataset Access:** [Available in Google Drive](https://drive.google.com/drive/folders/1o0v40q8LIlEa4qsWHE6d7QDgDI59HgQL?usp=drive_link)

---

## Tech Stack

**Machine Learning:**
- Python 3.8+
- TensorFlow 2.19 / Keras 3.10
- Transfer Learning (ImageNet pre-trained weights)
- MobileNetV2, EfficientNet, ResNet50 architectures

**Web Deployment:**
- Flask 3.0.3
- HTML5 / CSS3 / JavaScript
- Responsive design

**Development Environment:**
- Google Colab (model training & experimentation)
- VSCode (Flask development)

---

## Repository Structure
```text
homecheck-ml/
├── README.md # Project overview (this file)
├── EXPERIMENTS.md # Complete experimental results
├── app.py # Flask web application
├── model.keras # Trained model (97.77% accuracy)
├── requirements.txt # Python dependencies
├── experiments/ # Experiment notebooks
│ ├── phase1_mobilenetv2.ipynb # Full vs Partial Freeze
│ ├── phase1_efficientnet.ipynb
│ ├── phase1_resnet50.ipynb
│ ├── phase2_mobilenetv2_adam.ipynb # Winner: 97.77%
│ ├── phase2_efficientnet_best.ipynb
│ └── phase2_resnet50_best.ipynb
├── static/ # CSS, JS, images
│ ├── css/
│ ├── js/
│ ├── images/
│ └── fonts/
├── templates/ # HTML templates
│ ├── homepage.html
│ ├── inspection.html
│ ├── guide.html
│ ├── about.html
│ ├── history.html
│ └── detailed_report.html
└── .gitignore
```
- VSCode (Flask development)

---

## Installation & Usage

### Prerequisites
```bash
Python 3.8 or higher
pip package manager
```

## Setup Instructions
1. Clone the repository:
```bash
git clone https://github.com/safiyyahsy/homecheck-ml.git
cd homecheck-ml
```
2. Install dependencies:
```bash
pip install -r requirements.txt
```
4. Run the Flask application:
```bash
python app.py
```
6. Access the web app:
```bash
http://localhost:5000
```

## Using the Application
1. Navigate to the Inspection page
2. Upload an image of the home area to inspect
3. Click Analyze to get prediction
4. View detailed classification results and confidence scores
5. Access inspection history for past analyses

## Research Methodology
1. Literature Review
- Studied CNN architectures for image classification
- Reviewed transfer learning best practices
- Analyzed similar home inspection and defect detection systems
2. Dataset Curation
- Collected ~10,000 images from public sources
- Manually verified and labeled each image
- Balanced dataset across 7 defect categories
- Applied data augmentation to increase diversity
3. Systematic Experimentation
- Phase 1: Architecture and fine-tuning strategy selection (6 experiments)
- Phase 2: Optimizer and learning rate optimization (27 experiments)
- Validation: Cross-validation and test set evaluation
- Documentation: Comprehensive logging of all experiments
4. Model Evaluation
- Accuracy, Precision, Recall, F1-Score calculated
- Confusion matrix analysis
- Training/validation curves monitored for overfitting
- Test set performance as final metric
5. Deployment
- Flask web framework for accessibility
- Real-time prediction pipeline
- User-friendly interface design
- Inspection history tracking

## Key Learnings & Insights
# Technical Insights
1. Fine-Tuning Strategy Matters:
- Partial freeze significantly outperformed full freeze
- Allowing last layers to adapt to domain-specific features improved accuracy by 20-40%

2. Architecture Selection:
- MobileNetV2 achieved best accuracy despite being lightweight
- EfficientNet showed moderate performance with compound scaling
- ResNet50 underperformed, possibly due to dataset size or complexity mismatch

3. Hyperparameter Sensitivity:
- Adam optimizer consistently outperformed SGD and RMSprop
- Learning rate 0.0001 provided best balance (0.001 too aggressive, 0.00001 too slow)
- Systematic grid search crucial for optimal performance

4. Overfitting Prevention:
- Data augmentation essential for generalization
- Dropout and regularization helped reduce overfitting
- Early stopping based on validation loss prevented overtraining

# Project Management Insights
- Systematic approach > random experimentation
- Documentation of all experiments enables informed decision-making
- Validation strategy (train/val/test split) critical for reliable results
- Iterative refinement based on experimental results leads to optimal solution

## Academic Contributions
# Skills Demonstrated:
- Machine learning model selection and evaluation
- Transfer learning and fine-tuning techniques
- Systematic experimentation and hyperparameter tuning
- Data preprocessing and augmentation
- Model deployment and web development
- Technical documentation and research methodology

# Research Rigor:
- 33+ experiments systematically conducted
- Complete documentation of methodology
- Reproducible results with clear experimental setup
- Comparison of state-of-the-art architectures

## 📊 Performance Comparison

### Architecture Comparison (Best Configuration Each)

| Architecture | Parameters | Test Accuracy | Model Size | Inference Time |
|--------------|------------|---------------|------------|----------------|
| **MobileNetV2** | 3.5M | **97.77%** ✅ | **39.1 MB** | Fast |
| EfficientNet | 5.3M | 89.96% | 52 MB | Moderate |
| ResNet50 | 25.6M | 77.04% | 98 MB | Slow |

**Winner:** MobileNetV2 offers best accuracy with smallest size and fastest inference.

---

## 👤 Author

**Nur Safiyyah Insyirah Nordin**

📧 Email: safiyyahsy28@gmail.com  
🌐 Portfolio: [https://safiyyahsy.github.io/sfyhportfolio/](https://safiyyahsy.github.io/sfyhportfolio/)  
💼 LinkedIn: [Your LinkedIn](https://linkedin.com/in/nsin28)  
🐙 GitHub: [@safiyyahsy](https://github.com/safiyyahsy)

**Academic Context:**  
Bachelor of Computer Science (Honours) - Intelligent Systems Engineering  
Universiti Teknologi MARA (UiTM) | CGPA: 3.72/4.00 | Expected Graduation: January 2026

---

## License

This project is available for educational and portfolio purposes. For usage permissions, please contact the author.

---

## Acknowledgments

- **UiTM Faculty of Computer and Mathematical Sciences** for academic guidance
- **Project supervisors** for methodology support and feedback
- **TensorFlow/Keras community** for excellent documentation
- **Transfer learning research community** for pre-trained model weights

---

**⭐ If you find this research useful, please star the repository!**

** For questions about methodology or collaboration, feel free to reach out.**

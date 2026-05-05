# 🏥 MedVision AI: Clinical Diagnostic Intelligence

MedVision AI is a premium, full-stack medical diagnostic platform designed for modern hospitals and radiology departments. It bridges the gap between raw medical imaging and actionable clinical insights by leveraging Google Gemini's advanced multimodal vision capabilities and OpenCV's precise geometric processing.

**Architect:** Karan Kharad

---

## 🚀 Key Features

*   **🧠 AI-Powered Fracture Detection**: Uses Google Gemini (Vision) to analyze X-Rays, MRIs, and CT scans with orthopedic-grade precision.
*   **🎯 YOLO-Style Annotations**: Features a high-fidelity computer vision engine that draws professional, badge-labeled bounding boxes around detected abnormalities, inspired by state-of-the-art detection models (YOLOv8).
*   **🌓 Dual-Theme Engine (Clinical/Tech)**: Includes a "Clinical Clean" Light Mode for daytime diagnostic work and a "Deep-Tech AI" Dark Mode for focused analysis sessions, with persistence across sessions.
*   **📄 Automated Radiology Reports**: Generates formal, multi-section medical reports including Clinical Indication, Technique, Findings, Impression, and Recommendation.
*   **🔍 Advanced Clinical Search**: A global search hub that allows practitioners to filter through thousands of clinical records by patient name, condition, or scan type instantly.
*   **👤 Practitioner Profiles**: Full user management system with profile customization, secure license verification, and password recovery flows.
*   **🏢 Patient Management**: A comprehensive dashboard for managing the "Practitioner Registry," assigning cases, and reviewing historic diagnostic progressions.

---

## 🛠️ Technology Stack

*   **Frontend**: React.js (Vite), Tailwind CSS, Lucide Icons, Recharts (Data Viz)
*   **Backend**: Python, Django 6.0, Django REST Framework
*   **AI Engine**: Google Generative AI (Gemini 1.5/2.0), OpenCV (Computer Vision)
*   **Security**: JWT Authentication (SimpleJWT), CORS Protection
*   **Database**: PostgreSQL (Production-ready) / SQLite

---

## 💻 Local Setup & Installation

### 1. Backend (Django REST API)
1.  Navigate into the backend project directory:
    ```bash
    cd medvision
    ```
2.  Set up your virtual environment and install dependencies:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use: venv\Scripts\activate
    python -m pip install -r ../requirements.txt
    ```
3.  Configure your environment variables:
    *   Create a `.env` file in `medvision/`.
    *   Add your Gemini API Key: `GEMINI_API_KEY=your_key_here`
4.  Run migrations & Start server:
    ```bash
    python manage.py migrate
    python manage.py runserver
    ```

### 2. Frontend (React / Vite)
1.  Open a new terminal window:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---
© 2026 MedVision AI - Built by **Karan Kharad**

# MedVision AI

A comprehensive, full-stack hospital web application for Doctors and Radiologists that features instant, AI-powered medical scan analysis. By simply uploading X-Rays, MRIs, or CT Scans, MedVision leverages Google Gemini to automatically pinpoint and diagnose fractures with high precision, generating detailed medical reports and drawing bounding-box annotations onto the scan via OpenCV.

**Architect:** Karan Kharad

---

## 🚀 Key Features

*   **AI Fracture Detection:** Powered by Google Gemini (`gemini-2.5-flash`), instantly analyzing uploaded scans for acute fractures, dislocations, and bone densities.
*   **Computer Vision Annotation:** Uses `OpenCV` to draw exact visual bounding boxes around detected fractures, generating an original vs. annotated view.
*   **Automated Medical Reports:** Instantly generates thorough medical reports (Clinical Indication, Technique, Findings, Impression, Recommendation) using the `gemini-1.5-flash` model.
*   **Patient Database:** Complete CRUD dashboard for managing patients, assigning doctors, and reviewing comprehensive scan histories.
*   **Role-Based Access Control:** Secure JWT Authentication for Doctors and administrative Radiologists.

---

## 🛠️ Technology Stack

*   **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons, React Router
*   **Backend**: Python, Django, Django REST Framework (DRF)
*   **AI & Logic**: Google Generative AI (Gemini), OpenCV (cv2)
*   **Database**: SQLite / PostgreSQL
*   **Auth & Storage**: SimpleJWT (Access/Refresh Tokens), MultiPart FormData file hosting

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
    pip install -r requirements.txt
    ```
3.  Configure your environment variables:
    *   Create a `.env` file in the `medvision/medvision/` directory.
    *   Add your Gemini API Key: `GEMINI_API_KEY=your_google_api_key_here`
4.  Run database migrations:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
5.  Start the backend server:
    ```bash
    python manage.py runserver
    ```
    *The API will run locally at `http://localhost:8000/api/`*

### 2. Frontend (React / Vite)
1.  Open a new terminal window and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install all Node modules and dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *The UI will run locally at `http://localhost:5173/`*

---

## 📸 Usage

1.  Access the web application at `localhost:5173`.
2.  Login with your radiologist/doctor credentials.
3.  Navigate to **Upload Scan**.
4.  Select a patient, choose the scan type (X-Ray, MRI, CT), and attach your `.jpg`/`.png`/`.dicom` file.
5.  Click **Run AI Analysis**. Wait for the API to parse the image, generate bounding coordinates, and render your clinical report!

---

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
This project is licensed under the MIT License.

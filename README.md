
# **Job Portal Application**

A modern **Job Portal** application built with **React, TypeScript, Redux, Supabase, and FastAPI**. It enables **users to find and apply for jobs**, **recruiters to post job listings**, and includes **AI-powered job recommendations**.

## **🛠️ Tech Stack**

### **Frontend:**

-   **React** – UI Library
-   **TypeScript** – Type Safety
-   **Vite** – Fast Development Build Tool
-   **Redux Toolkit** – State Management
-   **Material UI (MUI)** – UI Components
-   **Framer Motion** – Animations

### **Backend:**

-   **FastAPI** – Python Backend
-   **Supabase** – Database, Storage, and Auth
-   **Hugging Face NLP Models** – AI-powered Resume Generation
-   **Scikit-learn** – AI-based Job Recommendation System

----------

## **📌 Features Implemented**

### **🔹 User Features:**

✅ **Sign Up / Log In** (via Supabase Auth)  
✅ **Apply for Jobs** (applications stored in Supabase)  
✅ **AI-powered Job Recommendations** (based on user skills)  
✅ **Track Applied Jobs**

### **🔹 Recruiter Features:**

✅ **Create Job Listings**  
✅ **Delete Job Listings**

### **🔹 AI Features:**

✅ **AI-Based Job Recommendation System** (Finds best jobs based on skills)  

----------

## **🚀 Getting Started**

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/aman75way/Final-Assessment.git
cd Final-Assessment

```

### **2️⃣ Install Dependencies**

```bash
pnpm install

```

### **3️⃣ Start the Development Server**

```bash
pnpm run dev

```

✅ The app should now be running at **`http://localhost:5173/`** 🎉

----------

## **📂 Project Structure**

```
📦 src
 ┣ 📂 components       # Reusable UI Components
 ┣ 📂 pages            # Application Pages (Recruiter, User, etc.)
 ┣ 📂 store            # Redux Store & Slices
 ┣ 📂 utils            # Helper Functions
 ┣ 📜 App.tsx          # Main Application Component
 ┣ 📜 main.tsx         # React Entry Point
 ┣ 📜 vite.config.ts   # Vite Configuration

```

### **Backend (FastAPI) Structure**

```
📦 backend
 ┣ 📜 main.py            # FastAPI Entry Point
 ┣ 📜 job_recommendation.py  # AI Job Recommendation System
 ┣ 📜 resume_generator.py    # AI Resume Generator
 ┣ 📜 requirements.txt   # Dependencies

```

----------

## **🔄 State Management (Redux Toolkit)**

-   **Jobs & Applications** are stored in **Supabase**.
-   **User Authentication** is handled via **Supabase Auth**.

----------

## **🌟 How to Use**

### **👤 For Users:**

1.  **Sign Up / Log In**
2.  **Browse and Apply for Jobs**

### **Future Enhancements:**
1.  **Track Application Status**
2.  **AI Powered Resume**

### **🧑‍💼 For Recruiters:**

1.  **Log in as a Recruiter**
2.  **Create Job Listings**
3.  **Delete Job Listings**


----------

## **🔧 Backend Setup (FastAPI)**

### **1️⃣ Create a Python Virtual Environment**

```bash
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate  # Windows

```

### **2️⃣ Install Dependencies**

```bash
pip install -r requirements.txt

```

### **3️⃣ Start FastAPI Server**

```bash
uvicorn recommend:app --reload

```

✅ FastAPI will run at **`http://localhost:8000/`** 🚀

----------

## **🔧 Build & Deployment**

### **⚡ Build for Production**

```bash
pnpm run build

```

### **💻 Dev for Production**

```bash
pnpm run dev
```

### **🌍 Preview Build**

```bash
pnpm run preview

```

### **🚀 Future Improvements**

-   **Email Functionality** (Notify candidates about selection/rejection)
-   **Improved AI Matching** (Better skill-based job recommendations)
-   **Enhanced Resume Templates** (Customizable ATS-friendly layouts)

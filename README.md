# **Job Board Frontend**

A modern **Job Board** application built with **React, TypeScript, Vite, Redux, and Framer Motion**. It allows **users to apply for jobs** and **recruiters to post job listings**, all managed via **localStorage/sessionStorage**.

## **🛠️ Tech Stack**

-   **React** – UI Library
-   **TypeScript** – Type Safety
-   **Vite** – Fast Development Build Tool
-   **Redux Toolkit** – State Management
-   **Material UI (MUI)** – UI Components
-   **Framer Motion** – Animations
-   **Session Storage / Local Storage** – Data Persistence

----------

## **📌 Features Implemented**

### **🔹 User Features:**

✅ **Sign Up / Log In** (stored in sessionStorage)  
✅ **Apply for jobs** (applications stored in Redux/localStorage)  
✅ **Upload Resume** (stored in localStorage)  
✅ **Track Applied Jobs** (with status updates)

### **🔹 Recruiter Features:**

✅ **Create Job Listings** (stored in Redux/localStorage)  
✅ **View and manage job applications**  
✅ **Accept / Reject applications** (updates reflected in Redux/localStorage)  
✅ **Delete job listings**

### **🔹 Additional Features:**

✅ **Glassmorphism UI** for a modern look  
✅ **Framer Motion animations** for smooth interactions  
✅ **Dark Theme & Responsive UI**  
✅ **STORAGE Persistence via `SUPABASE`**

----------

## **🚀 Getting Started**

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/aman75way/Job-Portal-Full-Implmentation-FrontEnd
cd <directory>

```

### **2️⃣ Install Dependencies**

```bash
npm install

```

### **3️⃣ Start the Development Server**

```bash
npm run dev

```

✅ The app should now be running at **`http://localhost:5173/`** 🎉

----------

## **📂 Project Structure**

```
📦 src
 ┣ 📂 components       # Reusable UI Components
 ┣ 📂 pages            # App Pages (Recruiter, User, etc.)
 ┣ 📂 store            # Redux Store & Slices
 ┣ 📂 utils            # Helper Functions
 ┣ 📜 App.tsx          # Main Application Component
 ┣ 📜 main.tsx         # React Entry Point
 ┣ 📜 vite.config.ts   # Vite Configuration

```

----------

## **🔄 State Management (Redux Toolkit)**

-   **Jobs** are stored in **localStorage**.
-   **Applications & Users** are managed in **sessionStorage**.
-   **Redux persist ensures state persistence.**

----------

## **🌟 How to Use**

### **👤 For Users:**

1.  **Sign Up / Log In**
2.  **Browse available jobs**
3.  **Apply for a job & upload resume**
4.  **Track application status**

### **🧑‍💼 For Recruiters:**

1.  **Log in as a Recruiter**
2.  **Create job listings**
3.  **View received applications**
4.  **Accept / Reject applicants**
5.  **Delete job listings**

----------

## **🔧 Build & Deployment**

### **⚡ Build for Production**

```bash
npm run build

```

### **🌍 Preview Build**

```bash
npm run preview

```

## To Implement

- Email Functionality on Selection for Interview
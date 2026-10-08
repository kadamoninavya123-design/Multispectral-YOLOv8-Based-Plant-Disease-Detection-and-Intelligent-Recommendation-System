# 🌱 Multispectral YOLOv8-Based Plant Disease Detection and Intelligent Recommendation System

## 📌 Project Overview

An AI-powered plant disease detection system that uses **YOLOv8** and computer vision to identify plant diseases from uploaded leaf images. The system provides disease predictions, confidence scores, prediction history, and intelligent recommendations to help users understand and manage detected plant diseases.

## 🎯 Problem Statement

Plant diseases can significantly affect crop productivity. Traditional disease identification often depends on manual inspection and expert knowledge, which can be time-consuming and difficult for farmers.

This project aims to provide an automated and user-friendly solution for detecting plant diseases from plant images.

## 💡 Proposed Solution

The system uses a **YOLOv8 deep learning model** to analyze uploaded plant images and identify possible diseases.

The application includes:

- 🌿 Plant disease detection
- 📊 Prediction confidence scores
- 🤖 AI-based recommendations
- 🔐 User authentication
- 📜 Prediction history
- 🖥️ Web-based user interface

## ✨ Key Features

- Upload plant leaf images for disease detection
- YOLOv8-based image prediction
- Display detected disease and confidence score
- Store prediction history
- User registration and login
- Protected application pages
- AI-generated disease recommendations
- Responsive React-based interface

## 🛠️ Technologies Used

### Frontend
- React.js
- HTML
- CSS
- JavaScript
- Vite

### Backend
- Python
- Flask
- REST APIs

### Machine Learning
- YOLOv8
- Computer Vision
- Deep Learning

### Database & Services
- Supabase
- Groq API

### Development Tools
- Git
- GitHub
- VS Code

## 📂 Project Structure

```text
Multispectral-YOLOv8-Based-Plant-Disease-Detection-and-Intelligent-Recommendation-System/
│
├── Application/
│   ├── backend/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.py
│   │   ├── config.py
│   │   ├── middleware.py
│   │   └── requirements.txt
│   │
│   ├── frontend/
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   ├── model_training_code/
│   │   └── YOLO_model_training.ipynb
│   │
│   └── supabase_setup.sql
│
├── .gitignore
└── README.md
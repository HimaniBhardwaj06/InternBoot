# 📚 Library Management System

A **console-based Library Management System** developed using **Python** and **MySQL**. This application enables administrators to efficiently manage library books while allowing users to register, search, borrow, and return books through an interactive command-line interface.

---

## 🚀 Features

### 👨‍💼 Admin Module
- Admin Login
- Add New Books
- View All Books
- View Book Details
- Update Book Details
- Delete Books
- Search Books
- Generate Library Reports

### 👤 User Module
- User Registration
- User Login
- View Available Books
- View Book Details
- Search Books
- Borrow Books
- Return Books

### 📊 Additional Features
- MySQL Database Integration
- Automatic Due Date Generation
- Fine Calculation for Late Returns
- Duplicate Email Validation
- Duplicate Borrow Prevention
- Password Validation
- Phone Number Validation
- Professional Console-Based Interface

---

## 🛠️ Tech Stack

- Python 3
- MySQL
- mysql-connector-python

---

## 📂 Project Structure

```text
Library Management System/
│
├── database/
│   └── library_db.sql
│
├── docs/
│
├── screenshots/
│
├── src/
│   ├── admin/
│   ├── auth/
│   ├── utils/
│   └── main.py
│
├── README.md
├── requirements.txt
└── .gitignore
```

---

## 🗄️ Database Tables

- users
- books
- borrow_records

---

## ▶️ How to Run

### 1. Clone the Repository

```bash
git clone <repository-link>
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Import the Database

Import the `library_db.sql` file into MySQL.

### 4. Run the Project

```bash
python3 main.py
```

---

## 📷 Screenshots

Project screenshots are available in the **screenshots** folder.

---

## 👩‍💻 Developer

**Himani Bhardwaj**

**InternBoot Python Internship Project**

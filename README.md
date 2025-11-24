# 🚀 Freelancer–Client Marketplace (Microservices + React)

A complete marketplace system where **Clients** can create projects, find matching **Freelancers**, assign work, and freelancers can manage their assigned projects.

This system is built using:

- **Spring Boot Microservices**
- **JWT Authentication**
- **MySQL Databases**
- **React (Vite) Frontend**
- **REST Communication Between Microservices**

---

## 📌 Project Structure

```
freelancer-client-marketplace/
│
├── auth-service/           # Authentication (JWT + Security)
├── project-service/        # Projects, Matching, Assignments
├── freelancer-service/     # Freelancer profiles & skills
├── Freelancer-app/         # React frontend (Vite)
│
└── README.md
```

---

## 🧩 Microservices Overview

### 🔐 Auth Service
Handles:
- User Registration (Client / Freelancer)
- Login & JWT Token Generation
- Authentication & Authorization

Key features:
- Spring Security  
- BCrypt Password Encoding  
- JWT Filter & Helper  

---

### 📁 Project Service
Handles:
- Project creation  
- Matching freelancers by skill  
- Assigning freelancer to a project  
- Project Status management  

Match formula:
```
matchScore = matchedSkills / totalRequiredSkills
```

---

### 👨‍💼 Freelancer Service
Handles:
- Freelancer Profile  
- Skills & Ratings  
- Fetch freelancers by skill  
- Supports project matching  

---

### 💻 Frontend (React + Vite)
Includes:
- Login Page  
- Client Dashboard  
- Create Project  
- View Projects  
- Match Freelancers  
- Assign Freelancer  
- Freelancer Dashboard  
- Add Skills  
- Assigned Projects  

---

## ⚙️ Tech Stack

### Backend
- Spring Boot  
- Spring Security  
- JWT Auth  
- Spring Data JPA  
- MySQL  
- RestTemplate (microservices communication)  

### Frontend
- React (Vite)  
- React Router  
- Axios  
- Tailwind/CSS  

---

## 🛠️ How to Run the Project

### 1️⃣ Start Auth Service
```
cd auth-service
mvn spring-boot:run
```

### 2️⃣ Start Project Service
```
cd project-service
mvn spring-boot:run
```

### 3️⃣ Start Freelancer Service
```
cd freelancer-service
mvn spring-boot:run
```

### 4️⃣ Start Frontend (Vite React App)
```
cd Freelancer-app
npm install
npm run dev
```

Open:
```
http://localhost:5173
```

---

## 🔗 Main API Endpoints

### Auth Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login & get JWT |

---

### Project Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/projects` | Create project |
| GET | `/projects/{id}/matches` | Recommended freelancers |
| POST | `/projects/{id}/assign` | Assign freelancer |

---

### Freelancer Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/freelancers` | Create profile |
| POST | `/freelancers/skills` | Add freelancer skills |
| GET | `/freelancers/skill/{skill}` | Fetch freelancers by skill |

---

## 🎥 Project Video

Watch the full project walkthrough here:

🔗 **https://drive.google.com/file/d/16ljF-AGPlUGRC75VjSer6AnIRStn8tDG/view?usp=drive_link**

---

## 👨‍💻 Author  
**Rajshi Parmar**  
Freelancer–Client Marketplace Assignment (Spring Boot Microservices + React)


## Team Task Manager

A full-stack web app to manage projects and tasks with role-based access.

Live Demo
- Frontend: https://taskmanager-beta-azure.vercel.app
- Backend: https://taskmanager-feo0.onrender.com

 GitHub Repo
https://github.com/b1tveras/taskmanager
 Features
- Signup and Login with JWT authentication
- Create and manage projects
- Create, assign, and track tasks
- Role-based access (Admin/Member)
- Dashboard with task status and overdue tracking

 Tech Stack
Frontend: React, Vite, Tailwind CSS, Axios  
Backend:** Spring Boot, Java 17, PostgreSQL  
Deployment:** Vercel (frontend), Render (backend)

How to Run Locally
 Backend--
```bash
cd backend
mvn clean package
java -jar target/*.jar
```

Frontend-
```bash
cd frontend
npm install
npm run dev
```

 API Endpoints-
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/projects
- POST /api/projects
- POST /api/projects/{id}/tasks
- PUT /api/tasks/{id}
- DELETE /api/tasks/{id}

## Database
PostgreSQL with Spring JPA (auto schema creation)

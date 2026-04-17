# Student Task & Deadline Manager 🎓

I built this project to solve a problem every student faces: staying on top of multiple courses and their ever-shifting deadlines. This is a full-stack web application that helps you organize your semester into clear, manageable tasks so you can focus on actually studying instead of worrying about when things are due.

## Screenshots 📸

````carousel
![Login Page](file:///C:/Users/md232/.gemini/antigravity/brain/5875e37d-cb1c-4d42-84c0-7f8fdc0ed0dd/login_page_clean_1776391675353.png)
<!-- slide -->
![Register Page](file:///C:/Users/md232/.gemini/antigravity/brain/5875e37d-cb1c-4d42-84c0-7f8fdc0ed0dd/register_page_clean_1776391681602.png)
<!-- slide -->
![Dashboard](file:///C:/Users/md232/.gemini/antigravity/brain/5875e37d-cb1c-4d42-84c0-7f8fdc0ed0dd/dashboard_page_clean_with_course_1776391886180.png)
<!-- slide -->
![Tasks List](file:///C:/Users/md232/.gemini/antigravity/brain/5875e37d-cb1c-4d42-84c0-7f8fdc0ed0dd/tasks_list_clean_1776392038308.png)
````

## Demo 🎥

Check out the full workflow in action: [View Demo Recording](file:///C:/Users/md232/.gemini/antigravity/brain/5875e37d-cb1c-4d42-84c0-7f8fdc0ed0dd/readme_screenshots_1776391657773.webp)

## Features 🚀
- **Personalized Accounts**: Secure authentication to keep your academic data private.
- **Dynamic Dashboard**: A bird's-eye view of your total, pending, and completed tasks.
- **Course Management**: Organized sections for each of your subjects.
- **Smart Task Tracking**: Detailed task list with due dates and progress toggles.
- **Responsive Design**: Works perfectly whether you're studying on a laptop or checking on your phone.

## Tech Stack 🛠️

- **Frontend**: React (Vite) + Tailwind CSS 4.0
- **Backend**: Node.js + Express
- **Database**: MySQL (PlanetScale/Render managed)
- **Auth**: JWT (JSON Web Tokens) with Bcrypt password hashing
- **Global State**: React Context API

## How to Run it Locally

### 1. Prerequisite
Make sure you have **Node.js** and **MySQL** installed on your computer.

### 2. Setup the Database
Run this SQL command in your MySQL terminal to create the tables:
```sql
CREATE DATABASE student_manager;
USE student_manager;

-- You'll need tables for users, courses, and tasks. 
-- I've included the schema logic in the backend models.
```

### 3. Clone and Install
```bash
# Clone the repository
git clone https://github.com/shamshad0003/Student-Task-Deadline-Manager.git

# Go into the project
cd Student-Task-Deadline-Manager

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Set Environment Variables
Create a `.env` file in the **backend** folder:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=student_manager
JWT_SECRET=pick_a_random_string
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file in the **frontend** folder:
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Start the App
Run this in the **backend** folder:
```bash
npm start
```
Run this in the **frontend** folder:
```bash
npm run dev
```

## API Overview
The backend provides a REST API that the frontend talks to.
- `/api/auth`: Handles registration and login.
- `/api/courses`: CRUD operations for your courses.
- `/api/tasks`: Manage tasks and get progress statistics.

## Deployment
I've deployed the full app so it can be used anywhere:
- **Frontend**: Hosted on [Vercel](https://student-task-deadline-manager.vercel.app)
- **Backend API**: Hosted on [Render](https://student-task-deadline-manager.onrender.com)

## Future Improvements
- [ ] **Dark Mode**: For late-night study sessions.
- [ ] **Search Bar**: Quickly find specific tasks or courses.
- [ ] **Email Reminders**: Get an alert 24 hours before a deadline.
- [ ] **File Uploads**: Attach syllabus or lecture notes to courses.

## Author
**Shamshad**
Student & Aspiring Developer

# Agent Distributor - MERN Stack Application

## **Project Overview**

Agent Distributor is a web application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) that allows an admin to manage agents and distribute leads through CSV or Excel files. The app provides features such as:  

- Admin login and authentication using JWT  
- Agent creation and management  
- Uploading leads in CSV/Excel format  
- Automatic distribution of leads among agents  
- Viewing assigned leads  

---

## **Features**

1. **Admin Login**  
   - Secure login using email and password  
   - JWT authentication for protected routes  

2. **Agent Management**  
   - Add new agents with name, email, mobile number, and password  
   - Display all registered agents  

3. **Lead Upload and Distribution**  
   - Upload CSV/XLS/XLSX files containing leads  
   - Automatically distribute leads among registered agents  
   - View assigned leads per agent
  
---
## Screenshots

### Login Page
![Login Page](https://github.com/SudipMandal732122/mern-agent-distributor-/blob/main/Screenshot%20(Login).png)

### Dashboard Page
![Dashboard Page](https://github.com/SudipMandal732122/mern-agent-distributor-/blob/main/Screenshot%20(dashboard1).png)

### Add Agent Page
![Add Agent Page](https://github.com/SudipMandal732122/mern-agent-distributor-/blob/main/Screenshot%20(dashboard2).png)

### Upload Lists Page
![Upload Lists Page 1](https://github.com/SudipMandal732122/mern-agent-distributor-/blob/main/Screenshot%20(dashboard3).png)
![Upload Lists Page 2](https://github.com/SudipMandal732122/mern-agent-distributor-/blob/main/Screenshot%20(dashboard4).png)

---

## **Folder Structure**
```bash
mern-agent-distributer/
│
├─ backend/
│ ├─ package.json
│ ├─ server.js
│ ├─ config/
│ │ └─ db.js
│ ├─ models/
│ │ ├─ User.js
│ │ ├─ Agent.js
│ │ └─ AssignedList.js
│ ├─ routes/
│ │ ├─ auth.js
│ │ ├─ agents.js
│ │ └─ upload.js
│ ├─ middleware/
│ │ └─ authMiddleware.js
│ └─ .env
│
├─ frontend/
│ ├─ package.json
│ ├─ src/
│ │ ├─ main.jsx
│ │ ├─ App.jsx
│ │ ├─ api.js
│ │ ├─ styles.css
│ │ └─ components/
│ │ ├─ Login.jsx
│ │ ├─ Dashboard.jsx
│ │ ├─ AddAgent.jsx
│ │ └─ UploadLists.jsx
│ └─ .env
└─ README.md
```
---

## **Setup Instructions**

### **1. Backend Setup**

1. Navigate to the backend folder:

```bash
cd backend

2. Install dependencies:

npm install
```
3. Create a .env file in the backend folder with the following content:

PORT=5000
MONGO_URI=mongodb://localhost:27017/agent_distributor
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=adminpassword

4. Start the backend server:
```bash
npm run dev
```
You should see:
Server running on port 5000
MongoDB connected
Bootstrap admin created: admin@example.com

### 2. Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend

2. Install dependencies:

npm install
```
3. Create a .env file in the frontend folder with:

VITE_API_URL=http://localhost:5000/api

4. Start the frontend:
```bash
npm run dev
```
Open your browser at the URL shown (usually http://localhost:5173).

3. Admin Login

Default credentials (from .env):

Email: admin@example.com
Password: adminpassword

After login, you can:

-Add agents

-Upload leads

-View assigned leads

Uploading Leads:

1. Prepare a .csv or .xlsx file with columns like firstName, phone, notes.

2. Upload it via Upload Lists on the dashboard.

3. Leads are distributed among registered agents automatically.

Note: At least 5 agents are required for distribution.

## 3. Database

MongoDB collections:

users
agents
assignedlists

-You can manage data using MongoDB Compass or the Mongo shell.

## Styling & UI :

-Frontend is built with React and can be enhanced with Bootstrap.

-The login and dashboard pages include responsive forms and cards.

Demo Video:

-Include a working video link hosted on Google Drive:


## Technologies Used :

Frontend: React, Vite, Axios, React Router, CSS

Backend: Node.js, Express.js, JWT

Database: MongoDB

Others: CSV/XLS file handling



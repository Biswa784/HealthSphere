# 🏥 HealthSpear - OPD Booking System

HealthSpear is a full-stack MERN (MongoDB, Express, React, Node.js) web application for booking and managing Outpatient Department (OPD) appointments in a healthcare facility. The system enables patients to book appointments, upload documents, and interact with doctors in real-time. It also includes dashboards for doctors and admins.

---

## 📌 Features

### 🧑‍⚕️ For Patients
- Register and log in
- Select department and see available doctors
- Book appointments with file uploads (PDFs/images)
- Real-time appointment status updates
- View confirmed/cancelled/completed appointments
- Bed allocation support

### 🩺 For Doctors
- Login and access the **Doctor Dashboard**
- Set availability status (available/unavailable)
- View patient appointments
- Add notes after consultation

### 🧑‍💼 For Super Admin
- Dashboard with charts (appointments, blood, beds)
- Approve/cancel patient OPD bookings
- View doctor/patient statistics
- Blood management (donation & purchase)
- Bed monitoring system

---

## 💻 Tech Stack

| Layer       | Technology             |
|-------------|------------------------|
| Frontend    | React.js, Tailwind CSS |
| Backend     | Node.js, Express.js    |
| Database    | MongoDB                |
| Charts      | Chart.js               |
| Animations  | Lottie |
| Icons       | Lucide React           |
| Auth        | JWT, bcryptjs          |

---

## 🗃️ Folder Structure

/frontend
/src
/components
/pages
/utils
App.jsx
index.js

/backend
/controllers
/models
/routes
/middleware
server.js


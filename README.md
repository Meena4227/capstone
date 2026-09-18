# 🩺 TeleCare - Telemedicine Platform with Doctor Dashboard

A modern, full-stack Telemedicine Consultation Platform featuring a **React (Vite)** single-page application and a **Spring Boot 3 (Java 21)** REST API backend with an in-memory **H2 Database**.

Built directly from the platform's architectural specifications, UI prototypes, and ER Diagram.

---

## 📑 Table of Contents
1. [System Architecture & ER Diagram](#-system-architecture--er-diagram)
2. [Prerequisites](#-prerequisites)
3. [Quick Start Guide](#-quick-start-guide)
4. [Step-by-Step Backend Setup](#-step-by-step-backend-setup)
5. [Step-by-Step Database Setup](#-step-by-step-database-setup)
6. [Step-by-Step Frontend Setup](#-step-by-step-frontend-setup)
7. [Demo Accounts & Credentials](#-demo-accounts--credentials)
8. [End-to-End User Workflows](#-end-to-end-user-workflows)
9. [REST API Reference](#-rest-api-reference)
10. [Project Directory Structure](#-project-directory-structure)

---

## 🏛 System Architecture & ER Diagram

The platform realizes the complete entity model specified in `ER Diagram.png`:

```
+------------------+         +------------------+         +------------------+
|     PATIENT      | 1 --- N |   APPOINTMENT    | N --- 1 |      DOCTOR      |
+------------------+         +------------------+         +------------------+
       | 1                           | 1                          | N
       |                             |                            |
       | N                           | 1                          | M
+------------------+         +------------------+         +------------------+
|  MEDICAL_RECORD  |         |   CONSULTATION   |         |    DEPARTMENT    |
+------------------+         +------------------+         +------------------+
                                     | 1
                                     |
                                     | N
                             +------------------+
                             |   PRESCRIPTION   |
                             +------------------+
```

### Supported Entities:
1. **Patient**: Personal details, credentials, address, blood group, and health vitals (weight, heart rate, temperature).
2. **Doctor**: Medical license, specialization, qualifications, experience, rating, consultation fees, availability, avatar.
3. **Department**: Specialties (General Medicine, Cardiology, Dermatology, Neurology, Pediatrics).
4. **Appointment**: Patient-doctor scheduling, consultation mode (Video/Audio), date, time slot, fee, status (`CONFIRMED`, `WAITING`, `COMPLETED`, `CANCELLED`).
5. **Consultation**: Video consultation room sessions, start/end timestamps, diagnosis, clinical notes.
6. **Prescription & Items**: Official prescription code (e.g. `TC-2026-001`), medicine itemization (dosage, frequency, duration), instructions, follow-up date.
7. **Medical Record**: Patient clinical history, allergies, chronic conditions, surgical records.
8. **Payment**: Transaction records, payment method, status, transaction IDs.
9. **ChatMessage**: Real-time in-consultation chat messages exchanged between patient and doctor.

---

## ⚙️ Prerequisites

Ensure you have the following installed on your machine:
- **Java**: JDK 21 (e.g., Microsoft OpenJDK 21 or Eclipse Temurin 21)
- **Node.js**: v18+ or v20+ (tested on v24.x)
- **npm**: v9+ or v11+
- Git

---

## ⚡ Quick Start Guide

### 1. Start the Backend (Terminal 1)
```powershell
cd d:\Projects\PERSONAL\medicals\capstone\backend
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.12.8-hotspot"
.\mvnw.cmd spring-boot:run
```
> Backend runs at: **`http://localhost:8080`**

### 2. Start the Frontend (Terminal 2)
```powershell
cd d:\Projects\PERSONAL\medicals\capstone\frontend
npm install
npm run dev
```
> Web UI runs at: **`http://localhost:5173`**

---

## ☕ Step-by-Step Backend Setup

### 1. Open a terminal in the backend directory:
```powershell
cd d:\Projects\PERSONAL\medicals\capstone\backend
```

### 2. Set `JAVA_HOME` to your JDK 21 installation:
```powershell
# Windows PowerShell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.12.8-hotspot"

# Windows Command Prompt (CMD)
set JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.12.8-hotspot

# Linux / macOS
export JAVA_HOME=/path/to/jdk-21
```

### 3. Build and Run:
Using the included Maven Wrapper (`mvnw` / `mvnw.cmd`), you do **not** need a separate Maven installation:

```powershell
# Windows
.\mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

The server will automatically:
- Start Spring Boot on port `8080`.
- Initialize the H2 database.
- Execute `DataInitializer.java` to seed sample doctors, departments, demo patients, appointments, medical records, and prescriptions.

---

## 🗄 Step-by-Step Database Setup

The backend is configured out of the box with an in-memory **H2 Database**. No local database server installation is required.

### Accessing H2 Console:
1. Open your browser and navigate to: **[http://localhost:8080/h2-console](http://localhost:8080/h2-console)**
2. Enter the following database connection properties:

| Field | Value |
| :--- | :--- |
| **Saved Settings** | `Generic H2 (Embedded)` |
| **Driver Class** | `org.h2.Driver` |
| **JDBC URL** | `jdbc:h2:mem:telecaredb` |
| **User Name** | `sa` |
| **Password** | *(leave blank / empty)* |

3. Click **Connect**. You will be able to inspect tables (`PATIENTS`, `DOCTORS`, `APPOINTMENTS`, `CONSULTATIONS`, `PRESCRIPTIONS`, `CHAT_MESSAGES`, etc.).

### (Optional) Switching to MySQL / PostgreSQL:
To switch to MySQL, open `backend/src/main/resources/application.properties` and update:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/telecaredb?createDatabaseIfNotExist=true&useSSL=false
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

---

## 🎨 Step-by-Step Frontend Setup

### 1. Open a new terminal in the frontend directory:
```powershell
cd d:\Projects\PERSONAL\medicals\capstone\frontend
```

### 2. Install dependencies:
```powershell
npm install
```

### 3. Launch Vite Development Server:
```powershell
npm run dev
```

### 4. Access the application:
Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 👥 Demo Accounts & Credentials

The database comes pre-seeded with ready-to-test accounts matching the UI mockups:

### 👤 Patient Account:
| Role | Email | Password | Name |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient@telecare.com` | `password123` | Meena Sekar |

> 💡 *Tip: On the `/login` page, you can click the **✨ Auto-fill Demo** button to populate these credentials with 1 click.*

### 👨‍⚕️ Doctor Accounts:
| Role | Email | Password | Name & Specialty |
| :--- | :--- | :--- | :--- |
| **Doctor** | `doctor.anjali@telecare.com` | `password123` | Dr. Anjali Rao (General Medicine) |
| **Doctor** | `doctor.arun@telecare.com` | `password123` | Dr. Arun Kumar (Cardiology) |
| **Doctor** | `doctor.priya@telecare.com` | `password123` | Dr. Priya Sharma (Dermatology) |
| **Doctor** | `doctor.rahul@telecare.com` | `password123` | Dr. Rahul Menon (Neurology) |

> 💡 *Tip: On the `/doctor-login` portal, you can click any of the doctor chips at the top to auto-fill credentials instantly.*

---

## 🔄 End-to-End User Workflows

### Flow 1: Patient Consultation & Booking
1. Open **[http://localhost:5173](http://localhost:5173)**.
2. Click **Find Doctors** (`/doctors`) to browse doctors with specialty filter dropdowns.
3. Click **Book Appointment** on any doctor card.
4. Select a date, time slot, and consultation mode (Video / Audio).
5. Click **Confirm Appointment**. The system creates the appointment and initializes the consultation room session.

### Flow 2: Interactive Video Consultation & Live Chat
1. Open the Consultation room (`/consultation/1` or click **Join Consultation** from the Patient Dashboard).
2. Test the simulated two-way video layout and call controls (Mute, Camera On/Off, Speaker, End Call).
3. Send messages in the **In-Room Chat** box; messages are saved to the backend database and delivered in real time.
4. Doctor can input diagnosis, save clinical notes, and click **Write / View Prescription**.

### Flow 3: Digital Prescriptions & Printing
1. Navigate to `/prescription/1`.
2. View patient details, prescription identifier (`TC-2026-001`), medicine dosage table, and doctor instructions.
3. If logged in as Doctor, add new medications to the prescription.
4. Click **🖨️ Print Prescription** for a clean, print-formatted layout.

### Flow 4: Patient Dashboard & Medical History
1. View upcoming consultations, health vitals (`O+`, `60 kg`, `78 bpm`, `98.6°F`), and quick actions on `/patient-dashboard`.
2. Navigate to **Medical History** (`/medical-history`) to review past consultations, diagnoses, and access historical prescriptions.

---

## 📡 REST API Reference

All backend REST API endpoints are hosted at `http://localhost:8080/api`:

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/patient/login` — Authenticate patient & receive JWT
- `POST /api/auth/doctor/login` — Authenticate doctor & receive JWT
- `POST /api/auth/register` — Register a new patient account

### 👨‍⚕️ Doctors & Departments (`/api`)
- `GET /api/doctors` — List all doctors (supports `?search=` and `?specialization=` filters)
- `GET /api/doctors/{id}` — Get single doctor profile
- `GET /api/departments` — List medical departments

### 📅 Appointments (`/api/appointments`)
- `POST /api/appointments/book/{patientId}` — Book a new appointment
- `GET /api/appointments/patient/{patientId}` — Retrieve patient appointments
- `GET /api/appointments/doctor/{doctorId}` — Retrieve doctor appointment queue
- `PATCH /api/appointments/{id}/status` — Update appointment status (`CONFIRMED`, `WAITING`, `COMPLETED`)

### 📹 Consultations & Live Chat (`/api/consultations`)
- `GET /api/consultations/{id}` — Get consultation session details
- `GET /api/consultations/appointment/{appointmentId}` — Retrieve or create consultation by appointment
- `POST /api/consultations/{id}/notes` — Update doctor diagnosis & notes
- `GET /api/consultations/{id}/messages` — Get in-room chat messages
- `POST /api/consultations/{id}/messages` — Send a message in consultation room

### 💊 Prescriptions (`/api/prescriptions`)
- `POST /api/prescriptions` — Generate digital prescription with medicines
- `GET /api/prescriptions/{id}` — Get prescription details
- `GET /api/prescriptions/consultation/{consultationId}` — Get prescription for consultation session
- `GET /api/prescriptions/patient/{patientId}` — Get all patient prescriptions

### 📊 Dashboards & Records (`/api`)
- `GET /api/dashboard/patient/{patientId}` — Patient dashboard summary & vitals
- `GET /api/dashboard/doctor/{doctorId}` — Doctor statistics and appointment queue
- `GET /api/medical-records/patient/{patientId}` — Patient health history & records

---

## 📁 Project Directory Structure

```
capstone/
├── README.md                      # This documentation
├── Problem Statement.docx         # Original requirements document
├── ER Diagram.png                 # Database schema diagram
├── *.html                         # Original UI prototypes
├── css/style.css                  # Original prototype styling
│
├── backend/                       # Spring Boot 3 / Java 21 REST API
│   ├── pom.xml                    # Maven configuration & dependencies
│   ├── mvnw / mvnw.cmd            # Maven wrapper scripts
│   └── src/main/
│       ├── java/com/telecare/
│       │   ├── TelecareApplication.java
│       │   ├── config/DataInitializer.java   # Auto-seeds doctors & records
│       │   ├── controller/                   # REST API controllers
│       │   ├── dto/                          # Request & Response DTOs
│       │   ├── model/                        # JPA Entities matching ER Diagram
│       │   ├── repository/                   # Spring Data JPA repositories
│       │   ├── security/                     # Spring Security & JWT filters
│       │   └── service/                      # Business logic services
│       └── resources/
│           └── application.properties        # H2 DB & JWT settings
│
└── frontend/                      # React (Vite SPA)
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx                # Router & Protected routes
        ├── index.css              # TeleCare Design System
        ├── components/
        │   ├── Navbar.jsx         # Header & role-based nav
        │   ├── Footer.jsx         # Platform footer
        │   └── ProtectedRoute.jsx # Route guards
        ├── context/
        │   └── AuthContext.jsx    # Session & JWT state
        ├── services/
        │   └── api.js             # Centralized API client
        └── pages/
            ├── HomePage.jsx               # Landing page
            ├── PatientLoginPage.jsx       # Patient login & demo fill
            ├── DoctorLoginPage.jsx        # Doctor portal login
            ├── RegisterPage.jsx           # Patient registration
            ├── DoctorListPage.jsx         # Doctor directory & search
            ├── BookAppointmentPage.jsx    # Slot booking & summary
            ├── PatientDashboardPage.jsx   # Patient portal & vitals
            ├── DoctorDashboardPage.jsx    # Doctor queue & metrics
            ├── ConsultationPage.jsx       # Video call & live chat
            ├── PrescriptionPage.jsx       # Digital Rx view & print
            └── MedicalHistoryPage.jsx     # Patient clinical timeline
```

---

## 🩺 Support & Troubleshooting

- **Port Conflict on 8080**: If port 8080 is occupied, find and stop the existing process:
  ```powershell
  netstat -ano | findstr :8080
  taskkill /PID <PID> /F
  ```
- **Java Version**: Ensure Java 21 is active:
  ```powershell
  $env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.12.8-hotspot"
  java -version
  ```
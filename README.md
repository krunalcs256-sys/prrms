# PRRMS — Patient Referral & Record Management System

A microservices-based healthcare application for managing patients and inter-doctor referrals.

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌───────────────────┐
│   Auth Service  │     │ Patient Service  │     │ Referral Service  │
│   :8080         │     │ :8081            │◄────│ :8082             │
│                 │     │                  │     │ (Feign Client)    │
│ - Register      │     │ - Patients CRUD  │     │ - Bulk Referrals  │
│ - Login / JWT   │     │ - Batch API      │     │ - Notifications   │
│ - Doctor list   │     │ - Filters        │     │ - Audit Logs      │
└─────────────────┘     └──────────────────┘     └───────────────────┘
         ▲                       ▲                         ▲
         └───────────────────────┴─────────────────────────┘
                            Frontend :3000
                         (React + Vite proxy)
```

Each service has its own PostgreSQL database (`auth_db`, `patient_db`, `referral_db`).  
JWT is verified locally in each service using a shared secret — no inter-service auth calls.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3.3.12, Spring Security 6, Spring Data JPA |
| Service Communication | Spring Cloud OpenFeign 2023.0.3 (Apache HttpClient 5) |
| Authentication | JWT (JJWT 0.12.6), BCrypt |
| Database | PostgreSQL, Flyway migrations |
| Frontend | React 18, TypeScript, Vite |
| UI | Ant Design 5, TanStack Query v5 |
| State | Zustand |

---

## Prerequisites

- Java 21
- Maven 3.9+
- Node.js 18+
- PostgreSQL 15+

---

## Database Setup

Create three databases in PostgreSQL:

```sql
CREATE DATABASE auth_db;
CREATE DATABASE patient_db;
CREATE DATABASE referral_db;
```

Default credentials used by all services: `postgres / root`  
Update `application.properties` in each service if your credentials differ.

Flyway runs automatically on startup and creates all tables and seed data.

---

## Running the Services

### 1. Auth Service
```bash
cd auth-service
mvn spring-boot:run
# Starts on http://localhost:8080
```

### 2. Patient Service
```bash
cd patient-service
mvn spring-boot:run
# Starts on http://localhost:8081
```

### 3. Referral Service
```bash
cd referral-service
mvn spring-boot:run
# Starts on http://localhost:8082
```

### 4. Frontend
```bash
cd prrms-frontend
npm install
npm run dev
# Starts on http://localhost:3000
```

Open `http://localhost:3000` in your browser.

---

## Sample Login Credentials

Seeded by Flyway migrations — password for all accounts is `password`.

| Name | Email | Role | Department |
|---|---|---|---|
| Dr. Anita Sharma | anita@prrms.com | DOCTOR | General |
| Dr. Rajesh Kumar | rajesh@prrms.com | DOCTOR | General |
| Dr. Priya Patel | priya@prrms.com | DOCTOR | Gynecology |

---

## API Overview

### Auth Service — `http://localhost:8080`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new doctor or admin |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/doctors` | List all registered doctors |

### Patient Service — `http://localhost:8081`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/patients` | List patients with filters (name, date, department, status) |
| GET | `/api/patients/{id}` | Get patient details |
| POST | `/api/patients` | Create a new patient |
| POST | `/api/patients/batch/by-ids` | *(Internal)* Fetch patients by IDs |
| PATCH | `/api/patients/batch/status` | *(Internal)* Bulk update patient status |

### Referral Service — `http://localhost:8082`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/referrals/bulk` | Create bulk referrals for selected patients |
| GET | `/api/referrals/outgoing` | Referrals sent by the logged-in doctor |
| GET | `/api/referrals/incoming` | Referrals received by the logged-in doctor |
| PATCH | `/api/referrals/{id}/status` | Accept or reject an incoming referral |
| GET | `/api/notifications` | Get notifications for the logged-in doctor |
| PATCH | `/api/notifications/{id}/read` | Mark a notification as read |

---

## Key Features

- **JWT Authentication** — stateless, shared secret across all services
- **Patient Management** — create patients, filter by name / date range / department / status
- **Bulk Referrals** — select multiple patients and refer them to another doctor in one action
- **Priority Levels** — Low, Medium, High, Urgent
- **Real-time Notifications** — target doctor receives a notification for each incoming referral
- **Audit Logs** — every referral action is recorded
- **Feign Client** — referral-service calls patient-service via declarative HTTP client

---

## Project Structure

```
PRRMS/
├── auth-service/          # Authentication & user management
├── patient-service/       # Patient records & batch operations
├── referral-service/      # Referrals, notifications, audit logs
└── prrms-frontend/        # React frontend (Vite + Ant Design)
```
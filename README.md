# RedYellowGreen

A production floor monitoring application where Admins register equipment, Supervisors schedule orders, and Workers track production states in real time.

## Getting Started

### Backend

Navigate to the `backend` folder and run:

```bash
cd backend
dotnet run
```

The API will start on `http://localhost:5000`.

### Frontend

Navigate to the `frontend` folder and run:

```bash
cd frontend
npm start
```

The app will open at `http://localhost:3000`.

## Roles

- **Admin** — Register equipment units on the central location
- **Supervisor** — Schedule production orders for each unit
- **Worker** — Monitor and update production states (Red / Yellow / Green) in real time

## Production States

| State | Meaning |
|-------|---------|
| 🔴 Red | Standing Still |
| 🟡 Yellow | Starting Up / Winding Down |
| 🟢 Green | Producing Normally |
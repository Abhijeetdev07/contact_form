
# Contact Form (MERN)

A simple MERN contact management app.

- **Frontend**: React (Vite) + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)

## Features

- Create a contact (client + server validation)
- List contacts (newest/oldest sorting)
- Delete contact (with confirmation)
- Responsive UI (mobile stacked, desktop wide list)

## Folder Structure

```text
contact form/
  client/   # React (Vite) frontend
  server/   # Express + MongoDB backend
```

## Local Setup

### 1) Backend (Express)

1. Open terminal in `server/`
2. Install deps:

```bash
npm install
```

3. Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/contactform
CLIENT_URL=http://localhost:5173
```

4. Start server:

```bash
npm run dev
```

Health check:

```text
GET http://localhost:5000/health
```

### 2) Frontend (React + Vite)

1. Open terminal in `client/`
2. Install deps:

```bash
npm install
```

3. Set frontend API base URL in your local environment:

- Create `client/.env` (local file, **do not commit**) with:

```env
VITE_API_BASE_URL=http://localhost:5000
```

4. Start frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Environment Variables

### Backend (`server/.env`)

- `MONGO_URI` (required) – MongoDB Atlas/local connection string
- `PORT` (optional locally) – backend port
- `CLIENT_URL` (recommended) – frontend URL for CORS

### Frontend (`client/.env`)

- `VITE_API_BASE_URL` (required for deployment) – backend base URL
  - Example local: `http://localhost:5000`
  - Example Render: `https://your-backend.onrender.com`

## API Endpoints

Base: `/api/contacts`

- **GET** `/api/contacts`
  - Returns `{ contacts: [...] }`
  - Sorted by newest first on backend

- **POST** `/api/contacts`
  - Body:
    - `name` (required)
    - `email` (required, valid format)
    - `phone` (required)
    - `message` (optional, max 200 chars)
  - Returns `{ message, contact }`

- **DELETE** `/api/contacts/:id`
  - Deletes by Mongo `_id`
  - Returns `{ message, id }`

## Deployment on Render

### 1) Deploy Backend (Web Service)

- **New** -> **Web Service**
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `MONGO_URI` = your MongoDB Atlas URI
  - `CLIENT_URL` = your frontend Render URL (after frontend deploy)
  - Do **not** set `PORT` (Render provides it)

### 2) Deploy Frontend (Static Site)

- **New** -> **Static Site**
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_BASE_URL` = your backend Render URL

### Notes

- The frontend reads `VITE_API_BASE_URL` and calls:
  - `${VITE_API_BASE_URL}/api/contacts`
- Backend CORS uses `CLIENT_URL` (or `VITE_API_BASE_URL` as a fallback).


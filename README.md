# Local development

Run the backend and frontend in separate terminal windows. Vite proxies API
requests to the local backend, and the Socket.IO client connects to localhost
while Vite is in development mode. Production builds keep using the deployed
backend unless overridden with a Vite environment variable.

## 1. Start the backend

From the project directory:

```sh
cd backend
npm install
npm start
```

The backend runs at `http://localhost:3001`. Make sure `backend/.env` contains
the local `MONGODB_URI` and `SESSION_KEY` values required by the server.

## 2. Start the frontend

In a second terminal, from the project directory:

```sh
cd frontend
npm install
npm run dev
```

Open the localhost URL printed by Vite, usually `http://localhost:5173`.

The frontend defaults to the local backend automatically during development.
To override the API or socket URL, copy `.env.development.example` to
`.env.development.local`, edit the values, and restart Vite. These local
environment files are ignored by Git.

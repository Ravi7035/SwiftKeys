
# SwiftKeys

**SwiftKeys** is a real-time online multiplayer typing platform where users can compete in typing games, join multiplayer rooms, and track their performance through live game updates and leaderboards.

The application is built as a full-stack web application with a React frontend, Node.js/Express backend, Socket.io for real-time communication, and MongoDB for persistent data.

## Features

* 🔐 User authentication
* ⚡ Real-time multiplayer gameplay
* 🎮 Multiplayer game rooms
* ⌨️ Real-time typing interaction
* 🏁 Casual and Challenging game modes
* 👥 Room-based multiplayer sessions
* 📊 Live player progress
* 🏆 Leaderboards
* 💾 Persistent game/user data
* 🔄 Real-time synchronization using WebSockets
* 📱 Responsive web interface

---

## Tech Stack

### Frontend

* **React**
* **Vite**
* **Zustand** — client-side state management
* **Socket.io Client** — real-time communication
* **Axios** — HTTP API communication
* **Tailwind CSS** — styling
* **JavaScript / JSX**

### Backend

* **Node.js**
* **Express.js**
* **Socket.io**
* **MongoDB**
* **Mongoose**
* **JWT** — authentication
* **bcrypt / bcryptjs** — password hashing
* **Cookie Parser**
* **CORS**
* **Zod** — validation

### Deployment

* **Vercel** — frontend
* **Render** — backend
* **MongoDB** — database

---

## Architecture

SwiftKeys follows a client-server architecture with REST APIs handling persistent operations and Socket.io handling real-time multiplayer communication.

```text
                    ┌─────────────────────────┐
                    │        User Browser     │
                    │                         │
                    │   React + Vite +        │
                    │   Zustand               │
                    └───────────┬─────────────┘
                                │
                    ┌───────────┴─────────────┐
                    │                         │
                 HTTP API                 WebSocket
                    │                         │
                    ▼                         ▼
          ┌──────────────────┐      ┌──────────────────┐
          │ Express Backend  │      │ Socket.io Server │
          │                  │      │                  │
          │ Authentication   │      │ Rooms            │
          │ REST APIs        │      │ Game State       │
          │ Business Logic   │      │ Player Updates   │
          └────────┬─────────┘      └────────┬─────────┘
                   │                         │
                   └───────────┬─────────────┘
                               ▼
                       ┌────────────────┐
                       │    MongoDB     │
                       │                │
                       │ Users          │
                       │ Games/Sessions │
                       │ Leaderboards   │
                       └────────────────┘
```

---

## How SwiftKeys Works

### 1. Authentication

Users can create an account and authenticate before accessing the multiplayer functionality.

The backend handles:

* User registration
* Password hashing
* Login
* JWT-based authentication
* Authentication cookies
* Protected API requests

The frontend communicates with the backend using Axios with credentials enabled where required.

---

### 2. Multiplayer Rooms

Players can participate in multiplayer typing sessions through Socket.io-powered rooms.

A typical multiplayer flow is:

```text
User
 │
 ▼
Create / Join Room
 │
 ▼
Socket.io Connection
 │
 ▼
Join Multiplayer Room
 │
 ▼
Players Synchronize
 │
 ▼
Typing Game Starts
 │
 ▼
Live Progress Updates
 │
 ▼
Game Completion
 │
 ▼
Results / Leaderboard
```

Socket.io is used because multiplayer game state needs to be communicated between connected clients with low latency rather than relying entirely on repeated HTTP requests.

---

## Game Modes

### Casual Mode

A standard multiplayer typing experience focused on completing the typing challenge and competing with other players.

### Challenging Mode

A more competitive game mode designed to provide a higher level of difficulty and challenge during multiplayer sessions.

---

## Real-Time Communication

SwiftKeys uses **Socket.io** to synchronize multiplayer game state.

Instead of repeatedly polling the backend, connected players maintain a WebSocket-based communication channel.

This allows the server to communicate events such as:

* Room creation
* Room joining
* Player connection
* Player disconnection
* Game state changes
* Typing/progress updates
* Game completion
* Multiplayer results

The exact event names are implemented in the Socket.io client/server layer.

---

## State Management

The frontend uses **Zustand** for application state management.

State is separated according to application responsibilities, including areas such as:

* Authentication
* Current user
* Multiplayer/game state
* Room information
* Player information
* Game progress

This keeps transient UI/game state on the client while persistent information is handled through the backend and MongoDB.

---

## Database

MongoDB is used as the persistent database and Mongoose provides the data modeling layer for the Node.js backend.

The database is responsible for storing application data such as:

* User information
* Authentication-related user data
* Game/session information
* Multiplayer-related persistent data
* Leaderboard/performance information

---

## Project Structure

```text
SwiftKeys/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── ...
│   │
│   ├── package.json
│   └── .env
│
├── frontend/
│   └── vite-project/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── stores/
│       │   └── ...
│       │
│       ├── package.json
│       └── vite.config.js
│
├── README.md
├── package.json
└── package-lock.json
```

> The exact internal file organization may evolve as the project grows.

---

# Getting Started

## Prerequisites

Make sure you have:

* Node.js
* npm
* MongoDB or a MongoDB Atlas database
* Git

---

## Clone the Repository

```bash
git clone https://github.com/Ravi7035/SwiftKeys.git
cd SwiftKeys
```

The repository contains independent frontend and backend applications, so dependencies should be installed in their respective directories.

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory.

```env
PORT=5003
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add any other environment variables required by the backend configuration.

**Never commit real credentials or secrets to GitHub.**

Start the backend in development mode:

```bash
npm run dev
```

Or start it normally:

```bash
npm start
```

---

## Frontend Setup

Open another terminal:

```bash
cd frontend/vite-project
npm install
npm run dev
```

The Vite development server will provide the local frontend URL.

The frontend communicates with the backend API and Socket.io server configured for the application environment.

---

# Environment Configuration

SwiftKeys has separate frontend and backend configuration because the frontend and backend are deployed independently.

### Development

```text
Frontend
http://localhost:5173

Backend
http://localhost:5003
```

### Production

```text
Frontend
https://swift-keys-gray.vercel.app

Backend
https://swiftkeys.onrender.com
```

The production frontend should communicate with the deployed backend rather than localhost.

---

# API Communication

The frontend uses Axios to communicate with the Express backend.

The production API follows the structure:

```text
https://swiftkeys.onrender.com/api
```

Authentication requests and other persistent operations are handled through the REST API.

For cross-origin authenticated requests, the frontend and backend are configured to support credentials where required.

---

# Socket.io Communication

REST APIs are used for request/response operations, while Socket.io is used for real-time multiplayer communication.

```text
HTTP
────
Frontend ───────────────► Express API
Frontend ◄─────────────── Express API


WebSocket
─────────
Frontend ◄══════════════► Socket.io Server
              │
              └── Multiplayer Events
```

This separation allows the application to use the appropriate communication mechanism for each type of operation.

---

# Production Deployment

The current deployment architecture is:

```text
                  Internet
                     │
                     ▼
        ┌────────────────────────┐
        │        Vercel          │
        │   React/Vite Frontend  │
        └────────────┬───────────┘
                     │
                HTTPS / API
                     │
                     ▼
        ┌────────────────────────┐
        │        Render          │
        │ Node.js + Express      │
        │ Socket.io              │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │        MongoDB         │
        └────────────────────────┘
```

### Frontend

The frontend is deployed using Vercel.

Production URL:

https://swift-keys-gray.vercel.app

### Backend

The backend is deployed using Render.

Production backend:

https://swiftkeys.onrender.com

---

# CORS

Because the frontend and backend are hosted on different domains in production, the backend must explicitly allow requests from the frontend origin.

Development:

```text
http://localhost:5173
```

Production:

```text
https://swift-keys-gray.vercel.app
```

Credentials must also be configured consistently between Axios, Express CORS, and authentication cookies.

---

# Authentication

SwiftKeys uses token-based authentication with cookie support.

The authentication system includes:

1. User registration
2. Password hashing
3. Login
4. JWT generation
5. Authentication cookie
6. Protected backend requests
7. Logout

Authentication state is consumed by the React frontend to control access to authenticated features.

---

# Security

The application includes several basic security mechanisms:

* Password hashing
* JWT-based authentication
* HTTP-only authentication cookies where configured
* CORS restrictions
* Environment variables for sensitive configuration
* Backend-side validation
* Separation of frontend and backend responsibilities

Secrets such as database credentials and JWT secrets should never be committed to the repository.

---

# Development Workflow

A typical development workflow is:

```text
1. Start MongoDB
       ↓
2. Start Express backend
       ↓
3. Start Vite frontend
       ↓
4. Open application
       ↓
5. Authenticate
       ↓
6. Create / join multiplayer room
       ↓
7. Play typing game
       ↓
8. Verify real-time communication
       ↓
9. Verify persistent results
```

---

# Future Improvements

Potential improvements for future versions include:

* Automated testing for multiplayer game flows
* Better matchmaking
* Room lifecycle management
* Improved reconnect handling
* Rate limiting
* More detailed player statistics
* Match history
* Tournament mode
* Improved game synchronization
* Performance monitoring
* Automated CI/CD
* Horizontal scaling for Socket.io servers

These are potential extensions and are not required for the current application.

---

# Live Demo

**Frontend:**
https://swift-keys-gray.vercel.app

**Repository:**
https://github.com/Ravi7035/SwiftKeys

---

# Author

**Ravi Teja**


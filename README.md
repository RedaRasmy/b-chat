https://github.com/user-attachments/assets/4251c443-443b-4e54-b6ae-4b36695a6053

# BChat

A full-stack real-time chat application built with the PERN stack and Socket.io.

## Tech Stack

**Frontend**

- React + TypeScript
- TailwindCSS + shadcn
- React Router
- React Query
- Socket.io Client
- Zod + react-hook-form

**Backend**

- Express + TypeScript
- PostgreSQL + Drizzle ORM
- Socket.io
- JWT + bcryptjs
- Zod + drizzle-zod

## Features

- 🔐 **Authentication** — Register/login with credentials or OAuth (Github & Google).
- 👥 **Friends** — Send, accept, and manage friend requests.
- 💬 **Direct Messages** — Real-time 1-on-1 conversations.
- 🏠 **Groups** — Create and manage group chats with multiple members.
- 📝 **Posts** — Share posts.
- ⚡ **Real-time** — Instant messaging, typing indicators, and online presence.

## Getting Started

### Prerequisites

- Node.js 22+
- Docker
- pnpm

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/redarasmy/b-chat.git
cd b-chat
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
cp packages/database/.env.example packages/database/.env
```

Only `server/.env` requires configuration. Fill in your OAuth credentials and JWT secret — the other `.env` files work with their defaults.

You can generate a jwt secret with the command below:

```bash
openssl rand --base64 64
```

4. **Set up the database**

```bash
docker compose up -d
pnpm db:push
```

5. **Run the app**

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`.

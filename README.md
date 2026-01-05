# Order Management API

REST API for order management built with Bun, Express, TypeScript, and MongoDB.

## 📋 Prerequisites

Before you begin, make sure you have installed:

- [Bun](https://bun.sh) (version 1.3.4 or higher)
- [Docker](https://www.docker.com/) and Docker Compose (for MongoDB database)

## 🚀 Installation

### 1. Install Bun

#### Windows

```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

#### macOS and Linux

```bash
curl -fsSL https://bun.sh/install | bash
```

Or using npm:

```bash
npm install -g bun
```

For more installation options, visit: https://bun.sh/docs/installation

### 2. Clone the repository

```bash
git clone <repository-url>
cd order-management-api
```

### 3. Install dependencies

```bash
bun install
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
MONGO_URL=mongodb://admin:admin@localhost:27017/om-db?authSource=admin
NODE_ENV=development
```

**Note:** The default MongoDB credentials configured in `docker-compose.yml` are:

- Username: `admin`
- Password: `admin`
- Database: `om-db`

## 🏃 Running the Project

### Development Mode

Development mode starts MongoDB via Docker Compose and runs the server in watch mode (automatically restarts when changes are detected):

```bash
bun run dev
```

This command will:

1. Start the MongoDB container in the background
2. Run the server in watch mode

### Production Mode

To run in production mode:

```bash
bun run start
```

**Note:** Make sure MongoDB is running before executing this command.

### Start MongoDB Only

If you want to start only the database:

```bash
docker compose up -d
```

To stop the database:

```bash
docker compose down
```

## 📡 Endpoints

The API will be available at `http://localhost:8080`

- **Health Check:** `GET /`
- **API Routes:** `GET /v1/*`

## 🧪 Testing

To run the tests:

```bash
bun test
```

## 🛠️ Technologies

- **Runtime:** [Bun](https://bun.sh)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB
- **Validation:** Zod
- **Authentication:** JWT
- **Testing:** Vitest

## 📝 Available Scripts

- `bun run dev` - Starts the server in development mode with watch
- `bun run start` - Starts the server in production mode
- `bun test` - Runs the tests

## 📚 Project Structure

```
order-management-api/
├── src/
│   ├── modules/          # Application modules (auth, orders)
│   ├── lib/              # Libraries and utilities
│   ├── middlewares/      # Express middlewares
│   └── routes.ts         # Route configuration
├── index.ts              # Application entry point
├── docker-compose.yml    # MongoDB configuration
└── package.json          # Dependencies and scripts
```

---

This project was created using `bun init` in bun v1.3.4. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

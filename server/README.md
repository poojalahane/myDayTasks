# Server Setup Guide

Welcome to the **Server** module of the `technical-interview-base` project. This guide will walk you through the steps required to set up and run the server locally.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [Useful Commands](#useful-commands)
- [Folder Structure](#folder-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Stratex-Aus/technical-interview-base.git  ./<first_name-last_name>
   ```

2. **Navigate to the Server Directory**

   ```bash
   cd ./<first_name-last_name>/server
   ```

3. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

   Or using pnpm:

   ```bash
   pnpm install
   ```

## Configuration

1. **Environment Variables**

   Create a `.env` file in the `server` directory with the following variables:

   ```bash:.env
   DEBUG="development"
   NODE_ENV="development"
   ```

   Move to the next step only after you have created the `.env` file.
   Go to the `./<first_name-last_name>/server/config` directory and populate the `development.json` file with the correct credentials.

   > Tip: use upstash for redis.

2. **Database Setup**

   Ensure you have Docker installed.

   Go to the `./<first_name-last_name>/server/scripts` directory and run the `create-db.sh` script to start the database container.

## Running the Server

### Development Mode

To start the server in development mode with hot-reloading:

```bash
npm run dev
```

Or using pnpm:

```bash
pnpm dev
```

The server should now be running at `http://localhost:3000`.

## Folder Structure

```plaintext
📦src
 ┣ 📂constants
 ┃ ┗ 📜index.ts
 ┣ 📂controllers
 ┃ ┣ 📜base.controller.ts
 ┃ ┣ 📜index.ts
 ┃ ┗ 📜todo.controller.ts
 ┣ 📂errors
 ┃ ┗ 📜index.ts
 ┣ 📂lib
 ┃ ┣ 📜api.ts
 ┃ ┣ 📜db.ts
 ┃ ┣ 📜query-builder.ts
 ┃ ┗ 📜redis.ts
 ┣ 📂logging
 ┃ ┗ 📜logger.factory.ts
 ┣ 📂middlewares
 ┃ ┣ 📜error-handler.middleware.ts
 ┃ ┗ 📜request.middleware.ts
 ┣ 📂models
 ┃ ┣ 📜base.model.ts
 ┃ ┣ 📜index.ts
 ┃ ┗ 📜todo.model.ts
 ┣ 📂repositories
 ┃ ┣ 📜base.repository.ts
 ┃ ┣ 📜index.ts
 ┃ ┗ 📜todo.repository.ts
 ┣ 📂router
 ┃ ┣ 📂v1
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┗ 📜todo.routes.ts
 ┃ ┗ 📜index.ts
 ┣ 📂services
 ┃ ┣ 📜base.service.ts
 ┃ ┣ 📜index.ts
 ┃ ┗ 📜todo.service.ts
 ┣ 📂sql
 ┃ ┣ 📜init-db.sql
 ┃ ┗ 📜queries.sql
 ┣ 📂types
 ┃ ┗ 📜index.d.ts
 ┣ 📂utils
 ┃ ┣ 📜db.utils.ts
 ┃ ┣ 📜rate-limit.ts
 ┃ ┗ 📜redis.utils.ts
 ┣ 📜index.ts
 ┣ 📜inversify.config.ts
 ┗ 📜jest.config.ts
```

## Troubleshooting

- **Common Issue #1**

  _Problem_: `./scripts/create-db.sh: line 3: cd: ../docker: No such file or directory`.

  _Solution_:

  - Ensure you are in the `./<first_name-last_name>/server/scripts` directory and then run the `create-db.sh` script.

- **Common Issue #2**

  _Problem_: Port `3000` is already in use.

  _Solution_:

  - Stop the application using that port or change the `PORT` in the `config/development.json` file.

# Planning Poker Application

A simple Planning Poker application with the following features:

## Features

- **Cards**: 0.1, 0.25, 0.5, 1, 2, 4
- **Create Table**: Creates a unique URL to invite other players
- **Avatar Selection**: Players choose a Pepe emoji avatar
- **Real-time Voting**: WebSocket communication for instant updates
- **Reveal Cards**: Display all votes simultaneously
- **Reset Voting**: Start a new voting round

## Release to Docker Hub

### 1. Build the Docker image

```bash
docker build -t your-dockerhub-username/planning-poker:latest .
```

### 2. Login to Docker Hub

```bash
docker login
```

### 3. Push the image to Docker Hub

```bash
docker push your-dockerhub-username/planning-poker:latest
```

### 4. (Optional) Tag and push a specific version

```bash
docker tag your-dockerhub-username/planning-poker:latest your-dockerhub-username/planning-poker:v1.0.0
docker push your-dockerhub-username/planning-poker:v1.0.0
```

## Running from Docker Hub (on server)

### Pull and run the application

```bash
    docker pull your-dockerhub-username/planning-poker:latest
docker run -d -p 3000:3000 --name planning-poker your-dockerhub-username/planning-poker:latest
```

### Or use docker-compose.yml

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  planning-poker:
    image: your-dockerhub-username/planning-poker:latest
    ports:
      - "3000:3000"
    restart: unless-stopped
```

Then run:

```bash
docker-compose up -d
```

The application will be available at: http://localhost:3000

## Running with Docker (local development)

```bash
docker compose up -d --build
```

The application will be available at: http://localhost:3000

## Running without Docker

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The application will be available at: http://localhost:3000

## Usage

1. Open http://localhost:3000
2. Click "Create New Table"
3. Enter your name and select an avatar
4. Copy the link and share it with other players
5. All players select a card
6. Click "Reveal Cards" to display results
7. Click "New Vote" to start another round

## Technology Stack

- **Backend**: Node.js, Express, WebSocket (ws)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Deployment**: Docker

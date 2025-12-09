const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static('public'));

// Store rooms and their players
const rooms = new Map();

// Helper function to broadcast to all clients in a room
function broadcastToRoom(roomId, message) {
  const room = rooms.get(roomId);
  if (room) {
    room.players.forEach(player => {
      if (player.ws.readyState === WebSocket.OPEN) {
        player.ws.send(JSON.stringify(message));
      }
    });
  }
}

// Helper function to get room state
function getRoomState(roomId) {
  const room = rooms.get(roomId);
  if (!room) return null;

  return {
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      vote: room.revealed ? p.vote : (p.vote !== null ? 'hidden' : null)
    })),
    revealed: room.revealed,
    allVoted: room.players.every(p => p.vote !== null)
  };
}

wss.on('connection', (ws) => {
  let currentPlayer = null;
  let currentRoomId = null;

  ws.on('message', (data) => {
    const message = JSON.parse(data);

    switch (message.type) {
      case 'create_room':
        const roomId = uuidv4().slice(0, 8);
        rooms.set(roomId, {
          id: roomId,
          players: [],
          revealed: false
        });
        ws.send(JSON.stringify({
          type: 'room_created',
          roomId: roomId
        }));
        break;

      case 'join_room':
        currentRoomId = message.roomId;
        const room = rooms.get(currentRoomId);

        if (!room) {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Room not found'
          }));
          return;
        }

        currentPlayer = {
          id: uuidv4(),
          name: message.name,
          avatar: message.avatar,
          vote: null,
          ws: ws
        };

        room.players.push(currentPlayer);

        ws.send(JSON.stringify({
          type: 'joined',
          playerId: currentPlayer.id,
          roomId: currentRoomId
        }));

        broadcastToRoom(currentRoomId, {
          type: 'room_update',
          ...getRoomState(currentRoomId)
        });
        break;

      case 'vote':
        if (currentPlayer && currentRoomId) {
          currentPlayer.vote = message.value;
          const room = rooms.get(currentRoomId);

          broadcastToRoom(currentRoomId, {
            type: 'room_update',
            ...getRoomState(currentRoomId)
          });
        }
        break;

      case 'reveal':
        if (currentRoomId) {
          const room = rooms.get(currentRoomId);
          if (room) {
            room.revealed = true;
            broadcastToRoom(currentRoomId, {
              type: 'room_update',
              ...getRoomState(currentRoomId)
            });
          }
        }
        break;

      case 'reset':
        if (currentRoomId) {
          const room = rooms.get(currentRoomId);
          if (room) {
            room.revealed = false;
            room.players.forEach(p => p.vote = null);
            broadcastToRoom(currentRoomId, {
              type: 'room_update',
              ...getRoomState(currentRoomId)
            });
          }
        }
        break;
    }
  });

  ws.on('close', () => {
    if (currentPlayer && currentRoomId) {
      const room = rooms.get(currentRoomId);
      if (room) {
        room.players = room.players.filter(p => p.id !== currentPlayer.id);

        if (room.players.length === 0) {
          rooms.delete(currentRoomId);
        } else {
          broadcastToRoom(currentRoomId, {
            type: 'room_update',
            ...getRoomState(currentRoomId)
          });
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.add(ws);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      const chatMessage = {
        sender: data.username,
        text: data.message,
        timestamp: new Date().toISOString()
      };

      // Broadcast to all connected clients
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(chatMessage));
        }
      });
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(8080, () => {
  console.log('Chat server running on ws://localhost:8080');
});
import express from 'express';
import { Server } from 'socket.io';

const router = express.Router();

router.get('/socket-test', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Socket.IO Test</title>
                <script src="/socket.io/socket.io.js"></script>
            </head>
            <body>
                <h1>Socket.IO Test</h1>
                <div id="status">Connecting...</div>
                <script>
                    const socket = io();
                    
                    socket.on('connect', () => {
                        document.getElementById('status').textContent = 'Connected!';
                        document.getElementById('status').style.color = 'green';
                    });
                    
                    socket.on('disconnect', () => {
                        document.getElementById('status').textContent = 'Disconnected!';
                        document.getElementById('status').style.color = 'red';
                    });
                </script>
            </body>
        </html>
    `);
});

export default router; 
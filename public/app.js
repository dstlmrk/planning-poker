let ws = null;
let roomId = null;
let playerId = null;
let selectedAvatar = null;
let currentVote = null;

// Screen management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// WebSocket connection
function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onopen = () => {
        console.log('Connected to server');
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleMessage(message);
    };

    ws.onclose = () => {
        console.log('Disconnected from server');
        setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

// Handle incoming messages
function handleMessage(message) {
    switch (message.type) {
        case 'room_created':
            roomId = message.roomId;
            updateURL(roomId);
            showJoinScreen();
            break;

        case 'joined':
            playerId = message.playerId;
            roomId = message.roomId;
            showGameScreen();
            break;

        case 'room_update':
            updateGameState(message);
            break;

        case 'error':
            alert(message.message);
            break;
    }
}

// Update URL with room ID
function updateURL(roomId) {
    const url = new URL(window.location);
    url.searchParams.set('room', roomId);
    window.history.pushState({}, '', url);
}

// Show join screen
function showJoinScreen() {
    showScreen('join-screen');
}

// Show game screen
function showGameScreen() {
    showScreen('game-screen');
    document.getElementById('room-code').textContent = roomId;
}

// Update game state
function updateGameState(state) {
    const playersList = document.getElementById('players-list');
    playersList.innerHTML = '';

    state.players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';

        if (player.vote !== null) {
            playerCard.classList.add('voted');
        }

        if (state.revealed && player.vote !== null) {
            playerCard.classList.add('revealed');
        }

        let voteDisplay = '';
        if (player.vote === null) {
            voteDisplay = '';
        } else if (player.vote === 'hidden') {
            voteDisplay = '<span class="player-vote hidden">🃏</span>';
        } else {
            voteDisplay = `<span class="player-vote">${player.vote}</span>`;
        }

        playerCard.innerHTML = `
            <div class="player-avatar">${player.avatar}</div>
            <div class="player-name">${player.name}</div>
            ${voteDisplay}
        `;

        playersList.appendChild(playerCard);
    });

    // Update reveal button state
    const revealBtn = document.getElementById('reveal-btn');
    if (state.revealed) {
        revealBtn.textContent = 'Karty odhaleny';
        revealBtn.disabled = true;
    } else {
        revealBtn.textContent = 'Odhalit karty';
        revealBtn.disabled = !state.allVoted;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    connectWebSocket();

    // Check if there's a room ID in URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlRoomId = urlParams.get('room');

    if (urlRoomId) {
        roomId = urlRoomId;
        showJoinScreen();
    } else {
        showScreen('home-screen');
    }

    // Create room button
    document.getElementById('create-room-btn').addEventListener('click', () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'create_room' }));
        }
    });

    // Avatar selection
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', (e) => {
            document.querySelectorAll('.avatar-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            e.target.classList.add('selected');
            selectedAvatar = e.target.dataset.avatar;
            updateJoinButton();
        });
    });

    // Player name input
    document.getElementById('player-name').addEventListener('input', updateJoinButton);

    // Join button
    document.getElementById('join-btn').addEventListener('click', () => {
        const name = document.getElementById('player-name').value.trim();

        if (name && selectedAvatar && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'join_room',
                roomId: roomId,
                name: name,
                avatar: selectedAvatar
            }));
        }
    });

    // Card selection
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (e) => {
            document.querySelectorAll('.card').forEach(c => {
                c.classList.remove('selected');
            });
            e.currentTarget.classList.add('selected');
            currentVote = e.currentTarget.dataset.value;

            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'vote',
                    value: parseFloat(currentVote)
                }));
            }
        });
    });

    // Reveal button
    document.getElementById('reveal-btn').addEventListener('click', () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'reveal' }));
        }
    });

    // Reset button
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'reset' }));

            // Clear local vote selection
            document.querySelectorAll('.card').forEach(c => {
                c.classList.remove('selected');
            });
            currentVote = null;
        }
    });

    // Copy link button
    document.getElementById('copy-link-btn').addEventListener('click', () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            const btn = document.getElementById('copy-link-btn');
            const originalText = btn.textContent;
            btn.textContent = '✅ Zkopírováno!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    });
});

// Update join button state
function updateJoinButton() {
    const name = document.getElementById('player-name').value.trim();
    const joinBtn = document.getElementById('join-btn');
    joinBtn.disabled = !(name && selectedAvatar);
}

let ws = null;
let roomId = null;
let playerId = null;
let selectedAvatar = null;
let currentVote = null;

// All available Pepe emojis - now using CDN URLs from emoji.gg
const allPepeAvatars = [
    'https://cdn3.emoji.gg/emojis/607191-pepelooking.png',
    'https://cdn3.emoji.gg/emojis/920204-owol.png',
    'https://cdn3.emoji.gg/emojis/393211-life.png',
    'https://cdn3.emoji.gg/emojis/829312-ok.png',
    'https://cdn3.emoji.gg/emojis/569450-peepopog.gif',
    'https://cdn3.emoji.gg/emojis/690612-pepelmao.gif',
    'https://cdn3.emoji.gg/emojis/857799-pepesmoking.gif',
    'https://cdn3.emoji.gg/emojis/34594-spedpepe.png',
    'https://cdn3.emoji.gg/emojis/822446-delusional.png',
    'https://cdn3.emoji.gg/emojis/745317-swepepeviking.png',
    'https://cdn3.emoji.gg/emojis/802232-stephblush.png',
    'https://cdn3.emoji.gg/emojis/247423-pepeflower.gif',
    'https://cdn3.emoji.gg/emojis/799926-idk.png',
    'https://cdn3.emoji.gg/emojis/291042-pepetyping.gif',
    'https://cdn3.emoji.gg/emojis/919171-pepeguns.gif',
    'https://cdn3.emoji.gg/emojis/5357-pepehappy.gif',
    'https://cdn3.emoji.gg/emojis/552046-pepe.png',
    'https://cdn3.emoji.gg/emojis/928902-oooo.png',
    'https://cdn3.emoji.gg/emojis/599976-shoot.png',
    'https://cdn3.emoji.gg/emojis/67908-pepejam.gif',
    'https://cdn3.emoji.gg/emojis/93659-pepebedjump.gif',
    'https://cdn3.emoji.gg/emojis/13796-cuddle.png',
    'https://cdn3.emoji.gg/emojis/22859-steamdeck.png',
    'https://cdn3.emoji.gg/emojis/31261-pray.png',
    'https://cdn3.emoji.gg/emojis/5997-pepe-point.png',
    'https://cdn3.emoji.gg/emojis/93659-pepemoneyrain.gif',
    'https://cdn3.emoji.gg/emojis/50724-hart.png',
    'https://cdn3.emoji.gg/emojis/9812-pepejam2.gif',
    'https://cdn3.emoji.gg/emojis/52925-pepedaddy.gif',
    'https://cdn3.emoji.gg/emojis/89315-boba.png',
    'https://cdn3.emoji.gg/emojis/48506-joker.png',
    'https://cdn3.emoji.gg/emojis/15891-yamero.png',
    'https://cdn3.emoji.gg/emojis/41744-stare.png',
    'https://cdn3.emoji.gg/emojis/11998-peepoavenger.png',
    'https://cdn3.emoji.gg/emojis/26866-pepemcbed.gif',
    'https://cdn3.emoji.gg/emojis/35745-pepejetski.gif',
    'https://cdn3.emoji.gg/emojis/4192-pepeminecraft.png',
    'https://cdn3.emoji.gg/emojis/20497-pepe-closedeyes.png',
    'https://cdn3.emoji.gg/emojis/98807-pepecringeeffect.gif',
    'https://cdn3.emoji.gg/emojis/26866-pepeclapxmas.gif',
    'https://cdn3.emoji.gg/emojis/52925-impostervent.png',
    'https://cdn3.emoji.gg/emojis/77653-pepe-bdayparty.png',
    'https://cdn3.emoji.gg/emojis/11998-pepe-king.png',
    'https://cdn3.emoji.gg/emojis/20497-pepe-angrytype.gif',
    'https://cdn3.emoji.gg/emojis/15201-pepe-bearblink.gif',
    'https://cdn3.emoji.gg/emojis/95735-pepe-toxic.gif',
    'https://cdn3.emoji.gg/emojis/61444-pepe-hyperspeed.gif',
    'https://cdn3.emoji.gg/emojis/63618-pepe-oswordnshield.png',
    'https://cdn3.emoji.gg/emojis/63618-pepe-robber.gif',
    'https://cdn3.emoji.gg/emojis/24561-pepe-vanish.gif',
    'https://cdn3.emoji.gg/emojis/26924-dogehug.gif',
    'https://cdn3.emoji.gg/emojis/32868-pepe-lmfaoooo.gif',
    'https://cdn3.emoji.gg/emojis/24714-pepe-bellyache.gif',
    'https://cdn3.emoji.gg/emojis/33293-pepe-noob.gif',
    'https://cdn3.emoji.gg/emojis/98260-pepe-loving.gif',
    'https://cdn3.emoji.gg/emojis/18075-pepe-cheer.gif',
    'https://cdn3.emoji.gg/emojis/13703-pepe-tricycle.gif',
    'https://cdn3.emoji.gg/emojis/18075-pepe-rockstar.gif',
    'https://cdn3.emoji.gg/emojis/3439-pepe-blushy.png',
    'https://cdn3.emoji.gg/emojis/50320-pepe-roastedpepe.gif',
    'https://cdn3.emoji.gg/emojis/84899-pepe-madpuke.gif',
    'https://cdn3.emoji.gg/emojis/67734-binary.gif',
    'https://cdn3.emoji.gg/emojis/20610-sleep.gif',
    'https://cdn3.emoji.gg/emojis/96012-pepe-toilet.gif',
    'https://cdn3.emoji.gg/emojis/97953-yeehaw.gif',
    'https://cdn3.emoji.gg/emojis/1045-pepeboosting.gif',
    'https://cdn3.emoji.gg/emojis/6906-pepe-cry.gif',
    'https://cdn3.emoji.gg/emojis/47945-pepe-hehe.gif',
    'https://cdn3.emoji.gg/emojis/80202-pepe-run.gif',
    'https://cdn3.emoji.gg/emojis/31176-rainbowglasses.gif'
];

// Store the 3 randomly selected avatars
let randomPepeAvatars = [];

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

// Function to randomly select 3 Pepe avatars
function getRandomPepes() {
    const shuffled = [...allPepeAvatars].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
}

// Function to populate avatar grid with 3 random Pepes
function loadRandomPepeAvatars() {
    randomPepeAvatars = getRandomPepes();
    const avatarGrid = document.getElementById('avatar-grid');
    avatarGrid.innerHTML = '';

    randomPepeAvatars.forEach(pepeUrl => {
        const avatarOption = document.createElement('div');
        avatarOption.className = 'avatar-option';
        avatarOption.dataset.avatar = pepeUrl;

        const img = document.createElement('img');
        img.src = pepeUrl;
        img.alt = 'Pepe avatar';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';

        avatarOption.appendChild(img);
        avatarGrid.appendChild(avatarOption);
    });
}

// Show join screen
function showJoinScreen() {
    showScreen('join-screen');
    loadRandomPepeAvatars();
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

        // Check if avatar is an image URL or emoji
        let avatarDisplay = '';
        if (player.avatar.startsWith('http')) {
            avatarDisplay = `<img src="${player.avatar}" alt="avatar" style="width: 80px; height: 80px; object-fit: contain;">`;
        } else {
            avatarDisplay = player.avatar;
        }

        playerCard.innerHTML = `
            <div class="player-avatar">${avatarDisplay}</div>
            <div class="player-name">${player.name}</div>
            ${voteDisplay}
        `;

        playersList.appendChild(playerCard);
    });

    // Update reveal button state
    const revealBtn = document.getElementById('reveal-btn');
    if (state.revealed) {
        revealBtn.textContent = 'Cards Revealed';
        revealBtn.disabled = true;
    } else {
        revealBtn.textContent = 'Reveal Cards';
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

    // Avatar selection - using event delegation since avatars are loaded dynamically
    document.getElementById('avatar-grid').addEventListener('click', (e) => {
        const avatarOption = e.target.closest('.avatar-option');
        if (avatarOption) {
            document.querySelectorAll('.avatar-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            avatarOption.classList.add('selected');
            selectedAvatar = avatarOption.dataset.avatar;
            updateJoinButton();
        }
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
            btn.textContent = '✅ Copied!';
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

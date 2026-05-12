const mario = document.querySelector('.mario');
const bowser = document.querySelector('.bowser');
const peach = document.querySelector('.peach');
const pipe = document.querySelector('.pipe');
const ghost = document.getElementById('ghost');
const jogo = document.querySelector('.jogo');

let gameOver = false;
let currentPhase = 1; // 1: bowser, 2: ghost

// controle para não ficar pulando infinitamente
let bowserTriggered = false;
let peachTriggered = false;
let ghostTriggered = false;

// flag para bowser pulando
let isBowserJumping = false;
let isGhostJumping = false;

// =========================
// SCORE + TEMPO
// =========================
let score = 0;
let jumpsOverPipe = 0;
let shotCount = 0;
let jumpCount = 0;
let countedThisPipe = false;
let time = 0;

// posição do mario
let marioLeft = 310;
// let marioX = 310; // removido, fixo

// barra de vida do bowser
let bowserHealth = 500;
const healthEl = document.getElementById('bowser-health');
healthEl.style.setProperty('--health', (bowserHealth / 500 * 100) + '%');

// barra de vida do fantasma
let ghostHealth = 600; // mais vida para dificuldade

// fogos disparados
let fires = [];
let canShoot = true;
const fireCooldown = 0;

const stopMusic = () => {
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }
};

// contador de tempo
setInterval(() => {
    if (!gameOver) {
        time++;
        const timeEl = document.getElementById("time");
        if (timeEl) timeEl.innerText = "Tempo: " + time + "s";
    }
}, 1000);

// =========================
// PULO MARIO
// =========================
const marioJump = () => {
    if (gameOver) return;

    if (!mario.classList.contains('mario-jump')) {
        mario.classList.add('mario-jump');
        jumpCount += 1;

        setTimeout(() => {
            mario.classList.remove('mario-jump');
        }, 500);
    }
};

// =========================
// TIRO DE FOGO
// =========================
const shootFire = () => {
    if (gameOver || !canShoot) return;
    canShoot = false;
    shotCount += 1;
    setTimeout(() => canShoot = true, fireCooldown);

    const fire = document.createElement('div');
    fire.classList.add('fire');
    fire.style.left = (310 + 100) + 'px'; // posição fixa
    fire.style.bottom = '40px';
    document.querySelector('.jogo').appendChild(fire);
    fires.push({element: fire, x: 410});
};

// =========================
// PULO BOWSER
// =========================
const bowserJump = () => {
    if (!bowser.classList.contains('bowser-jump')) {
        isBowserJumping = true;
        bowser.classList.add('bowser-jump');

        setTimeout(() => {
            bowser.classList.remove('bowser-jump');
            isBowserJumping = false;
        }, 500);
    }
};

// =========================
// PULO GHOST
// =========================
const ghostJump = () => {
    if (!ghost.classList.contains('bowser-jump')) {
        isGhostJumping = true;
        ghost.classList.add('bowser-jump');

        setTimeout(() => {
            ghost.classList.remove('bowser-jump');
            isGhostJumping = false;
        }, 500);
    }
};
const peachJump = () => {
    if (!peach.classList.contains('peach-jump')) {
        peach.classList.add('peach-jump');

        setTimeout(() => {
            peach.classList.remove('peach-jump');
        }, 500);
    }
};

// =========================
// BOWSER CAI DA TELA
// =========================
const bowserFall = () => {
    gameOver = true;
    healthEl.style.display = 'none'; // esconder barra de vida
    pipe.style.animation = 'none';
    pipe.style.display = 'none';
    fires.forEach(fire => fire.element.remove());
    fires = [];
    stopMusic();
    document.getElementById('win-music').play();
    const interval = setInterval(() => {
        let currentBottom = parseInt(getComputedStyle(bowser).bottom.replace('px', ''));
        if (currentBottom > -300) { // até sair da tela
            bowser.style.bottom = (currentBottom - 10) + 'px';
        } else {
            clearInterval(interval);
            bowser.style.display = 'none'; // esconder
            startVictoryApproach();
        }
    }, 50);
};

// =========================
// GHOST CAI DA TELA
// =========================
const ghostFall = () => {
    gameOver = true;
    healthEl.style.display = 'none'; // esconder barra de vida
    pipe.style.animation = 'none';
    pipe.style.display = 'none';
    fires.forEach(fire => fire.element.remove());
    fires = [];
    stopMusic();
    document.getElementById('win-music').play();
    const interval = setInterval(() => {
        let currentBottom = parseInt(getComputedStyle(ghost).bottom.replace('px', ''));
        if (currentBottom > -300) { // até sair da tela
            ghost.style.bottom = (currentBottom - 10) + 'px';
        } else {
            clearInterval(interval);
            ghost.style.display = 'none'; // esconder
            startVictoryApproach();
        }
    }, 50);
};
const showWinScreen = () => {
    const finalBanner = document.getElementById('final-victory-banner');
    if (finalBanner) {
        finalBanner.style.display = currentPhase === 2 ? 'block' : 'none';
    }
    document.getElementById('win-image').style.display = 'block';
    document.getElementById('win-screen').style.display = 'flex';
    document.getElementById('final-score').innerText = score;
    document.getElementById('final-time').innerText = time + 's';
    document.getElementById('final-shots').innerText = shotCount;
    document.getElementById('final-jumps').innerText = jumpCount;
    document.getElementById('next-phase-button').style.display = currentPhase === 1 ? 'inline-block' : 'none';
    document.getElementById('play-again-button').style.display = 'inline-block';
    clearInterval(loopId);
};

const startNextPhase = () => {
    currentPhase = 2;
    document.body.classList.add('mansion-body');
    jogo.classList.add('mansion-bg'); // mudar background
    const tree = document.getElementById('tree');
    if (tree) tree.style.display = 'block';
    ghost.style.display = 'block'; // mostrar fantasma
    ghost.style.right = '350px';
    ghost.style.bottom = '0px';
    ghost.style.transform = 'scaleX(-1)';
    peach.style.transform = 'scaleX(-1)';
    peach.style.display = 'block';
    peach.style.right = '120px';
    mario.style.display = 'block';
    mario.src = 'Images/mario-walking.gif';
    mario.style.width = '100px';
    marioLeft = 310;
    mario.style.marginLeft = '310px';
    pipe.style.display = 'block'; // mostrar pipe novamente
    pipe.style.left = '';
    pipe.style.right = '-80px';
    pipe.style.animation = 'pipe-animation 1.5s linear infinite'; // mais rápido
    healthEl.style.display = 'block'; // mostrar barra de vida para fantasma
    healthEl.style.setProperty('--health', (ghostHealth / 600 * 100) + '%');
    // resetar triggers
    bowserTriggered = false;
    peachTriggered = false;
    ghostTriggered = false;
    countedThisPipe = false;
    document.getElementById('win-screen').style.display = 'none';
    document.getElementById('win-image').style.display = 'none';
    document.getElementById('final-victory-banner').style.display = 'none';
    gameOver = false;
    startGameLoop();
};
const startVictoryApproach = () => {
    peach.style.transform = 'scaleX(1)'; // espelhar

    const interval = setInterval(() => {
        let currentRight = parseInt(getComputedStyle(peach).right.replace('px', ''));
        let peachX = window.innerWidth - currentRight - 130; // posição x real da peach
        let peachRect = peach.getBoundingClientRect();
        let marioRect = mario.getBoundingClientRect();

        if (marioLeft < peachX - 60) {
            marioLeft += 3.5;
            mario.style.marginLeft = marioLeft + 'px';
        }

        if (peachX > marioLeft + 60) {
            peach.style.right = (currentRight + 6) + 'px';
        }

        marioRect = mario.getBoundingClientRect();
        peachRect = peach.getBoundingClientRect();

        if (marioRect.right >= peachRect.left) {
            clearInterval(interval);
            document.getElementById('win-image').style.display = 'block';
            const victoryVoice = document.getElementById('victory-voice');
            const showWin = () => {
                showWinScreen();
            };

            if (victoryVoice) {
                victoryVoice.pause();
                victoryVoice.currentTime = 0;
                victoryVoice.play().catch(() => {});
                setTimeout(showWin, 3000);
            } else {
                setTimeout(showWin, 3000);
            }
        }
    }, 30);
};

// =========================
// LOOP PRINCIPAL
// =========================
let loopId;
const startGameLoop = () => {
    loopId = setInterval(() => {

        if (gameOver) return;

    const pipePosition = pipe.offsetLeft;

    const marioPosition = +window.getComputedStyle(mario)
        .bottom.replace('px', '');

    const bowserPositionX = bowser.offsetLeft;
    const peachPositionX = peach.offsetLeft;
    const ghostPositionX = ghost.offsetLeft;

    // atualizar barra de vida posição
    if (currentPhase === 1) {
        const bowserRect = bowser.getBoundingClientRect();
        healthEl.style.top = (bowserRect.top - 30) + 'px';
        healthEl.style.left = (bowserRect.left + bowserRect.width / 2 - 100) + 'px';
    } else if (currentPhase === 2) {
        const ghostRect = ghost.getBoundingClientRect();
        healthEl.style.top = (ghostRect.top - 30) + 'px';
        healthEl.style.left = (ghostRect.left + ghostRect.width / 2 - 100) + 'px';
    }

    // =========================
    // DISTÂNCIAS
    // =========================
    const distBowser = pipePosition - bowserPositionX;
    const distPeach = pipePosition - peachPositionX;
    const distGhost = pipePosition - ghostPositionX;

    // =========================
    // BOWSER PULA
    // =========================
    if (distBowser < 250 && distBowser > 0 && !bowserTriggered) {
        bowserTriggered = true;
        bowserJump();
    }

    if (pipePosition > 500) {
        bowserTriggered = false;
    }

    // =========================
    // GHOST PULA
    // =========================
    if (currentPhase === 2 && distGhost < 250 && distGhost > 0 && !ghostTriggered) {
        ghostTriggered = true;
        ghostJump();
    }

    if (pipePosition > 500) {
        ghostTriggered = false;
    }

    // =========================
    // SCORE AO PULAR CANO
    // =========================
    if (pipePosition < 250 && !countedThisPipe && marioPosition > 95) {

        countedThisPipe = true;
        score += 10;
        jumpsOverPipe++;

        // bônus a cada 5
        if (jumpsOverPipe % 5 === 0) {
            score += 50;

        }

        const scoreEl = document.getElementById("score");
        if (scoreEl) scoreEl.innerText = "Score: " + score;
    }

    if (pipePosition > 500) {
        countedThisPipe = false;
    }

    // =========================
    // MOVIMENTO DOS FOGOS
    // =========================
    fires.forEach((fire, index) => {
        fire.x += 10;
        fire.element.style.left = fire.x + 'px';

        // verificar colisão com bowser ou ghost
        let enemyRect;
        if (currentPhase === 1) {
            enemyRect = bowser.getBoundingClientRect();
        } else if (currentPhase === 2) {
            enemyRect = ghost.getBoundingClientRect();
        }
        const fireRect = fire.element.getBoundingClientRect();

        if (enemyRect && fireRect.right > enemyRect.left && fireRect.left < enemyRect.right &&
            fireRect.bottom > enemyRect.top && fireRect.top < enemyRect.bottom && 
            ((currentPhase === 1 && !isBowserJumping) || (currentPhase === 2 && !isGhostJumping))) {
            // hit
            if (currentPhase === 1) {
                bowserHealth -= 20;
                if (bowserHealth < 0) bowserHealth = 0;
                healthEl.style.setProperty('--health', (bowserHealth / 500 * 100) + '%');
            } else if (currentPhase === 2) {
                ghostHealth -= 20;
                if (ghostHealth < 0) ghostHealth = 0;
                healthEl.style.setProperty('--health', (ghostHealth / 600 * 100) + '%');
            }
            fire.element.remove();
            fires.splice(index, 1);
        }

        // remover se sair da tela
        if (fire.x > window.innerWidth) {
            fire.element.remove();
            fires.splice(index, 1);
        }
    });

    if ((currentPhase === 1 && bowserHealth <= 0) || (currentPhase === 2 && ghostHealth <= 0)) {
        if (currentPhase === 1) {
            bowserFall();
        } else if (currentPhase === 2) {
            ghostFall();
        }
    }

    // =========================
    // COLISÃO MARIO COM CANO
    // =========================
    if (!gameOver && pipePosition <= 330 && pipePosition >= 230 && marioPosition <= 90) {
        gameOver = true;

        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;

        mario.src = 'Images/game-over.png';
        mario.style.width = '65px';

        document.getElementById('game-over-screen').style.display = 'flex';
        document.getElementById('gameover-music').play();
        stopMusic();

        clearInterval(loopId);
    }

}, 10);
};

startGameLoop();

// =========================
// CONTROLE
// =========================
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        marioJump();
    }
    if (e.code === 'KeyW') {
        shootFire();
    }
});

window.addEventListener('load', () => {
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) {
        bgMusic.volume = 0.35;
        bgMusic.play().catch(() => {});
    }
});

// botões
document.getElementById('restart-button').addEventListener('click', () => {
    location.reload();
});

document.getElementById('play-again-button').addEventListener('click', () => {
    location.reload();
});

document.getElementById('next-phase-button').addEventListener('click', () => {
    document.getElementById('win-screen').style.display = 'none';
    startNextPhase();
});
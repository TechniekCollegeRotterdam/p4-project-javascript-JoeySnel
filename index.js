const canvas = document.querySelector('canvas')

// geef aan dat het een 2d game wordt
const c = canvas.getContext('2d')

// canvas een hoogte en breedte geven
canvas.width = 1024
canvas.height = 576

//  canvas creëren
c.fillRect(0, 0, canvas.width, canvas.height)

// kracht van zwaartekracht
const gravity = 0.7

// achtergrond
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

// achtergrond prop met animatie
const shop = new Sprite({
    position: {
        x: 630,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

// player 1's waardes
const player = new Fighter({
    // spawn positie
    position: {
        x: 112,
        y: 230
    },
    // eerste bewegingssnelheid 
    velocity: {
        x: 0,
        y: 0
    },
    // zorg ervoor dat de speler de juiste kant op kijkt
    offset: {
        x: 0,
        y: 0
    },
    // idle sprite wanneer player spawnt
    imageSrc: './img/samuraiMack/Idle.png',
    scale: 2.5,
    framesMax: 8,
    offset: {
        x: 215,
        y: 155
    },
    // Alle sprites
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    // hit box
    attackBox: {
        offset: {
            x: 50,
            y: 50
        },
        width: 207,
        height: 50
    },
    // aanvalschade
    attackDamage: 10
})

// player 2
const enemy = new Fighter({
    position: {
        x: 862,
        y: 230
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    scale: 2.5,
    framesMax: 4,
    offset: {
        x: 215,
        y: 170
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit - white silhouette.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -173,
            y: 50
        },
        width: 173,
        height: 50
    },
    attackDamage: 5
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

// start timer functie
decreaseTimer()

// animatie functie
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -7
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 7
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    // jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -7
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 7
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    // jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // detect for collision & enemy gets hit
    if (rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) && player.isAttacking && player.framesCurrent === 4) {
        audio.playerWhoosh.play()
        damage = player.attackDamage
        enemy.takeHit()
        player.isAttacking = false

        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        audio.playerWhoosh.play()
        player.isAttacking = false
    }

    // detect for collision & player gets hit
    if (rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) && enemy.isAttacking && enemy.framesCurrent === 2) {
        audio.kenjiWhoosh.play()
        damage = enemy.attackDamage
        player.takeHit()
        enemy.isAttacking = false

        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

    // if player 2 misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        audio.kenjiWhoosh.play()
        enemy.isAttacking = false
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({
            player,
            enemy,
            timerId
        })
    }
}

// start animate functie
animate()

// record keydown input player 1
window.addEventListener('keydown', (event) => {
    if (!gameOver) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                if (player.jumpReady) {
                    player.velocity.y = -17
                }
                break
            case ' ':
                player.attack()
                break
        }
    }
    // record keydown input player 2
    if (!gameOver) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                if (enemy.jumpReady) {
                    enemy.velocity.y = -17
                }
                break
            case 'ArrowDown':
                enemy.attack()
                break
        }
    }
})
// record keyup input player 1
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        // player1
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break

            // record keyup input player 2
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})

let keyDown = false

// toestemming krijgen voor het spelen van audio door gebruik van een keydown eventlistener
addEventListener('keydown', () => {
    if (!keyDown) {
        audio.map.play()
        audio.mapAmbience.play()
        keyDown = true
    }
})
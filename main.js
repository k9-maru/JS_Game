const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const characterWidth = 50;
const characterHeight = 150;

const gravity = 0.8;
const speed = 8;
//const friction = 0.01;

const hpBarWidth = 100;
const hpBarHeight = 20;
const maxHP = 100;

const bgi = document.getElementById('bg');
const samuraiMackSprite = {
    idle: {
        i: document.getElementById('s_idle'),
        frame: 0,
        frames: 8,
        xScale: -175,
        yScale: -165
    }
}
const kenjiSprite = {
    idle: {
        i: document.getElementById('k_idle'),
        frame: 0,
        frames: 4,
        xScale: -175,
        yScale: -175
    }
}

const imgScale = 2;

class Sprite {
    constructor(name, position, velocity, atkDir, img) {
        this.name = name;
        this.position = position;
        this.velocity = velocity;
        this.width = characterWidth;
        this.height = characterHeight;
        this.atkBox = {
            position: this.position,
            width: this.width * 1.5,
            height: this.height / 3,
            color: 'red',
            atkDir
        };
        this.atk = false;
        this.atkDmg = 10;
        this.hp = {
            position: this.position,
            point: maxHP,
            width: maxHP / 2,
            height: 20,
            color: 'green'
        };
        this.img = img;
    }

    appear() {
        this.animate();

        c.fillStyle = this.hp.color;
        c.fillRect(this.hp.position.x, this.hp.position.y - 50, this.hp.width, this.hp.height);
    }

    animate() {
        c.drawImage(this.img.idle.i, 200 * this.img.idle.frame, 0, 200, 200, this.position.x + this.img.idle.xScale, this.position.y + this.img.idle.yScale, 200 * imgScale, 200 * imgScale);
        if (this.img.idle.frame == this.img.idle.frames - 1) this.img.idle.frame = 0;
        else {
            this.img.idle.frame += 1;
        }
    }

    beAtk(dmg) {
        if (dmg >= this.hp.point + 10) return;
        this.hp.point -= dmg / 2;
        this.hp.width = this.hp.point / 2;
        this.appear();
    }

    edgeTouch() {
        if (this.position.x - 20 <= 0) {
            this.position.x = 20;
        } else if (this.position.x + this.width + 20 >= canvas.width) {
            this.position.x = canvas.width - this.width - 20;
        }

        if (this.position.y + this.height + 20 >= canvas.height) {
            this.position.y = canvas.height - this.height - 20;
        }
    }

    attack(sprite) {
        if (this.atkBox.position.x + this.atkBox.width > sprite.position.x &&
            this.atkBox.position.x < sprite.position.x + sprite.width &&
            this.atkBox.position.y + this.atkBox.height > sprite.atkBox.position.y &&
            this.atkBox.position.y < sprite.atkBox.position.y + sprite.atkBox.height &&
            this.atk) {
            console.log(this.name + " atk " + sprite.name);
            sprite.beAtk(this.atkDmg);
            console.log(sprite.hp.point);
            this.atk = false;
        }

    }

    update() {
        this.velocity.y += gravity;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.edgeTouch();
        this.appear();
    }
}

const player = new Sprite(
    'player', {
        x: 50,
        y: 50
    }, {
        x: 0,
        y: 0
    }, {
        x: 0,
        y: 0
    },
    samuraiMackSprite
);

const enemy = new Sprite(
    'enemy', {
        x: canvas.width - 50 - characterWidth,
        y: 50
    }, {
        x: 0,
        y: 0
    }, {
        x: characterWidth * 0.5,
        y: 0
    }, kenjiSprite
);

function loop() {
    window.requestAnimationFrame(loop);
    c.drawImage(bgi, 0, 0);

    player.update();
    player.attack(enemy);

    enemy.update();
    enemy.attack(player);
}

function control() {
    // player
    window.addEventListener('keydown', key => {
        switch (key.code) {
            case 'KeyA':
                player.velocity.x = -speed;
                break;
            case 'KeyD':
                player.velocity.x = speed;
                break;
            case 'KeyW':
                if (player.position.y < canvas.height - player.height - 20) return;
                player.velocity.y = -2 * speed;
                break;
            case 'Space':
                player.atk = true;
                break;
        }
    })

    window.addEventListener('keyup', key => {
        switch (key.code) {
            case 'KeyA':
            case 'KeyD':
                player.velocity.x = 0;
                break;
            case 'KeyW':
                break;
            case 'Space':
                player.atk = false;
                break;
        }
    })


    // enemy
    window.addEventListener('keydown', key => {
        switch (key.code) {
            case 'ArrowLeft':
                enemy.velocity.x = -speed;
                break;
            case 'ArrowRight':
                enemy.velocity.x = speed;
                break;
            case 'ArrowUp':
                if (enemy.position.y < canvas.height - enemy.height - 20) return;
                enemy.velocity.y = -2 * speed;
                break;
            case 'Numpad0':
                enemy.atk = true;
                break;
        }
    })

    window.addEventListener('keyup', key => {
        switch (key.code) {
            case 'ArrowLeft':
            case 'ArrowRight':
                enemy.velocity.x = 0;
                break;
            case 'ArrowUp':
                break;
            case 'Numpad0':
                enemy.atk = false;
                break;
        }
    })
}

function startGame() {
    if (player.hp.point == 0 || enemy.hp.point == 0) return;
    else {
        control();
        loop();
    }
}

startGame();
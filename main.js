let Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite;
    Graphics = PIXI.Graphics;

let app = new Application({
        width: 1024,
        height: 512,
        antialias: true,
        transparent: false,
        resolution: 1
    }
);

let bgContainer = new PIXI.Container();
bgContainer.zIndex = 0;

let unitContainer = new PIXI.Container();
unitContainer.zIndex = 1;

let particleContainer = new PIXI.Container();
particleContainer.zIndex = 2;

let far;
let mid;
let near;

let tick = 0;
let mousePosition = app.renderer.plugins.interaction.mouse.global;
let player;
let projectiles = [];
let enemies = [];
let explosionEmitters = [];
let elapsed = Date.now();
let now;

document.body.appendChild(app.view);

loader
    .add("assets/sprites/A5.png")
    .add("assets/sprites/A1.png")
    .load(setup);

function setup() {
    app.stage.interactive = true;

    app.stage.addChild(bgContainer);
    app.stage.addChild(unitContainer);
    app.stage.addChild(particleContainer);

    setupBackground();

    player = new Sprite(resources["assets/sprites/A5.png"].texture);
    player.scale.set(0.5);
    player.x = app.renderer.view.width/2 - player.width/2;
    player.y = app.renderer.view.height - player.height;
    player.movementSpeed = 10;
    player.fireRate = 5;

    unitContainer.addChild(player);

    app.ticker.add(delta => gameLoop(delta));
}

function setupBackground() {
    let farTexture = PIXI.Texture.from("assets/textures/28884-8-galaxy-photos.png");
    far = new PIXI.TilingSprite(farTexture, 640, 432);
    far.position.x = 0;
    far.position.y = 0;
    far.scale.set(1.5);
    bgContainer.addChild(far);

    let midTexture = PIXI.Texture.from("assets/textures/Parallax60.png");
    midTexture.alpha = 2;
    mid = new PIXI.TilingSprite(midTexture, 500, 500);
    mid.position.x = 0;
    mid.position.y = 0;
    mid.scale.set(2.5);
    bgContainer.addChild(mid);

    let nearTexture = PIXI.Texture.from("assets/textures/Parallax60.png");
    near = new PIXI.TilingSprite(nearTexture, 500, 500);
    near.position.x = 0;
    near.position.y = 0;
    near.scale.set(3);
    bgContainer.addChild(near);
}

function gameLoop(delta){
    now = Date.now();
    tick += 1 * delta;

    far.tilePosition.y += 0.2 * delta;
    mid.tilePosition.y += 0.2 * delta;
    near.tilePosition.y += 0.3 * delta;

    // housekeep emitters
    if (explosionEmitters.length > 100) {
        explosionEmitters = explosionEmitters.slice(50);
    }

    for (let i = 0; i < explosionEmitters.length; i++) {
        explosionEmitters[i].update((now - elapsed) * 0.001);
    }

    positionProjectiles(projectiles, delta);
    positionPlayer(player, delta);
    positionEnemies(enemies, delta);

    spawnEnemies(enemies);
    firePlayer(player);

    checkForCollisions();
    elapsed = now;
}

function removeProjectile(index) {
    unitContainer.removeChild(projectiles[index]);
    projectiles[index].emitter.destroy();
    projectiles.splice(index, 1);
}

function removeEnemy(index) {
    unitContainer.removeChild(enemies[index]);
    enemies.splice(index, 1);
}

function intersect(a, b) {
    return !(b.x + b.width > a.x + a.width||
        b.x + b.width < a.x ||
        b.y > a.y + a.height ||
        b.y + b.height < a.y);
}

function checkForCollisions() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        for (let j = projectiles.length - 1; j >= 0; j--) {
            if (intersect(enemies[i], projectiles[j])) {
                let explosionEmitter = setupEmitter(emitterConfigExplosion);
                explosionEmitter.updateSpawnPos(enemies[i].x + enemies[i].width/2, enemies[i].y + enemies[i].height/2);
                explosionEmitter.emit = true;
                explosionEmitters.push(explosionEmitter);
                removeEnemy(i);
                removeProjectile(j);
                break;
            }
        }
    }
}

function spawnEnemies(enemies) {
    if (Math.round(tick) % 10 == 0) {
        let enemy = new Sprite(resources["assets/sprites/A1.png"].texture);
        enemy.scale.set(0.5);

        enemy.x = Math.random() * (app.renderer.view.width - enemy.width);
        enemy.y = -enemy.height;

        enemy.vy = 3;
        enemy.vx = Math.random() * 0.6 - 0.3;

        unitContainer.addChild(enemy);

        enemies.push(enemy);
    }
}

function firePlayer(player) {
    if (Math.round(tick) % player.fireRate == 0) {
        let projectile1;
        projectile1 = new Graphics();
        projectile1.beginFill(0x23f206);
        projectile1.drawCircle(0, 0, 2);
        projectile1.endFill();
        projectile1.x = player.x + player.width/2 - 14;
        projectile1.y = player.y - player.height/2;
        projectile1.vy = -5;
        projectile1.vx = 0;
        projectile1.emitter = setupEmitter(emitterConfigsmokeTrail);
        projectiles.push(projectile1);
        unitContainer.addChild(projectile1);

        let projectile2 = new Graphics();
        projectile2.beginFill(0x23f206);
        projectile2.drawCircle(0, 0, 2);
        projectile2.endFill();
        projectile2.x = player.x + player.width/2 + 14;
        projectile2.y = player.y - player.height/2;
        projectile2.vy = -5;
        projectile2.vx = 0;
        projectile2.emitter = setupEmitter(emitterConfigsmokeTrail);
        projectiles.push(projectile2);
        unitContainer.addChild(projectile2);
    }
}

function positionEnemies(enemies, delta) {
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].y > app.renderer.view.height) {
            removeEnemy(i);
        } else {
            enemies[i].x = enemies[i].x + enemies[i].vx * delta;
            enemies[i].y = enemies[i].y + enemies[i].vy * delta;
        }
    }
}

function positionProjectiles(projectiles, delta) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        projectiles[i].emitter.update((now - elapsed) * 0.001);
        if (projectiles[i].y  < -200) {
            removeProjectile(i);
        } else {
            projectiles[i].x = projectiles[i].x + projectiles[i].vx * delta;
            projectiles[i].y = projectiles[i].y + projectiles[i].vy * delta;

            projectiles[i].emitter.updateOwnerPos(projectiles[i].x, projectiles[i].y);
            projectiles[i].emitter.emit = true;
        }
    }
}

function positionPlayer(player, delta) {
    let pX = player.x + player.width/2;
    let pY = player.y + player.height/2;

    // To prevent costly calculations in case the player is already very close to the cursor, start with a check
    if (Math.abs(pX - mousePosition.x) * delta < player.movementSpeed && Math.abs(pY - mousePosition.y) * delta < player.movementSpeed) {
        player.position.set(mousePosition.x - player.width/2, mousePosition.y - player.height/2);
    } else {

        let distanceX = mousePosition.x - (pX);
        let distanceY = mousePosition.y - (pY);

        // calculate the velocity vector length
        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // normalize velocity vector length
        player.vx = distanceX / distance;
        player.vy = distanceY / distance;

        // apply movement speed and delta consideration
        player.vx = player.vx * delta * player.movementSpeed;
        player.vy = player.vy * delta * player.movementSpeed;

        player.position.set(player.x + player.vx, player.y + player.vy);
    }

    // Enforce boundaries
    if (player.x + player.width > app.renderer.view.width) {
        player.x = app.renderer.view.width - player.width;
    }

    if (player.y + player.height > app.renderer.view.height) {
        player.y = app.renderer.view.height - player.height;
    }

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.y < 0) {
        player.y = 0;
    }
}

function setupEmitter(config) {
    let emitter = new PIXI.particles.Emitter(particleContainer, [PIXI.Texture.from('assets/sprites/particle.png')], config);
    emitter.emit = false;
    return emitter;
}
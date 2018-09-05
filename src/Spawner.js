class Spawner {
    constructor (pixiApp, objectStore) {
        this.pixiApp = pixiApp;
        this.objectStore = objectStore;
        this.enemyColors = ["0xCB3301", "0xFF0066", "0xFF6666", "0xFEFF99", "0xFFFF67", "0xCCFF66", "0x99FE00", "0xEC8EED", "0xFF99CB", "0xFE349A", "0xCC99FE", "0x6599FF", "0x03CDFF", "0xFF0000", "0xFFFF00", "0x00FF00", "0x00FFFF", "0x0000FF", "0xFF00FF"];
    }

    prepareEnemy() {

        return enemy;
    }

    spawnEnemyWave(wave) {
        let amountSpawned = 0;

        if (wave % 1000 === 0) {
            this.spawnBoss(wave, 1250);
            amountSpawned++;
        } else if (wave % 100 === 0) {
            this.spawnBoss(wave, 250);
            amountSpawned++;
        }else if (wave % 10 === 0) {
            this.spawnBoss(wave, 50);
            amountSpawned++;
        } else {
            let spawnAmount = Math.ceil(0.2 * wave + 4);
            if (spawnAmount > 25) {
                spawnAmount = 25;
            }
            amountSpawned = 0;
            for (let i = 0; i < spawnAmount; i++) {
                this.spawnRandomEnemy(wave);
                amountSpawned++;
            }
        }

        return amountSpawned;
    }

    spawnRandomEnemy(wave) {
        let enemyContainer = this.objectStore.get('enemyContainer');
        let enemy = new Enemy(PIXI.Loader.shared.resources["assets/sprites/A1.png"].texture, 10);
        enemy.baseMovementSpeed = 2;
        enemy.scale.set(0.4);
        enemy.anchor.set(0.5, 0.5);
        enemy.isBoss = false;

        enemyContainer.addChild(enemy);

        // Randomize positioning
        enemy.x = Math.random() * (this.pixiApp.screen.width/this.pixiApp.stage.scale.x - enemy.width);
        enemy.y = Math.random() * -500 - enemy.height;
        enemy.position.set(enemy.x, enemy.y);

        // Randomize movement vector
        let vx = Math.random() - 0.5;
        let vy = 1;

        // calculate the velocity vector length
        let distance = Math.sqrt( vx*vx + vy*vy);

        vx /= distance;
        vy /= distance;

        enemy.vxBase = enemy.vx = vx * enemy.baseMovementSpeed;
        enemy.vyBase = enemy.vy = vy * enemy.baseMovementSpeed;
        enemy.rotation = Math.atan2(vy, vx) - Math.PI/2;
        // Initialize stats
        enemy.defaultShotDelay = 0;
        enemy.bossShot1Delay = 0;
        enemy.bossShot2Delay = 0;
        enemy.maxHealth = Math.floor(10 * Math.pow(arcInc.growth, wave));
        enemy.currentHealth = enemy.maxHealth;
        enemy.credits = Math.floor(10 * Math.pow(arcInc.growth, wave));
        enemy.damage = Math.floor(5 * Math.pow(arcInc.growth, wave));

        enemy.burnDamage = 0;

        enemy.tint = this.enemyColors[Math.floor(Math.random()*this.enemyColors.length)];
        enemy.wave = wave;
    }

    spawnBoss(wave, scalingFactor) {
        let enemyContainer = this.objectStore.get('enemyContainer');

        let enemy = new BossEnemy(PIXI.Loader.shared.resources["assets/sprites/boss.png"].texture, 10 * scalingFactor);
        enemy.anchor.set(0.5, 0.5);
        enemy.isBoss = true;

        enemy.baseMovementSpeed = 2;
        enemy.scale.set(0.8);
        enemy.cascadeAngle = 0;

        enemyContainer.addChild(enemy);

        // Initialize stats
        enemy.maxHealth = Math.floor(10 * Math.pow(arcInc.growth, wave) * scalingFactor);
        enemy.currentHealth = enemy.maxHealth;
        enemy.credits = Math.floor(50 * Math.pow(arcInc.growth, wave) * scalingFactor);
        enemy.damage = Math.floor(Math.pow(arcInc.growth, wave));

        enemy.x = (arcInc.pixiApp.screen.width / arcInc.pixiApp.stage.scale.x) / 2;
        enemy.y = -enemy.height/2;

        enemy.vx = 0;
        enemy.vy = 1;

        enemy.burnDamage = 0;

        enemy.wave = wave;
    }

    spawnPlayerProjectile(x, y, vx, vy, damage, original) {
        return new PlayerProjectile(PIXI.Loader.shared.resources["assets/sprites/Bullet.png"].texture, x, y, vx, vy, damage, original);
    }

    spawnEnemyProjectile(x, y, vx, vy, tint, damage, spriteId) {
        if (spriteId === undefined) {
            spriteId = 2;
        }


        switch(spriteId) {
            case 3:
                new EnemyProjectile(PIXI.Loader.shared.resources["assets/sprites/Bullet3.png"].texture, 3, x, y, vx, vy, tint, damage);
                break;
            default:
                new EnemyProjectile(PIXI.Loader.shared.resources["assets/sprites/Bullet2.png"].texture, 2, x, y, vx, vy, tint, damage);
        }
    }
}
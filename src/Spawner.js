class Spawner {
    constructor (pixiApp, objectStore) {
        this.pixiApp = pixiApp;
        this.objectStore = objectStore;
        this.enemyColors = ["0xCB3301", "0xFF0066", "0xFF6666", "0xFEFF99", "0xFFFF67", "0xCCFF66", "0x99FE00", "0xEC8EED", "0xFF99CB", "0xFE349A", "0xCC99FE", "0x6599FF", "0x03CDFF", "0xFF0000", "0xFFFF00", "0x00FF00", "0x00FFFF", "0x0000FF", "0xFF00FF"];
    }

    spawnEnemyWave(wave, compress) {
        let amountSpawned = 0;

        let waveToSpawn = wave;
        let effectiveWave = wave;

        if (compress) {
            waveToSpawn -= 9;
        }

        while (waveToSpawn <= effectiveWave) {
            if (waveToSpawn % 1000 === 0) {
                this.spawnBoss(effectiveWave, 1250);
                amountSpawned++;
            } else if (waveToSpawn % 100 === 0) {
                this.spawnBoss(effectiveWave, 250);
                amountSpawned++;
            }else if (waveToSpawn % 10 === 0) {
                this.spawnBoss(effectiveWave, 50);
                amountSpawned++;
            } else {
                let spawnAmount = Math.ceil(0.2 * effectiveWave + 4);
                if (spawnAmount > 25) {
                    spawnAmount = 25;
                }

                let enemyType = Math.round(Math.random());
                switch(enemyType) {
                    case 0:
                        for (let i = 0; i < spawnAmount; i++) {
                            this.spawnCrawlerEnemy(effectiveWave);
                            amountSpawned++;
                        }
                        break;
                    case 1:
                        for (let i = 0; i < spawnAmount; i++) {
                            this.spawnAsteroidEnemy(effectiveWave);
                            amountSpawned++;
                        }
                }
            }

            waveToSpawn++;
        }

        return amountSpawned;
    }

    spawnCrawlerEnemy(wave) {
        // Initialize stats
        let enemyStats = EnemyStats.get();
        enemyStats.maxHealth = Math.floor(enemyStats.maxHealth * Math.pow(arcInc.growth, wave));
        enemyStats.currentHealth = enemyStats.maxHealth;
        enemyStats.credits = Math.floor(enemyStats.credits * Math.pow(arcInc.growth, wave));
        enemyStats.damage = Math.floor(enemyStats.damage * Math.pow(arcInc.growth, wave));
        enemyStats.wave = wave;

        let enemy = new CrawlerEnemy(enemyStats);
        enemy.tint = this.enemyColors[Math.floor(Math.random()*this.enemyColors.length)];

        // Randomize positioning
        enemy.x = Math.random() * (Utils.getEffectiveScreenWidth() - enemy.width);
        enemy.y = Math.random() * -(Utils.getEffectiveScreenHeight()/2) - enemy.height;

        enemy.vx = 0;
        enemy.vy = 2;
    }

    spawnAsteroidEnemy(wave) {
        // Initialize stats
        let enemyStats = EnemyStats.get();
        enemyStats.maxHealth = Math.floor(enemyStats.maxHealth * Math.pow(arcInc.growth, wave));
        enemyStats.currentHealth = enemyStats.maxHealth;
        enemyStats.credits = Math.floor(enemyStats.credits * Math.pow(arcInc.growth, wave));
        enemyStats.damage = Math.floor(enemyStats.damage * Math.pow(arcInc.growth, wave));
        enemyStats.wave = wave;

        let enemy = new AsteroidEnemy(enemyStats);

        // Randomize positioning
        enemy.x = (Math.random() * -(Utils.getEffectiveScreenWidth()) - enemy.width + Utils.getEffectiveScreenWidth()/2);
        enemy.y = Math.random() * -(Utils.getEffectiveScreenHeight()/2) - enemy.height;

        enemy.vx = 4;
        enemy.vy = 4;
    }

    spawnBoss(wave, scalingFactor) {
        // Initialize stats
        let enemyStats = EnemyStats.get();
        enemyStats.maxHealth = Math.floor(enemyStats.maxHealth * Math.pow(arcInc.growth, wave) * scalingFactor);
        enemyStats.currentHealth = enemyStats.maxHealth;
        enemyStats.credits = Math.floor(enemyStats.credits * Math.pow(arcInc.growth, wave) * scalingFactor);
        enemyStats.damage = Math.floor(enemyStats.damage / 5 * Math.pow(arcInc.growth, wave));
        enemyStats.antimatter = wave * scalingFactor / 50 * (0.1 * arcInc.savegame.modules.antimatterSiphon);
        enemyStats.wave = wave;
        enemyStats.isBoss = true;

        let enemy = new BossEnemy(enemyStats);

        // positioning
        enemy.x = Utils.getEffectiveScreenWidth() / 2;
        enemy.y = -enemy.height/2;

        enemy.vx = 0;
        enemy.vy = 1;
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
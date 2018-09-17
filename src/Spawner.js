class Spawner {
    constructor (pixiApp, objectStore) {
        this.pixiApp = pixiApp;
        this.objectStore = objectStore;
        this.enemyColors = ["0xCB3301", "0xFF0066", "0xFF6666", "0xFEFF99", "0xFFFF67", "0xCCFF66", "0x99FE00", "0xEC8EED", "0xFF99CB", "0xFE349A", "0xCC99FE", "0x6599FF", "0x03CDFF", "0xFF0000", "0xFFFF00", "0x00FF00", "0x00FFFF", "0x0000FF", "0xFF00FF"];
    }

    spawnEnemy(type, wave, scalingFactor) {
        // Initialize stats
        let enemyStats = EnemyStats.get();
        enemyStats.maxHealth = Math.floor(enemyStats.maxHealth * Math.pow(arcInc.growth, wave) * scalingFactor);
        enemyStats.currentHealth = enemyStats.maxHealth;
        enemyStats.credits = Math.floor(enemyStats.credits * Math.pow(arcInc.growth, wave) * scalingFactor);
        enemyStats.damage = Math.floor(enemyStats.damage * Math.pow(arcInc.growth, wave) * scalingFactor);
        enemyStats.wave = wave;

        let enemy;
        switch(type) {
            case "crawler": {
                enemy = new CrawlerEnemy(enemyStats);
                enemy.tint = arcInc.spawner.enemyColors[Math.floor(Math.random()*arcInc.spawner.enemyColors.length)];
            } break;
            case "industrialMiner": {
                enemy = new IndustrialMinerEnemy(enemyStats);
            } break;
            case "suicideBomber": {
                enemy = new SuicideBomberEnemy(enemyStats);
            } break;
            case "blocky": {
                enemy = new BlockyEnemy(enemyStats);
            } break;
            case "asteroid": {
                enemy = new AsteroidEnemy(enemyStats);
            } break;
        }

        arcInc.eventEmitter.emit(Events.COLLIDER_CREATED, enemy);

        return enemy;
    }

    spawnBoss(type, wave, scalingFactor) {
        // Initialize stats
        let enemyStats = EnemyStats.get();
        enemyStats.maxHealth = Math.floor(enemyStats.maxHealth * Math.pow(arcInc.growth, wave) * scalingFactor);
        enemyStats.currentHealth = enemyStats.maxHealth;
        enemyStats.credits = Math.floor(enemyStats.credits * Math.pow(arcInc.growth, wave) * scalingFactor);
        enemyStats.damage = Math.floor(enemyStats.damage / 5 * Math.pow(arcInc.growth, wave));
        enemyStats.antimatter = Math.max((wave-500)/500, 0)**2 * 1.015**(wave-500) * scalingFactor / 10000 * (arcInc.savegame.modules.antimatterSiphon);
        enemyStats.wave = wave;
        enemyStats.isBoss = true;

        let enemy = new BossEnemy(enemyStats);

        // positioning
        enemy.x = Utils.getEffectiveScreenWidth() / 2;
        enemy.y = -enemy.height/2;

        enemy.vx = 0;
        enemy.vy = 1;

        arcInc.eventEmitter.emit(Events.COLLIDER_CREATED, enemy);
    }

    spawnEnemyLaserProjectile(x, y, vx, vy, tint, damage) {
        new EnemyProjectile(PIXI.Loader.shared.resources["assets/sprites/Laser.png"].texture, x, y, vx, vy, tint, damage);
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
                new EnemyProjectile(PIXI.Loader.shared.resources["assets/sprites/Bullet3.png"].texture, x, y, vx, vy, tint, damage);
                break;
            default:
                new EnemyProjectile(PIXI.Loader.shared.resources["assets/sprites/Bullet2.png"].texture, x, y, vx, vy, tint, damage);
        }
    }
}
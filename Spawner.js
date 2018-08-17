class Spawner {
    constructor (pixiApp, objectStore) {
        this.pixiApp = pixiApp;
        this.objectStore = objectStore;
        this.enemyColors = ["0xCB3301", "0xFF0066", "0xFF6666", "0xFEFF99", "0xFFFF67", "0xCCFF66", "0x99FE00", "0xEC8EED", "0xFF99CB", "0xFE349A", "0xCC99FE", "0x6599FF", "0x03CDFF"];
    }

    prepareEnemy() {
        let enemyContainer = this.objectStore.get('enemyContainer');
        let enemy = new Enemy(PIXI.Loader.shared.resources["assets/sprites/A1.png"].texture, 10);
        enemy.scale.set(0.5);

        enemyContainer.addChild(enemy);
        return enemy;
    }

    spawnEnemyWave(wave) {
        for (let i = 0; i < Math.ceil(0.2 * wave + 5); i++) {
            this.spawnRandomEnemy(wave);
        }
    }

    spawnRandomEnemy(wave) {
        let enemyContainer = this.objectStore.get('enemyContainer');
        let enemy;
        for (let i = 0; i < enemyContainer.children.length; i++) {
            if (!enemyContainer.children[i].visible) {
                enemy = enemyContainer.children[i];
                break;
            }
        }

        // if no enemy is available in the enemy container, create another
        if (enemy === undefined) {
            enemy = this.prepareEnemy();
        }

        enemy.x = Math.random() * (this.pixiApp.renderer.view.width - enemy.width);
        enemy.y = Math.random() * -1000 - enemy.height;
        enemy.vy = 2;
        enemy.vx = Math.random() * 0.6 - 0.3;

        enemy.maxHealth = Math.floor(5 * Math.pow(1.07, wave));
        enemy.currentHealth = enemy.maxHealth;
        enemy.credits = Math.floor(10 * Math.pow(1.06, wave));
        enemy.damage = Math.floor(5 * Math.pow(1.05, wave));

        enemy.tint = this.enemyColors[Math.floor(Math.random()*this.enemyColors.length)];

        enemy.updateHealthBar();
        enemy.visible = true;
    }

    preparePlayerProjectile() {
        let playerProjectileContainer = this.objectStore.get('playerProjectileContainer');
        let projectile = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/Bullet.png"].texture);
        projectile.scale.set(0.4);
        projectile.damage = 5;

        playerProjectileContainer.addChild(projectile);

        return projectile;
    }

    spawnPlayerProjectile(x, y, vx, vy, damage) {
        let playerProjectileContainer = this.objectStore.get('playerProjectileContainer');

        let projectile;
        for (let i = 0; i < playerProjectileContainer.children.length; i++) {
            if (!playerProjectileContainer.children[i].visible) {
                projectile = playerProjectileContainer.children[i];
                break;
            }
        }

        // if no player projectile is available in the player projectile container, create another
        if (projectile === undefined) {
            projectile = this.preparePlayerProjectile();
        }

        projectile.x = x;
        projectile.y = y;
        projectile.vx = vx;
        projectile.vy = vy;
        projectile.damage = damage;
        projectile.visible = true;
    }

    prepareEnemyProjectile() {
        let enemyProjectileContainer = this.objectStore.get('enemyProjectileContainer');
        let projectile = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/Bullet2.png"].texture);
        projectile.scale.set(0.4);
        enemyProjectileContainer.addChild(projectile);

        return projectile;
    }

    spawnEnemyProjectile(x, y, vx, vy, tint, damage) {
        let enemyProjectileContainer = this.objectStore.get('enemyProjectileContainer');

        let projectile;
        for (let i = 0; i < enemyProjectileContainer.children.length; i++) {
            if (!enemyProjectileContainer.children[i].visible) {
                projectile = enemyProjectileContainer.children[i];
                break;
            }
        }

        // if no enemy projectile is available in the enemy projectile container, create another
        if (projectile === undefined) {
            projectile = this.prepareEnemyProjectile();
        }

        projectile.x = x;
        projectile.y = y;
        projectile.vx = vx;
        projectile.vy = vy;
        projectile.tint = tint;
        projectile.damage = damage;

        projectile.visible = true;
    }
}
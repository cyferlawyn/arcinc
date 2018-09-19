class LavaRockEnemy extends Enemy {
    constructor(stats) {
        super(PIXI.Loader.shared.resources["assets/sprites/enemies/LavaRockEnemy.png"].texture, stats);
    }

    prepareProperties() {
        this.scale.set(0.3);
        this.spawnDelay = 0;
        this.homing = true;
        this.stationary = false;
    }

    prepareGui() {

    }

    move(frameDelta){
        if (this.homing) {
            let player = arcInc.objectStore.get('player');

            let normVector = Utils.getNormVector(player, this);

            this.vx = normVector.vx * 5;
            this.vy = normVector.vy * 5;
        }

        if (!this.stationary) {
            this.x += this.vx * frameDelta;
            this.y += this.vy * frameDelta;
            arcInc.eventEmitter.emit(Events.COLLIDER_MOVED, this);
        }
    }

    testCollision() {
        if (!this.markedForDestruction) {
            // Collision with player
            let player = arcInc.objectStore.get('player');
            if (Utils.intersect(this, player)) {
                this.stationary = true;
                this.homing = false;

                this.damage = this.stats.damage / 15;
                player.hitBy(this);
                this.markedForDestruction = false;
            }

            // collision with enemy projectiles
            let enemyProjectileContainer = arcInc.objectStore.get('enemyProjectileContainer');
            for (let enemyProjectileIndex = 0; enemyProjectileIndex < enemyProjectileContainer.children.length; enemyProjectileIndex++) {
                let enemyProjectile = enemyProjectileContainer.children[enemyProjectileIndex];
                if (!enemyProjectile.markedForDestruction) {
                    if (Utils.intersect(this, enemyProjectile)) {
                        if (enemyProjectile.destroysScenery !== undefined && enemyProjectile.destroysScenery) {
                            enemyProjectile.markedForDestruction = true;
                            this.markedForDestruction = true;
                        }
                    }
                }
            }
        }
    }

    engage(frameDelta) {
        if (this.stationary) {
            this.spawnDelay += frameDelta;
            if (this.spawnDelay >= 30) {
                this.spawnDelay -= 30;
                this.spawnSpaceBug();
            }
        }
    }

    spawnSpaceBug() {
        let enemy = arcInc.spawner.spawnEnemy("spaceBug", arcInc.sceneManager.scenes['main'].wave, 1);
        enemy.x = this.x;
        enemy.y = this.y;
        enemy.stats.wave = 0;
    }

    hitBy(projectile) {

    }

    updateGuiElements() {

    }
}
class PlasmaZoneEnemy extends Enemy {
    constructor(stats) {
        super(PIXI.Loader.shared.resources["assets/sprites/enemies/PlasmaZoneEnemy.png"].texture, stats);
    }

    prepareProperties() {
        this.scale.set(0.1);
        this.tint = 0x00FF00;
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
                this.homing = false;
                this.stationary = true;

                this.damage = this.stats.damage / 15;
                player.hitBy(this);

                this.scale.set(this.scale.x + 0.00075);
            }


            // collision with enemy projectiles
            let enemyProjectileContainer = arcInc.objectStore.get('enemyProjectileContainer');
            for (let enemyProjectileIndex = 0; enemyProjectileIndex < enemyProjectileContainer.children.length; enemyProjectileIndex++) {
                let enemyProjectile = enemyProjectileContainer.children[enemyProjectileIndex];
                if (!enemyProjectile.markedForDestruction) {
                    if (Utils.intersect(this, enemyProjectile)) {
                        enemyProjectile.markedForDestruction = true;
                        this.scale.set(this.scale.x + 0.00075);
                    }
                }
            }


            this.markedForDestruction = false;
        }
    }

    hitBy(projectile) {

    }

    updateGuiElements() {

    }
}
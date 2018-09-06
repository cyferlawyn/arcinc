class IndustrialMinerEnemy extends Enemy{
    constructor(stats) {
        super(PIXI.Loader.shared.resources["assets/sprites/enemies/IndustrialMinerEnemy.png"].texture, stats);
    }

    prepareProperties() {
        this.scale.set(0.3);
        this.defaultShotDelay = 0;
        this.shotFrames = [250, 265, 280, 295, 310];
    }

    move(frameDelta){
        if (this.defaultShotDelay > 200 && this.defaultShotDelay < 360) {
        } else {
            this.x += this.vx * frameDelta;
            this.y += this.vy * frameDelta;
        }

        if (Utils.leftBounds(this)) {
            this.markedForDestruction = true;
        }
    }

    engage(frameDelta) {
        this.defaultShotDelay += frameDelta;
        if (this.defaultShotDelay > this.shotFrames[0]) {
            arcInc.spawner.spawnEnemyLaserProjectile(
                this.x,
                this.y,
                0,
                4,
                0xB4FFB4,
                this.stats.damage);

            this.shotFrames.splice(0, 1);
        }
    }
}
class SpaceBugEnemy extends Enemy{
    constructor(stats) {
        super(PIXI.Loader.shared.resources["assets/sprites/enemies/SpaceBugEnemy.png"].texture, stats);
    }

    prepareProperties() {
        this.scale.set(0.25);
        this.defaultShotDelay = 0;
        this.randomizeTargetLocation();
        this.targetLocationTime = 0;
        this.stats.maxHealth /= 2;
        this.stats.currentHealth /= 2;
    }

    move(frameDelta){
        this.targetLocationTime += frameDelta;
        if (this.targetLocationTime >= 20) {
            this.targetLocationTime -= 20;
            this.randomizeTargetLocation();
        }

        this.x += this.vx * frameDelta;
        this.y += this.vy * frameDelta;

        if (Utils.leftBounds(this)) {
            this.markedForDestruction = true;
        }

        arcInc.eventEmitter.emit(Events.COLLIDER_MOVED, this);
    }

    randomizeTargetLocation() {
        let normVector = Utils.getNormVector({'x': Math.random() * Utils.getEffectiveScreenWidth(), 'y': Math.random() * Utils.getEffectiveScreenHeight()}, this);

        this.vx = normVector.vx * this.stats.baseMovementSpeed;
        this.vy = normVector.vy * this.stats.baseMovementSpeed;

        this.rotation = Math.atan2(this.vy, this.vx) - Math.PI / 2;
    }

    engage(frameDelta) {
        this.defaultShotDelay += frameDelta;
        if (this.defaultShotDelay > 120) {
            this.defaultShotDelay -= 120;
            let shotNormVector = Utils.getNormVector({'x': this.vx, 'y': this.vy}, {'x': 0, 'y': 0});
            arcInc.spawner.spawnEnemyProjectile(
                this.x,
                this.y,
                shotNormVector.vx * 4,
                shotNormVector.vy * 4,
                "0x00FF00",
                this.stats.damage);
        }
    }
}
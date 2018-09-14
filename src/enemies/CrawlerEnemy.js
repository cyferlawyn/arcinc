class CrawlerEnemy extends Enemy{
    constructor(stats) {
        super(PIXI.Loader.shared.resources["assets/sprites/enemies/CrawlerEnemy.png"].texture, stats);
    }

    prepareProperties() {
        this.scale.set(0.4);
        this.defaultShotDelay = 0;
    }

    move(frameDelta){
        this.vx = Math.sin(this.y / 75) * this.vy;
        this.rotation = Math.atan2(this.vy, this.vx) - Math.PI / 2;

        if (this.x < 0) {
            this.x = 0;
        }

        if (this.x + this.width > Utils.getEffectiveScreenWidth()) {
            this.x = Utils.getEffectiveScreenWidth() - this.width;
        }

        this.x += this.vx * frameDelta;
        this.y += this.vy * frameDelta;

        if (Utils.leftBounds(this)) {
            this.markedForDestruction = true;
        }

        arcInc.eventEmitter.emit(Events.COLLIDER_MOVED, this);
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
                this.tint,
                this.stats.damage);
        }
    }
}
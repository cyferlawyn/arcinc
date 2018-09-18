class BlockyEnemy extends Enemy{
    constructor(stats) {
        super(PIXI.Loader.shared.resources["assets/sprites/enemies/BlockyEnemy.png"].texture, stats);
    }

    prepareProperties() {
        this.scale.set(0.3);
        this.lifetime = 0;
        this.triggered = false;
        this.triggerThreshold = this.stats.currentHealth / 3;
    }

    move(frameDelta){
        this.lifetime += frameDelta;

        this.x += this.vx * frameDelta;
        this.y += this.vy * frameDelta;

        if (!this.triggered) {
            if (this.lifetime > 150 && this.lifetime <= 300) {
                this.vx = 0;
                this.vy = Math.sin(this.lifetime / 10);
            }

            if (this.lifetime > 300) {
                this.trigger();
            }
        } else {
            if (Utils.leftBounds(this)) {
                this.markedForDestruction = true;
            }
        }

        arcInc.eventEmitter.emit(Events.COLLIDER_MOVED, this);
    }

    trigger() {
        this.scale.set(0.15);
        this.tint = 0xFF0000;
        let player = arcInc.objectStore.get('player');

        let normVector = Utils.getNormVector(player, this);

        this.vx = normVector.vx * 4;
        this.vy = normVector.vy * 4;

        this.triggered = true;
    }

    afterHitBy(projectile) {
        if (!this.triggered && this.stats.currentHealth < this.triggerThreshold)
        {
            this.trigger();
        }
    }
}

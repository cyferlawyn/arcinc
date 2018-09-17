class BlockyEnemy extends Enemy{
    constructor(stats) {
        super(PIXI.Loader.shared.resources["assets/sprites/enemies/BlockyEnemy.png"].texture, stats);
    }

    prepareProperties() {
        this.scale.set(0.2);
        this.lifetime = 0;
        this.triggered = false;
        this.triggerThreshold = this.stats.currentHealth / 2;
    }

    move(frameDelta){
        this.lifetime += frameDelta;

        this.x += this.vx * frameDelta;
        this.y += this.vy * frameDelta;

        if (!this.triggered) {
            if (this.lifetime > 150 && this.lifetime < 300) {
                this.vx = 0;
                this.vy = Math.sin(this.lifetime / 10);
            }

            if (this.lifetime > 300) {
                this.triggered = true;
            }
        } else {
            if (this.x < 0){
                this.vx *= -1;
                this.x = 0;
            }

            if (this.x > Utils.getEffectiveScreenWidth()){
                this.vx *= -1;
                this.x = Utils.getEffectiveScreenWidth();
            }

            if (this.y < 0){
                this.vy *= -1;
                this.y = 0;
            }

            if (this.y > Utils.getEffectiveScreenHeight()){
                this.vy *= -1;
                this.y = Utils.getEffectiveScreenHeight();
            }
        }

        arcInc.eventEmitter.emit(Events.COLLIDER_MOVED, this);
    }

    afterHitBy(projectile) {
        if (!this.triggered && this.stats.currentHealth < this.triggerThreshold)
        {
            this.triggered = true;
            this.scale.set(0.3);
            this.tint = 0xFF0000;
            this.vx = Math.random() * 20 - 10;
            this.vy = -8;
        }
    }
}

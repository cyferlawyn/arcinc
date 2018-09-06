class SuicideBomberEnemy extends Enemy {
    constructor(stats) {
        super(PIXI.Loader.shared.resources["assets/sprites/enemies/SuicideBomberEnemy.png"].texture, stats);
    }

    prepareProperties() {
        this.scale.set(0.5);
        this.stats.damage *= 2;
    }

    move(frameDelta){
        let player = arcInc.objectStore.get('player');

        let normVector = Utils.getNormVector(player, this);

        this.vx = normVector.vx * this.stats.baseMovementSpeed;
        this.vy = normVector.vy * this.stats.baseMovementSpeed;

        this.rotation = Math.atan2(this.vy, this.vx) - Math.PI / 2;

        this.x += this.vx * frameDelta;
        this.y += this.vy * frameDelta;

        if (Utils.leftBounds(this)) {
            this.markedForDestruction = true;
        }
    }
}
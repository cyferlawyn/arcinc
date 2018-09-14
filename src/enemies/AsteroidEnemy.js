class AsteroidEnemy extends Enemy {
    constructor(stats) {
        super(PIXI.Loader.shared.resources["assets/sprites/enemies/AsteroidEnemy.png"].texture, stats);
    }

    prepareProperties() {
        this.scale.set(0.6);
    }

    move(frameDelta){
        this.x += this.vx * frameDelta;
        this.y += this.vy * frameDelta;

        this.rotation +=  frameDelta / 25;

        if (Utils.leftBounds(this)) {
            this.markedForDestruction = true;
        }

        arcInc.eventEmitter.emit(Events.COLLIDER_MOVED, this);
    }
}
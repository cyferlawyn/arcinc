class EnemyProjectile extends PIXI.Sprite{
    constructor(texture, spriteId, x, y, vx, vy, tint, damage) {
        super(texture);
        this.init(spriteId, x, y, vx, vy, tint, damage);

        this.id = 'EnemyProjectile-' + Utils.getUUID();
        this.markedForDestruction = false;

        // Register event listener
        arcInc.eventEmitter.subscribe(Events.MOVEMENT_PHASE_STARTED,this.id, this.move.bind(this));
        arcInc.eventEmitter.subscribe(Events.CLEANUP_PHASE_STARTED,this.id, this.cleanup.bind(this));
    }

    destructor() {
        arcInc.eventEmitter.unsubscribe(Events.MOVEMENT_PHASE_STARTED, this.id);
        arcInc.eventEmitter.unsubscribe(Events.CLEANUP_PHASE_STARTED,this.id);

        let enemyProjectileContainer = arcInc.objectStore.get('enemyProjectileContainer');
        enemyProjectileContainer.removeChild(this);
        this.destroy();
    }

    init(spriteId, x, y, vx, vy, tint, damage) {
        let enemyProjectileContainer = arcInc.objectStore.get('enemyProjectileContainer');
        this.scale.set(0.3);
        this.spriteId = spriteId;

        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;

        this.anchor.set(0.5, 0.5);
        this.rotation = Math.atan2(vy, vx) - Math.PI/2;

        this.tint = tint;
        this.damage = damage;

        enemyProjectileContainer.addChild(this);
    }

    move(frameDelta) {
        this.x += this.vx * frameDelta;
        this.y += this.vy * frameDelta;

        if (Utils.leftBounds(this)) {
            this.markedForDestruction = true;
        }
    }

    cleanup(frameDelta) {
        if (this.markedForDestruction) {
            this.destructor();
        }
    }
}
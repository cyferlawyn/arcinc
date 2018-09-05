class Enemy extends PIXI.Sprite {
    constructor(texture, maxHealth) {
        super(texture);
        this.init();
        this.prepareStats(maxHealth);
    }

    destructor() {
        arcInc.eventEmitter.unsubscribe(Events.REGENERATION_PHASE_STARTED,this.id);
        arcInc.eventEmitter.unsubscribe(Events.MOVEMENT_PHASE_STARTED, this.id);
        arcInc.eventEmitter.unsubscribe(Events.ENGAGEMENT_PHASE_STARTED, this.id);
        arcInc.eventEmitter.unsubscribe(Events.CLEANUP_PHASE_STARTED,this.id);

        let enemyContainer = arcInc.objectStore.get('enemyContainer');
        enemyContainer.removeChild(this);
        this.destroy();
    }

    init() {
        this.id = 'Enemy-' + Utils.getUUID();
        this.markedForDestruction = false;

        // Register event listener
        arcInc.eventEmitter.subscribe(Events.REGENERATION_PHASE_STARTED,this.id, this.regenerate.bind(this));
        arcInc.eventEmitter.subscribe(Events.MOVEMENT_PHASE_STARTED,this.id, this.move.bind(this));
        arcInc.eventEmitter.subscribe(Events.ENGAGEMENT_PHASE_STARTED,this.id, this.engage.bind(this));
        arcInc.eventEmitter.subscribe(Events.CLEANUP_PHASE_STARTED,this.id, this.cleanup.bind(this));
    }

    prepareStats(maxHealth) {
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;

        let damageBar = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/DamageBar.png"].texture);
        damageBar.x = -this.width/2;
        damageBar.y = -this.height/2-15;
        damageBar.width = this.width;
        damageBar.height = 10;
        this.addChild(damageBar);

        let healthBar = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/HealthBar.png"].texture);
        healthBar.x = -this.width/2;
        healthBar.y = -this.height/2-15;
        healthBar.width = this.width;
        healthBar.height = 10;
        this.addChild(healthBar);

        this.defaultShotDelay = 0;
    }

    regenerate(frameDelta) {
        // TODO
        this.currentHealth -= this.burnDamage;
        this.burnDamage *= 0.99;
        this.checkForDestruction();
    }

    move(frameDelta){
        this.vx = Math.sin(this.y / 75) * this.vy;
        this.rotation = Math.atan2(this.vy, this.vx) - Math.PI / 2;

        if (this.x < 0) {
            this.x = 0;
        }

        if (this.x + this.width > arcInc.pixiApp.screen.width / arcInc.pixiApp.stage.scale.x) {
            this.x = arcInc.pixiApp.screen.width / arcInc.pixiApp.stage.scale.x - this.width;
        }

        this.x += this.vx * frameDelta;
        this.y += this.vy * frameDelta;

        if (Utils.leftBounds(this)) {
            this.markedForDestruction = true;
        }
    }

    engage(frameDelta) {
        this.defaultShotDelay += frameDelta;
        if (this.defaultShotDelay > 120) {
            this.defaultShotDelay -= 120;
            arcInc.spawner.spawnEnemyProjectile(
                this.x,
                this.y,
                this.vxBase * 2,
                this.vyBase * 2,
                this.tint,
                this.damage);
        }
    }

    checkForDestruction() {
        let player = arcInc.objectStore.get('player');
        if (this.currentHealth <= 0) {
            arcInc.savegame.credits += this.credits * player.stats.effectiveKillCreditMultiplier;
            arcInc.eventEmitter.emit(Events.CREDITS_UPDATED, arcInc.savegame.credits);
            if (this.wave === arcInc.sceneManager.scenes['main'].wave) {
                arcInc.sceneManager.scenes['main'].remainingEnemies--;

                if (this.isBoss) {
                    arcInc.savegame.highestWave = this.wave + 1;
                    arcInc.saveSavegame();
                }
            }
            this.markedForDestruction = true;
        }
    }

    cleanup(frameDelta) {
        if (this.markedForDestruction) {
            this.destructor();
        } else {
            this.children[1].width = this.width / this.scale.x * this.currentHealth / this.maxHealth;
        }
    }
}
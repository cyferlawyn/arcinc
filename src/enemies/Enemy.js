class Enemy extends PIXI.Sprite {
    constructor(texture, maxHealth) {
        super(texture);
        this.init(maxHealth);

        this.id = 'Enemy-' + Utils.getUUID();
        this.markedForDestruction = false;

        // Register event listener
        arcInc.eventEmitter.subscribe(Events.REGENERATION_PHASE_STARTED,this.id, this.regenerate.bind(this));
        arcInc.eventEmitter.subscribe(Events.MOVEMENT_PHASE_STARTED,this.id, this.move.bind(this));
        arcInc.eventEmitter.subscribe(Events.ENGAGEMENT_PHASE_STARTED,this.id, this.engage.bind(this));
        arcInc.eventEmitter.subscribe(Events.CLEANUP_PHASE_STARTED,this.id, this.cleanup.bind(this));
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

    init(maxHealth) {
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
        this.bossShot1Delay = 0;
        this.bossShot2Delay = 0;
    }

    regenerate(frameDelta) {
        // TODO
        this.currentHealth -= this.burnDamage;
        this.burnDamage *= 0.99;
        this.checkForDestruction();
    }

    move(frameDelta){
        if (!this.isBoss) {
            this.vx = Math.sin(this.y / 75) * this.vy;
            this.rotation = Math.atan2(this.vy, this.vx) - Math.PI / 2;

            if (this.x < 0) {
                this.x = 0;
            }

            if (this.x + this.width > arcInc.pixiApp.screen.width / arcInc.pixiApp.stage.scale.x) {
                this.x = arcInc.pixiApp.screen.width / arcInc.pixiApp.stage.scale.x - this.width;
            }
        } else {
            arcInc.sceneManager.scenes['main'].framesTillWave = 600;

            if (this.y > 40 + this.height / 2) {
                this.y = 40 + this.height / 2;
                this.vy = 0;
                this.vx = 1;
            }

            if (this.x < this.width / 2) {
                this.x = this.width / 2;
                this.vx *= -1;
            }

            if (this.x + this.width / 2 > arcInc.pixiApp.screen.width / arcInc.pixiApp.stage.scale.x) {
                this.x = arcInc.pixiApp.screen.width / arcInc.pixiApp.stage.scale.x - this.width / 2;
                this.vx *= -1;
            }
        }

        this.x += this.vx * frameDelta;
        this.y += this.vy * frameDelta;

        if (Utils.leftBounds(this)) {
            this.markedForDestruction = true;
        }
    }

    engage(frameDelta) {
        if (!this.isBoss) {
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
        } else {
            this.bossShot1Delay += frameDelta;
            if (this.bossShot1Delay > 5) {
                this.bossShot1Delay -= 5;
                arcInc.spawner.spawnEnemyProjectile(
                    this.x,
                    this.y,
                    5 * Math.sin(arcInc.sceneManager.scenes['main'].frame / 10),
                    7,
                    "0x66DD66",
                    this.damage,
                    3);
            }

            this.bossShot2Delay += frameDelta;
            if (this.bossShot2Delay > 3) {
                this.bossShot2Delay -= 3;
                this.cascadeAngle += 15;
                let x = this.x;
                let y = this.y;

                let angle = this.cascadeAngle * Math.PI/180; //degrees converted to radians
                let distanceX = Math.cos(angle);
                let distanceY = Math.sin(angle);

                // calculate the velocity vector length
                let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                // normalize velocity vector length
                let vx = distanceX / distance;
                let vy = distanceY / distance;

                // apply movement speed
                vx = vx * 5;
                vy = vy * 5;

                arcInc.spawner.spawnEnemyProjectile(
                    x,
                    y,
                    vx,
                    vy,
                    "0xEEEE66",
                    this.damage,
                    2);
            }
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
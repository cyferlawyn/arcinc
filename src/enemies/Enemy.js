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
        arcInc.eventEmitter.unsubscribe(Events.COLLISION_DETECTION_PHASE_STARTED, this.id);
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
        arcInc.eventEmitter.subscribe(Events.COLLISION_DETECTION_PHASE_STARTED,this.id, this.testCollision.bind(this));
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
        this.currentHealth -= this.burnDamage*frameDelta;
        this.burnDamage *= 0.9975**frameDelta;
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
            console.log(this.id + ' left bounds!');
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

    testCollision() {
        let playerProjectileContainer = arcInc.objectStore.get('playerProjectileContainer');

        for (let i = 0; i < playerProjectileContainer.children.length-1; i++) {
            let projectile = playerProjectileContainer.children[i];

            if (!projectile.markedForDestruction && !projectile.ignore.includes(this.id) && Utils.intersect(this, projectile)) {
                this.hitBy(projectile);
            }
        }
    }

    hitBy(projectile) {
        let player = arcInc.objectStore.get('player');
        let damage = projectile.damage;

        // test critical hit
        if (player.stats.chanceHappened('criticalHitChance')) {
            damage *= player.stats.effectiveCriticalHitDamageMultiplier;
        }

        // test projectile fork
        if (projectile.original && player.stats.chanceHappened('projectileForkChance')) {
            projectile.ignore.push(this.id);
            let newProjectileOne = arcInc.spawner.spawnPlayerProjectile(projectile.x, projectile.y, projectile.vy / 4, projectile.vy, projectile.damage, false);
            let newProjectileTwo = arcInc.spawner.spawnPlayerProjectile(projectile.x, projectile.y, -projectile.vy / 4, projectile.vy, projectile.damage, false);
            newProjectileOne.ignore = projectile.ignore.slice();
            newProjectileTwo.ignore = projectile.ignore.slice();
        }

        // test projectile pierce
        if (player.stats.chanceHappened('projectilePierceChance')) {
            projectile.ignore.push(this.id);
        } else {
            projectile.markedForDestruction = true;
        }

        // Skip ailment calculations for direct kills
        if (this.currentHealth > damage) {
            // test freeze
            if (player.stats.chanceHappened('freezeChance')) {
                if (!this.isBoss) {
                    this.vx = this.vx * 0.98;
                    if (this.vx < 0.5) {
                        this.vx = 0.5;
                    }
                    this.vy = this.vy * 0.98;
                    if (this.vy < 0.5) {
                        this.vy = 0.5;
                    }
                }
            }

            // test burn
            if (player.stats.chanceHappened('burnChance')) {
                this.burnDamage += damage * 0.01;
            }
        }

        // Apply final damage application
        this.currentHealth -= damage;
    }

    cleanup(frameDelta) {
        if (this.currentHealth <= 0) {
            let player = arcInc.objectStore.get('player');
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

        if (this.markedForDestruction) {
            this.removeGuiElements();
            this.destructor();
        } else {
            this.updateGuiElements();
        }
    }

    updateGuiElements() {
        this.children[1].width = this.width / this.scale.x * this.currentHealth / this.maxHealth;
    }

    removeGuiElements() {
    }
}
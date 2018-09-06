class Enemy extends PIXI.Sprite {
    constructor(texture, stats) {
        super(texture);
        this.stats = stats;

        this.prepareProperties();
        this.init();
        this.prepareGui();
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
        this.anchor.set(0.5, 0.5);
        this.id = 'Enemy-' + Utils.getUUID();
        this.markedForDestruction = false;

        // Register event listener
        arcInc.eventEmitter.subscribe(Events.REGENERATION_PHASE_STARTED,this.id, this.regenerate.bind(this));
        arcInc.eventEmitter.subscribe(Events.MOVEMENT_PHASE_STARTED,this.id, this.move.bind(this));
        arcInc.eventEmitter.subscribe(Events.ENGAGEMENT_PHASE_STARTED,this.id, this.engage.bind(this));
        arcInc.eventEmitter.subscribe(Events.COLLISION_DETECTION_PHASE_STARTED,this.id, this.testCollision.bind(this));
        arcInc.eventEmitter.subscribe(Events.CLEANUP_PHASE_STARTED,this.id, this.cleanup.bind(this));

        arcInc.objectStore.get('enemyContainer').addChild(this);
    }

    prepareProperties() {

    }

    prepareGui() {
        let damageBar = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/DamageBar.png"].texture);
        damageBar.width = this.width / this.scale.x;
        damageBar.height = 10;
        this.addChild(damageBar);
        damageBar.x = -damageBar.width/2;
        damageBar.y = (-this.height / this.scale.y)/2 - 20;

        let healthBar = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/HealthBar.png"].texture);
        healthBar.width = this.width / this.scale.x;
        healthBar.height = 10;
        this.addChild(healthBar);
        healthBar.x = -healthBar.width/2;
        healthBar.y = (-this.height / this.scale.y)/2 - 20;
    }

    regenerate(frameDelta) {
        this.stats.currentHealth -= this.stats.burnDamage*frameDelta;
        this.stats.burnDamage *= 0.9975**frameDelta;
    }

    move(frameDelta){
        this.x += this.vx * frameDelta;
        this.y += this.vy * frameDelta;

        if (Utils.leftBounds(this)) {
            this.markedForDestruction = true;
        }
    }

    engage(frameDelta) {
    }

    testCollision() {
        // Collision with player projectiles
        let playerProjectileContainer = arcInc.objectStore.get('playerProjectileContainer');
        for (let i = 0; i < playerProjectileContainer.children.length; i++) {
            let projectile = playerProjectileContainer.children[i];
            if (!projectile.markedForDestruction && !projectile.ignore.includes(this.id) && Utils.intersect(this, projectile)) {
                this.hitBy(projectile);
            }
        }

        // Collision with player
        let player = arcInc.objectStore.get('player');
        if (Utils.intersect(this, player)) {
            // TODO
            if (this.stats.isBoss) {
                player.currentShield -= 1;
                this.damage = this.stats.damage * 1000;
            } else {
                this.damage = this.stats.damage;
            }
            player.hitBy(this);
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
        if (this.stats.currentHealth > damage) {
            // test freeze
            if (player.stats.chanceHappened('freezeChance')) {
                if (!this.stats.isBoss) {
                    this.vx = this.vx * 0.98;
                    if (this.vx < this.stats.baseMovementSpeed/4) {
                        this.vx = this.stats.baseMovementSpeed/4;
                    }
                    this.vy = this.vy * 0.98;
                    if (this.vy < this.stats.baseMovementSpeed/4) {
                        this.vy = this.stats.baseMovementSpeed/4;
                    }
                }
            }

            // test burn
            if (player.stats.chanceHappened('burnChance')) {
                this.stats.burnDamage += damage * 0.01;
            }
        }

        // Apply final damage application
        this.stats.currentHealth -= damage;
    }

    cleanup() {
        if (this.stats.currentHealth <= 0) {
            let player = arcInc.objectStore.get('player');
            arcInc.savegame.credits += this.stats.credits * player.stats.effectiveKillCreditMultiplier;
            arcInc.eventEmitter.emit(Events.CREDITS_UPDATED, arcInc.savegame.credits);

            if (this.stats.isBoss) {
                arcInc.savegame.pendingAntimatter += this.stats.antimatter;
                arcInc.eventEmitter.emit(Events.ANTIMATTER_UPDATED, arcInc.savegame.pendingAntimatter);

                arcInc.savegame.highestWave = this.stats.wave + 1;
                arcInc.saveSavegame();
                arcInc.eventEmitter.emit(Events.HIGHEST_WAVE_REACHED, arcInc.savegame.highestWave);
            }
            this.markedForDestruction = true;
        }

        if (this.markedForDestruction) {
            if (this.stats.wave === arcInc.sceneManager.scenes['main'].wave) {
                arcInc.sceneManager.scenes['main'].remainingEnemies--;
            }

            this.removeGuiElements();
            this.destructor();
        } else {
            this.updateGuiElements();
        }
    }

    updateGuiElements() {
        this.children[1].width = this.width / this.scale.x * this.stats.currentHealth / this.stats.maxHealth;
    }

    removeGuiElements() {
    }
}
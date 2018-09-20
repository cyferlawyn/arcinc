class SuperBossEnemy extends Enemy{
    constructor(stats) {
        super(PIXI.Loader.shared.resources["assets/sprites/enemies/SuperBossEnemy.png"].texture, stats);
    }

    prepareProperties() {
        this.scale.set(0.3);
        this.spawnCount = 0;
        this.spawnDelay = 0;
        this.bossShot1Delay = -200;
        this.rotationAngle = 90;
        this.rotationRad = this.rotationAngle * Math.PI / 180;
        this.rotatingFast = false;
        this.rotatingSlow = false;
        this.sucking = false;
        this.transitionA = true;
        this.transitionB = false;
        this.plasmaZones = [];
    }

    prepareGui() {
        let guiContainer = arcInc.objectStore.get('guiContainer');

        this.damageBar = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/DamageBar.png"].texture);
        this.damageBar.width = Utils.getEffectiveScreenWidth() * 0.75;
        this.damageBar.height = 20;
        guiContainer.addChild(this.damageBar);
        this.damageBar.x = Utils.getEffectiveScreenWidth()/2 - this.damageBar.width/2;
        this.damageBar.y = 40;

        this.healthBar = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/HealthBar.png"].texture);
        this.healthBar.width = Utils.getEffectiveScreenWidth() * 0.75;
        this.healthBar.height = 20;
        guiContainer.addChild(this.healthBar);
        this.healthBar.x = Utils.getEffectiveScreenWidth()/2 - this.healthBar.width/2;
        this.healthBar.y = 40;

        let healthStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 15,
            fill: "white",
            stroke: 'black',
            strokeThickness: 3
        });

        this.healthText = new PIXI.Text(this.stats.maxHealth, healthStyle);
        guiContainer.addChild(this.healthText);
        this.healthText.x = Utils.getEffectiveScreenWidth()/2 - this.healthText.width/2;
        this.healthText.y = 40;
    }

    move(frameDelta) {
        arcInc.sceneManager.scenes['main'].framesTillWave = 600;

        if (this.stats.currentHealth >= this.stats.maxHealth/2) {
            this.transitionA = true;
        }

        if (this.stats.currentHealth < this.stats.maxHealth/2) {
            this.transitionB = true;
        }

        if (this.transitionA) {
            this.transitionA = this.approach(Utils.getEffectiveScreenWidth()/2, Utils.getEffectiveScreenHeight()/2);
            if (!this.transitionA) {
                this.rotatingSlow = true;
            }
        }

        if (this.transitionB) {
            this.transitionB = this.approach(Utils.getEffectiveScreenWidth()/2, 100);
            if (!this.transitionB) {
                this.rotatingSlow = false;
                this.rotatingFast = true;
            }
        }

        this.rotate(frameDelta);

        this.x += this.vx * frameDelta;
        this.y += this.vy * frameDelta;

        if (Utils.leftBounds(this)) {
            this.markedForDestruction = true;
        }

        arcInc.eventEmitter.emit(Events.COLLIDER_MOVED, this);
    }

    rotate(frameDelta) {
        if (this.rotatingFast) {
            this.rotationAngle += 10 * frameDelta;
            if (this.rotationAngle >= 360) {
                this.rotationAngle -= 360;
            }

            this.rotationRad = this.rotationAngle * Math.PI / 180;
            this.rotation = this.rotationRad;
        }

        if (this.rotatingSlow) {
            this.rotationAngle += frameDelta;
            if (this.rotationAngle >= 360) {
                this.rotationAngle -= 360;
            }

            this.rotationRad = this.rotationAngle * Math.PI / 180;
            this.rotation = this.rotationRad;
        }
    }

    engage(frameDelta) {
        this.spawnDelay += frameDelta;
        if (this.spawnDelay > 600) {
            this.spawnDelay -= 600;
            switch(this.spawnCount) {
                case 0: {
                    this.spawnLavaRock();
                    this.spawnCount++;
                }break;
                case 1: {
                    this.spawnPlasmaZone();
                    this.spawnCount++;
                }break;
                case 2: {
                    this.spawnPlasmaZone();
                    this.spawnCount++;
                }break;
                case 3: {
                    this.spawnPlasmaZone();
                    this.spawnCount++;
                }break;
                case 4: {
                    this.suckInPlasmaZones();
                    this.spawnCount++;
                }break;
                case 5: {
                    this.sucking = false;
                    for (let i=0; i < this.plasmaZones.length; i++) {
                        this.plasmaZones[i].markedForDestruction = true;
                    }
                    this.plasmaZones = [];

                    this.spawnProjectileWave();
                    this.spawnCount = 0;
                    this.bossShot1Delay = -450;
                }break;
            }
        }

        if (this.sucking) {
            for (let i=0; i < this.plasmaZones.length; i++) {
                if (Utils.intersect(this, this.plasmaZones[i])) {
                    this.plasmaZones[i].stationary = true;
                    this.plasmaZones[i].scale.set(this.plasmaZones[i].scale.x - 0.001);
                    if (this.plasmaZones[i].scale.x < 0) {
                        this.plasmaZones[i].scale.set(0);
                    }

                } else {
                    this.plasmaZones[i].stationary = false;
                }
            }
        } else {
            this.bossShot1Delay += frameDelta;
            if (this.bossShot1Delay > 1.25) {
                this.bossShot1Delay -= 1.25;
                let shotNormVector = Utils.getNormVector({'x': Math.cos(this.rotationRad), 'y': Math.sin(this.rotationRad)}, {'x': 0, 'y': 0});

                let projectileVelocity = 15;
                if (this.rotatingFast) {
                    projectileVelocity = 5;
                }
                arcInc.spawner.spawnEnemyProjectile(
                    this.x,
                    this.y,
                    shotNormVector.vx * projectileVelocity,
                    shotNormVector.vy * projectileVelocity,
                    "0xFF99BB",
                    this.stats.damage,
                    2);
            }
        }
    }

    approach(x, y) {
        if (Math.abs(this.x - x) > this.stats.baseMovementSpeed || Math.abs(this.y - y) > this.stats.baseMovementSpeed) {
            let normVector = Utils.getNormVector({"x": x, "y": y}, this);
            this.vx = normVector.vx * this.stats.baseMovementSpeed;
            this.vy = normVector.vy * this.stats.baseMovementSpeed;

            return true;
        } else {
            this.x = x;
            this.y = y;

            this.vx = 0;
            this.vy = 0;

            return false;
        }
    }

    spawnPlasmaZone() {
        let enemy = arcInc.spawner.spawnEnemy("plasmaZone", arcInc.sceneManager.scenes['main'].wave, 1);
        enemy.x = this.x;
        enemy.y = this.y;
        enemy.stats.wave = 0;
        this.plasmaZones.push(enemy);
    }

    spawnLavaRock() {
        let enemy = arcInc.spawner.spawnEnemy("lavaRock", arcInc.sceneManager.scenes['main'].wave, 1);
        enemy.x = this.x;
        enemy.y = this.y;
        enemy.stats.wave = 0;
    }

    spawnProjectileWave() {
        for (let i = 0; i < 30; i++) {
            let rotationRad = i*12 * Math.PI / 180;
            let shotNormVector = Utils.getNormVector({'x': Math.cos(rotationRad), 'y': Math.sin(rotationRad)}, {'x': 0, 'y': 0});
            let projectile = arcInc.spawner.spawnEnemyProjectile(
                this.x,
                this.y,
                shotNormVector.vx * 1.5,
                shotNormVector.vy * 1.5,
                "0x00FF00",
                this.stats.damage,
                2);
            projectile.scale.set(1.25);
            projectile.destroysScenery = true;
            projectile.oneShots = true;
        }
    }

    suckInPlasmaZones() {
        for (let i = 0; i < this.plasmaZones.length; i++) {
            let enemy = this.plasmaZones[i];
            let normVector = Utils.getNormVector(this, enemy);
            enemy.vx = normVector.vx;
            enemy.vy = normVector.vy;
            enemy.stationary = false;
            this.sucking = true;
        }
    }

    updateGuiElements() {
        this.healthBar.width = Utils.getEffectiveScreenWidth() * 0.75 * this.stats.currentHealth / this.stats.maxHealth;
        this.healthText.text = Utils.format(this.stats.currentHealth) + ' (' + Utils.format(100 * this.stats.currentHealth/this.stats.maxHealth, 2) + ' %)';
        this.healthText.x = Utils.getEffectiveScreenWidth()/2 - this.healthText.width/2;
    }

    removeGuiElements() {
        let guiContainer = arcInc.objectStore.get('guiContainer');
        guiContainer.removeChild(this.damageBar);
        guiContainer.removeChild(this.healthBar);
        guiContainer.removeChild(this.healthText);
    }

    beforeDestructor() {
        let enemyContainer = arcInc.objectStore.get('enemyContainer');
        for (let i = 0; i < enemyContainer.children.length; i++) {
            enemyContainer.children[i].markedForDestruction = true;
        }
    }
}
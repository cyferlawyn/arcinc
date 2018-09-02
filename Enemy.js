class Enemy extends PIXI.Sprite {
    constructor(texture, maxHealth) {
        super(texture);
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;

        let damageBar = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/DamageBar.png"].texture);
        damageBar.x = 0;
        damageBar.y = -10;
        damageBar.width = this.width;
        damageBar.height = 10;
        this.addChild(damageBar);

        let healthBar = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/HealthBar.png"].texture);
        healthBar.x = 0;
        healthBar.y = -10;
        healthBar.width = this.width;
        healthBar.height = 10;
        this.addChild(healthBar);
    }

    update() {
        this.currentHealth -= this.burnDamage;
        this.burnDamage *= 0.99;
        this.checkForDestruction();

        if (this.y > arcInc.pixiApp.screen.height / arcInc.pixiApp.stage.scale.y) {
            this.visible = false;
        } else {
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

                if (this.y > 40) {
                    this.y = 40;
                    this.vy = 0;
                    this.vx = 1;
                }

                if (this.x < 0) {
                    this.x = 0;
                    this.vx *= -1;
                }

                if (this.x + this.width > arcInc.pixiApp.screen.width / arcInc.pixiApp.stage.scale.x) {
                    this.x = arcInc.pixiApp.screen.width / arcInc.pixiApp.stage.scale.x - this.width;
                    this.vx *= -1;
                }
            }

            this.x += this.vx;
            this.y += this.vy;
        }
    }

    engage() {
        if (!this.isBoss) {
            if (arcInc.sceneManager.scenes['main'].frame % 120 === 0) {
                arcInc.sceneManager.scenes['main'].spawner.spawnEnemyProjectile(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    this.vxBase * 2,
                    this.vyBase * 2,
                    this.tint,
                    this.damage);
            }
        } else {
            let player = arcInc.sceneManager.scenes['main'].objectStore.get('player');


            if (arcInc.sceneManager.scenes['main'].frame % 5 === 0) {
                arcInc.sceneManager.scenes['main'].spawner.spawnEnemyProjectile(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    5 * Math.sin(arcInc.sceneManager.scenes['main'].frame / 10),
                    7,
                    "0x66DD66",
                    this.damage,
                    3);
            }

            if (arcInc.sceneManager.scenes['main'].frame % 3 === 0) {
                this.cascadeAngle += 15;
                let x = this.x + this.width/2;
                let y = this.y + this.height/2;

                let angle = this.cascadeAngle * Math.PI/180; //degress converted to radians
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

                arcInc.sceneManager.scenes['main'].spawner.spawnEnemyProjectile(
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
        let player = arcInc.sceneManager.scenes['main'].objectStore.get('player');
        if (this.currentHealth <= 0) {
            arcInc.savegame.credits += this.credits * player.stats.effectiveKillCreditMultiplier;
            arcInc.updateCredits();
            if (this.wave === arcInc.sceneManager.scenes['main'].wave) {
                arcInc.sceneManager.scenes['main'].remainingEnemies--;

                if (this.isBoss) {
                    arcInc.savegame.highestWave = this.wave + 1;
                    arcInc.saveSavegame();
                }
            }
            this.visible = false;
        } else {
            this.updateHealthBar();
        }
    }

    updateHealthBar() {
        this.children[1].width = this.width / this.scale.x * this.currentHealth / this.maxHealth;
    }
}
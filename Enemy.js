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
        this.checkForDestruction();
        if (this.y > arcInc.pixiApp.screen.height/arcInc.pixiApp.stage.scale.y) {
            this.visible = false;
        } else {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) {
                this.x = 0;
                this.vx *= -1;
                this.rotation = Math.atan2(this.vy, this.vx) - Math.PI/2;
            }

            if (this.x + this.width > arcInc.pixiApp.screen.width/arcInc.pixiApp.stage.scale.x) {
                this.x = arcInc.pixiApp.screen.width/arcInc.pixiApp.stage.scale.x - this.width;
                this.vx *= -1;
                this.rotation = Math.atan2(this.vy, this.vx) - Math.PI/2;
            }
        }
    }

    checkForDestruction() {
        if (this.currentHealth <= 0) {
            arcInc.savegame.credits += this.credits;
            arcInc.updateCredits();
            if (this.wave === arcInc.sceneManager.scenes['main'].wave) {
                arcInc.sceneManager.scenes['main'].remainingEnemies--;
            }
            this.visible = false;
        } else {
            this.updateHealthBar();
        }
    }

    updateHealthBar() {
        this.children[1].width = this.width * 2 * this.currentHealth / this.maxHealth;
    }
}
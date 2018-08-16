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

    updateHealthBar() {
        this.children[1].width = this.width * 2 * this.currentHealth / this.maxHealth;
    }
}
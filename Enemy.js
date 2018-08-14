class Enemy extends PIXI.Sprite {
    constructor(texture, maxHealth) {
        super(texture);
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;

        let healthBar = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/HealthBar.png"].texture);
        healthBar.x = 0;
        healthBar.y = -10;
        healthBar.width = this.width * 2;
        healthBar.height = 10;
        this.addChild(healthBar);
    }

    updateHealthBar() {
        this.children[0].width = this.width * 2 * this.currentHealth / this.maxHealth;
    }
}
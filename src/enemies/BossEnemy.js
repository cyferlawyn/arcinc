class BossEnemy extends Enemy{
    constructor(stats) {
        super(PIXI.Loader.shared.resources["assets/sprites/enemies/BossEnemy.png"].texture, stats);
    }

    prepareProperties() {
        this.scale.set(0.8);
        this.cascadeAngle = 0;
        this.bossShot1Delay = 0;
        this.bossShot2Delay = 0;
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

        if (this.y > 40 + this.height / 2) {
            this.y = 40 + this.height / 2;
            this.vy = 0;
            this.vx = 1;
        }

        if (this.x < this.width / 2) {
            this.x = this.width / 2;
            this.vx *= -1;
        }

        if (this.x + this.width / 2 > Utils.getEffectiveScreenWidth()) {
            this.x = Utils.getEffectiveScreenWidth() - this.width / 2;
            this.vx *= -1;
        }

        this.x += this.vx * frameDelta;
        this.y += this.vy * frameDelta;

        if (Utils.leftBounds(this)) {
            this.markedForDestruction = true;
        }
    }

    engage(frameDelta) {
        this.bossShot1Delay += frameDelta;
        if (this.bossShot1Delay > 5) {
            this.bossShot1Delay -= 5;
            arcInc.spawner.spawnEnemyProjectile(
                this.x,
                this.y,
                5 * Math.sin(arcInc.sceneManager.scenes['main'].frame / 10),
                7,
                "0x66DD66",
                this.stats.damage,
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
                this.stats.damage,
                2);
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
}
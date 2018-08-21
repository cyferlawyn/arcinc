class UpgradeScene extends Scene {
    constructor(arcInc) {
        super('upgrade', arcInc.pixiApp);
        this.arcInc = arcInc;
        this.pixiApp = arcInc.pixiApp;
        this.init();
    }

    init() {
        let creditsStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 36,
            fill: "white",
            stroke: 'black',
            strokeThickness: 4
        });

        // warp button
        let warpButton = new Button(this.pixiApp.screen.width/this.pixiApp.stage.scale.x - 55, this.pixiApp.screen.height/this.pixiApp.stage.scale.y - 55, 50, 50);
        warpButton.on('click', function() {
            arcInc.sceneManager.resetScene('main');
            arcInc.sceneManager.loadScene('main');
        });
        warpButton.on('tap', function() {
            arcInc.sceneManager.resetScene('main');
            arcInc.sceneManager.loadScene('main');
        });
        this.addChild(warpButton);

        // credits text
        this.credits = new PIXI.Text('0$', creditsStyle);
        this.credits.position.set(5, 5);
        this.addChild(this.credits);

        // fps text
        this.fps = new PIXI.Text(this.pixiApp.ticker.FPS, creditsStyle);
        this.fps.position.set(this.pixiApp.renderer.view.width - 125, 5);
        this.addChild(this.fps);

        let player = this.arcInc.sceneManager.scenes['main'].objectStore.get('player');
        let posX = 35;
        let posY = 75;

        this.upgrades = {};

        for (let i = 0; i < Object.keys(player.upgrades).length; i++) {
            let upgradeKey = Object.keys(player.upgrades)[i];
            let upgradeValue = player.upgrades[upgradeKey];

            this.upgrades[upgradeKey] = new Upgrade(upgradeKey, upgradeValue.title, upgradeValue.cost, upgradeValue.effect, this.arcInc.savegame.upgrades[upgradeKey]);
            this.upgrades[upgradeKey].position.set(posX, posY);

            this.addChild(this.upgrades[upgradeKey]);

            if (posX <= 635) {
                posX += 200;
            } else {
                posX = 35;
                posY += 325;
            }
        }
    }

    update() {
        this.credits.text = this.arcInc.savegame.credits + '$';
        this.fps.text = Math.round(this.pixiApp.ticker.FPS) + ' FPS';

        let player = this.arcInc.sceneManager.scenes['main'].objectStore.get('player');
        for (let i = 0; i < Object.keys(player.upgrades).length; i++) {
            let upgradeName = Object.keys(player.upgrades)[i];
            this.upgrades[upgradeName].level = this.arcInc.savegame.upgrades[upgradeName];
            this.upgrades[upgradeName].update();
        }
    }

    reset() {

    }
}
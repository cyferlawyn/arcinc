class UpgradeScene extends Scene {
    constructor(pixiApp) {
        super('upgrade', pixiApp);
        this.pixiApp = pixiApp;
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
        let warpButton = new Button(this.pixiApp.renderer.view.width - 55, this.pixiApp.renderer.view.height - 55, 50, 50);
        warpButton.on('click', function() {
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

        this.upgrade1 = new Upgrade('Movement\n   Speed', 10, 0, 0.05);
        this.upgrade1.position.set(35, 75);
        this.upgrade1.on('click', function(){
            let player = arcInc.sceneManager.scenes['main'].objectStore.get('player');
            player.upgrade('movementSpeed');
        });
        this.addChild(this.upgrade1);

        this.upgrade2 = new Upgrade(' Shield\nAmount', 10, 0, 0.05);
        this.upgrade2.position.set(235, 75);
        this.addChild(this.upgrade2);

        this.upgrade3 = new Upgrade('  Shield\nRecharge', 10, 0, 0.05);
        this.upgrade3.position.set(435, 75);
        this.addChild(this.upgrade3);

        this.upgrade4 = new Upgrade(' Armor\nAmount', 10, 0, 0.05);
        this.upgrade4.position.set(635, 75);
        this.addChild(this.upgrade4);

        this.upgrade5 = new Upgrade('Structure\n Amount', 10, 0, 0.05);
        this.upgrade5.position.set(835, 75);
        this.addChild(this.upgrade5);

        this.upgrade6 = new Upgrade('Projectile\n Damage', 10, 0, 0.05);
        this.upgrade6.position.set(35, 400);
        this.addChild(this.upgrade6);

        this.upgrade7 = new Upgrade('Projectile\n Velocity', 10, 0, 0.05);
        this.upgrade7.position.set(235, 400);
        this.addChild(this.upgrade7);

        this.upgrade8 = new Upgrade('Projectile\n Amount', 10, 5, 1);
        this.upgrade8.position.set(435, 400);
        this.addChild(this.upgrade8);

        this.upgrade9 = new Upgrade('Rate of\n   Fire', 10, 0, 0.05);
        this.upgrade9.position.set(635, 400);
        this.addChild(this.upgrade9);

        this.upgrade10 = new Upgrade('???', 0, 0, 0);
        this.upgrade10.position.set(835, 400);
        this.upgrade10.visible = false;
        this.addChild(this.upgrade10);
    }

    update() {
        let player = arcInc.sceneManager.scenes['main'].objectStore.get('player');
        let credits = player.credits;
        this.credits.text = credits + '$';
        this.fps.text = Math.round(this.pixiApp.ticker.FPS) + ' FPS';

        this.upgrade1.level = player.upgrades['movementSpeed'];
        if (credits >= this.upgrade1.cost) {
            this.upgrade1.children[0].tint = 0x33ff33;
        } else {
            this.upgrade1.children[0].tint = 0xff3333;
        }
        this.upgrade1.update();

        if (credits >= this.upgrade2.cost) {
            this.upgrade2.children[0].tint = 0x33ff33;
        } else {
            this.upgrade2.children[0].tint = 0xff3333;
        }

        if (credits >= this.upgrade3.cost) {
            this.upgrade3.children[0].tint = 0x33ff33;
        } else {
            this.upgrade3.children[0].tint = 0xff3333;
        }

        if (credits >= this.upgrade4.cost) {
            this.upgrade4.children[0].tint = 0x33ff33;
        } else {
            this.upgrade4.children[0].tint = 0xff3333;
        }

        if (credits >= this.upgrade5.cost) {
            this.upgrade5.children[0].tint = 0x33ff33;
        } else {
            this.upgrade5.children[0].tint = 0xff3333;
        }

        if (credits >= this.upgrade6.cost) {
            this.upgrade6.children[0].tint = 0x33ff33;
        } else {
            this.upgrade6.children[0].tint = 0xff3333;
        }

        if (credits >= this.upgrade7.cost) {
            this.upgrade7.children[0].tint = 0x33ff33;
        } else {
            this.upgrade7.children[0].tint = 0xff3333;
        }

        if (credits >= this.upgrade8.cost) {
            this.upgrade8.children[0].tint = 0x33ff33;
        } else {
            this.upgrade8.children[0].tint = 0xff3333;
        }

        if (credits >= this.upgrade9.cost) {
            this.upgrade9.children[0].tint = 0x33ff33;
        } else {
            this.upgrade9.children[0].tint = 0xff3333;
        }

        if (credits >= this.upgrade10.cost) {
            this.upgrade10.children[0].tint = 0x33ff33;
        } else {
            this.upgrade10.children[0].tint = 0xff3333;
        }
    }

    reset() {

    }
}
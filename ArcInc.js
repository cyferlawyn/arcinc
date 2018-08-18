class ArcInc {
    init() {
        this.initPixiApp();
        this.initSavegame();
        this.initKeyboard();
        this.initScenes();

        window.setInterval(arcInc.saveSavegame, 5000);
    }

    initPixiApp() {
        this.pixiApp = new PIXI.Application(
            {
                width: 1024,
                height: 768
            }
        );

        document.body.appendChild(this.pixiApp.view);
    }

    initScenes() {
        this.sceneManager = new SceneManager(this);
        this.sceneManager.registerScene(new MainScene(this));
        this.sceneManager.registerScene(new UpgradeScene(this));
        this.sceneManager.loadScene('main');
    }

    initKeyboard() {
        window.addEventListener('keypress', function (event) {

            if (event.keyCode === 32) {
                arcInc.sceneManager.paused = !arcInc.sceneManager.paused;
            }

            event.preventDefault();
        });
    }

    initSavegame() {
        this.savegame = JSON.parse(localStorage.getItem('savegame'));
        if (this.savegame === null) {
            this.savegame = new Savegame();
            this.saveSavegame();
        }

        // Fill update-induced gaps
        if (!this.savegame.upgrades.hasOwnProperty('projectileSpread')) {
            this.savegame.upgrades['projectileSpread'] = 0;
        }

        if (!this.savegame.hasOwnProperty('highestWave')) {
            this.savegame['highestWave'] = 0;
        }
    }

    saveSavegame() {
        localStorage.setItem('savegame', JSON.stringify(arcInc.savegame));
    }
}

class ArcInc {
    constructor() {
        this.init();
    }

    init() {
        this.initPixiApp();
        this.initScenes();
        this.initKeyboard();
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
        this.sceneManager = new SceneManager(this.pixiApp);
        this.sceneManager.registerScene(new MainScene(this.pixiApp));
        this.sceneManager.registerScene(new UpgradeScene(this.pixiApp));
        this.sceneManager.loadScene('upgrade');
    }

    initKeyboard() {
        window.addEventListener('keypress', function (event) {

            if (event.keyCode === 32) {
                arcInc.sceneManager.paused = !arcInc.sceneManager.paused;
            }

            event.preventDefault();
        });
    }
}

let arcInc;
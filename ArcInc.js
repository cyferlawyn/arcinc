class ArcInc {
    constructor() {
        this.init();
    }

    init() {
        this.initPixiApp();
        this.initScenes();
    }

    initPixiApp() {
        this.pixiApp = new PIXI.Application(
            {
                width: 800,
                height: 600
            }
        );

        document.body.appendChild(this.pixiApp.view);
    }

    initScenes() {
        this.sceneManager = new SceneManager(this.pixiApp);
        this.sceneManager.registerScene(new MainScene(this.pixiApp));
        this.sceneManager.loadScene('main');
    }
}

let arcInc;
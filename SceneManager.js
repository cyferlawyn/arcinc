class SceneManager {
    constructor (arcInc) {
        this.arcInc = arcInc;
        this.pixiApp = arcInc.pixiApp;
        this.scenes = [];
        this.currentScene = undefined;
        this.paused = false;
        this.pixiApp.ticker.add(delta => this.update(delta));
    }

    update() {
        if (!this.paused) {
            let frameDelta = 60 * this.pixiApp.ticker.elapsedMS / 1000;
            this.currentScene.update(frameDelta);
        }
    }

    registerScene(scene) {
        scene.visible = false;
        this.scenes[scene.id] = scene;
        this.pixiApp.stage.addChild(scene);
    }

    loadScene(id) {
        if (this.currentScene !== undefined) {
            this.currentScene.visible = false;
        }

        this.currentScene = this.scenes[id];
        this.currentScene.visible = true;
    }

    resetScene(id) {
        this.scenes[id].reset();
    }
}
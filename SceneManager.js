class SceneManager {
    constructor (pixiApp) {
        this.scenes = [];
        this.currentScene = undefined;
        this.pixiApp = pixiApp;
        this.pixiApp.ticker.add(delta=> this.update(delta));
    }

    update() {
        this.currentScene.frame += 1;
        this.currentScene.update();
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
}
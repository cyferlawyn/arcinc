class Scene extends PIXI.Container{
    constructor(id, pixiApp) {
        super();
        this.id = id;
        this.pixiApp = pixiApp;
        this.frame = 0;
    }
}
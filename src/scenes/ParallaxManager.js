class ParallaxManager {
    constructor() {
        this.init();

        this.id = 'ParallaxManager';
        arcInc.eventEmitter.subscribe(Events.MOVEMENT_PHASE_STARTED,this.id, this.move.bind(this));
    }


    init() {
        let backgroundContainer = arcInc.objectStore.get('backgroundContainer');

        this.backgroundFarLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/bg-far.png'].texture, 1024, 1024);
        this.backgroundFarLayer.position.x = 0;
        this.backgroundFarLayer.position.y = 0;
        backgroundContainer.addChild(this.backgroundFarLayer);

        this.backgroundMidLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/bg-mid.png'].texture, 1024, 1024);
        this.backgroundMidLayer.position.x = 0;
        this.backgroundMidLayer.position.y = 0;
        backgroundContainer.addChild(this.backgroundMidLayer);

        this.backgroundMidNearLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/bg-mid-near.png'].texture, 1024, 1024);
        this.backgroundMidNearLayer.position.x = 0;
        this.backgroundMidNearLayer.position.y = 0;
        backgroundContainer.addChild(this.backgroundMidNearLayer);

        this.backgroundNearLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/bg-near.png'].texture, 1024, 1024);
        this.backgroundNearLayer.position.x = 0;
        this.backgroundNearLayer.position.y = 0;
        backgroundContainer.addChild(this.backgroundNearLayer);

        this.backgroundVeryNearLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/bg-very-near.png'].texture, 1024, 1024);
        this.backgroundVeryNearLayer.position.x = 0;
        this.backgroundVeryNearLayer.position.y = 0;
        backgroundContainer.addChild(this.backgroundVeryNearLayer);
    }

    move(frameDelta) {
        this.backgroundFarLayer.tilePosition.y += 0.05 * frameDelta;
        this.backgroundMidLayer.tilePosition.y += 0.2 * frameDelta;
        this.backgroundMidNearLayer.tilePosition.y += 0.25 * frameDelta;
        this.backgroundNearLayer.tilePosition.y += 0.3 * frameDelta;
        this.backgroundVeryNearLayer.tilePosition.y += 0.4 * frameDelta;
    }
}
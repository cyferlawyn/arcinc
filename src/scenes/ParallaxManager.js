class ParallaxManager {
    static prepare() {
        let backgroundContainer = arcInc.objectStore.get('backgroundContainer');

        let backgroundFarLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/bg-far.png'].texture, 1024, 1024);
        backgroundFarLayer.position.x = 0;
        backgroundFarLayer.position.y = 0;
        backgroundContainer.addChild(backgroundFarLayer);
        arcInc.objectStore.put('backgroundFarLayer', backgroundFarLayer);

        let backgroundMidLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/bg-mid.png'].texture, 1024, 1024);
        backgroundMidLayer.position.x = 0;
        backgroundMidLayer.position.y = 0;
        backgroundContainer.addChild(backgroundMidLayer);
        arcInc.objectStore.put('backgroundMidLayer', backgroundMidLayer);

        let backgroundMidNearLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/bg-mid-near.png'].texture, 1024, 1024);
        backgroundMidNearLayer.position.x = 0;
        backgroundMidNearLayer.position.y = 0;
        backgroundContainer.addChild(backgroundMidNearLayer);
        arcInc.objectStore.put('backgroundMidNearLayer', backgroundMidNearLayer);

        let backgroundNearLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/bg-near.png'].texture, 1024, 1024);
        backgroundNearLayer.position.x = 0;
        backgroundNearLayer.position.y = 0;
        backgroundContainer.addChild(backgroundNearLayer);
        arcInc.objectStore.put('backgroundNearLayer', backgroundNearLayer);

        let backgroundVeryNearLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/bg-very-near.png'].texture, 1024, 1024);
        backgroundVeryNearLayer.position.x = 0;
        backgroundVeryNearLayer.position.y = 0;
        backgroundContainer.addChild(backgroundVeryNearLayer);
        arcInc.objectStore.put('backgroundVeryNearLayer', backgroundVeryNearLayer);
    }

    static update(frameDelta) {
        arcInc.objectStore.get('backgroundFarLayer').tilePosition.y += 0.05 * frameDelta;
        arcInc.objectStore.get('backgroundMidLayer').tilePosition.y += 0.2 * frameDelta;
        arcInc.objectStore.get('backgroundMidNearLayer').tilePosition.y += 0.25 * frameDelta;
        arcInc.objectStore.get('backgroundNearLayer').tilePosition.y += 0.3 * frameDelta;
        arcInc.objectStore.get('backgroundVeryNearLayer').tilePosition.y += 0.4 * frameDelta;
    }
}
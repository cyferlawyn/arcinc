class AssetLoader {
    static init() {
        PIXI.Loader.shared
            .add('assets/sprites/A1.png')
            .add('assets/sprites/A5.png')
            .add('assets/sprites/HealthBar.png')
            .add('assets/sprites/Bullet.png')
            .add('assets/sprites/Bullet2.png')
            .add('assets/textures/28884-8-galaxy-photos.png')
            .add('assets/textures/Parallax60.png')
            .add('assets/sprites/particle.png')
            .load(AssetLoader.onAssetsLoaded);
    }

    static onAssetsLoaded(){
        arcInc = new ArcInc();
    }
}

AssetLoader.init();
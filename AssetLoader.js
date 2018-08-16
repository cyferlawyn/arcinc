class AssetLoader {
    static init() {
        PIXI.Loader.shared
            .add('assets/sprites/A1.png')
            .add('assets/sprites/A5.png')
            .add('assets/sprites/HealthBar.png')
            .add('assets/sprites/DamageBar.png')
            .add('assets/sprites/Bullet.png')
            .add('assets/sprites/Bullet2.png')
            .add('assets/sprites/particle.png')
            .add('assets/textures/NebulaBlue.png')
            .add('assets/textures/StarsSmall_1.png')
            .add('assets/textures/StarsSmall_2.png')

            .load(AssetLoader.onAssetsLoaded);
    }

    static onAssetsLoaded(){
        arcInc = new ArcInc();
    }
}

AssetLoader.init();
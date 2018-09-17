class AssetLoader {
    static init() {
        PIXI.Loader.shared
            .add('assets/sprites/enemies/CrawlerEnemy.png')
            .add('assets/sprites/enemies/BossEnemy.png')
            .add('assets/sprites/enemies/AsteroidEnemy.png')
            .add('assets/sprites/enemies/SuicideBomberEnemy.png')
            .add('assets/sprites/enemies/IndustrialMinerEnemy.png')
            .add('assets/sprites/enemies/BlockyEnemy.png')

            .add('assets/sprites/abilities/armorRepairer.png')
            .add('assets/sprites/abilities/comingSoon.png')
            .add('assets/sprites/abilities/tacticalNuke.png')
            .add('assets/sprites/abilities/blackHole.png')

            .add('assets/sprites/A5.png')
            .add('assets/sprites/HealthBar.png')
            .add('assets/sprites/DamageBar.png')
            .add('assets/sprites/EnergyBar.png')
            .add('assets/sprites/Bullet.png')
            .add('assets/sprites/Bullet2.png')
            .add('assets/sprites/Bullet3.png')
            .add('assets/sprites/Laser.png')

            .add('assets/sprites/TacticalNuke.png')
            .add('assets/sprites/BlackHole.png')

            .add('assets/particles/Explosion.png')

            .add('assets/textures/bg-far.png')
            .add('assets/textures/bg-mid.png')
            .add('assets/textures/bg-mid-near.png')
            .add('assets/textures/bg-near.png')
            .add('assets/textures/bg-very-near.png')

            .load(AssetLoader.onAssetsLoaded);
    }

    static onAssetsLoaded(){
        window.arcInc = new ArcInc();
        arcInc.init();
    }
}

AssetLoader.init();
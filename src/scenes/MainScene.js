class MainScene extends Scene{
    constructor(arcInc) {
        super('main', arcInc.pixiApp);
        this.pixiApp = arcInc.pixiApp;
        this.init();
        this.frame = 0;
    }

    init() {
        this.now = Date.now();
        this.elapsed = Date.now();
        this.wave = arcInc.savegame.highestWave - 1;
        if (this.wave < 0) {
            this.wave = 0;
        }
        this.framesTillWave = 0;

        this.initContainer();
        this.initBackground();
        this.initGui();
        this.initAbilities();
        this.initPlayer();
    }

    reset() {
        let enemyContainer = arcInc.objectStore.get('enemyContainer');
        for (let i = 0; i < enemyContainer.children.length; i++) {
            enemyContainer.children[i].visible = false;
        }

        let enemyProjectileContainer = arcInc.objectStore.get('enemyProjectileContainer');
        for (let i = 0; i < enemyProjectileContainer.children.length; i++) {
            enemyProjectileContainer.children[i].visible = false;
        }

        let playerProjectileContainer = arcInc.objectStore.get('playerProjectileContainer');
        for (let i = 0; i < playerProjectileContainer.children.length; i++) {
            playerProjectileContainer.children[i].visible = false;
        }

        let player = arcInc.objectStore.get('player');
        player.currentShield = player.stats.effectiveMaxShield;
        player.currentArmor = player.stats.effectiveMaxArmor;
        player.currentEnergy = player.stats.effectiveMaxEnergy;

        this.wave = Math.floor(arcInc.savegame.highestWave - 1);
        if (this.wave < 0) {
            this.wave = 0;
        }
    }

    initContainer() {
        let backgroundContainer = new PIXI.Container();
        this.addChild(backgroundContainer);
        arcInc.objectStore.put('backgroundContainer', backgroundContainer);

        let playerProjectileContainer = new PIXI.Container();
        this.addChild(playerProjectileContainer);
        arcInc.objectStore.put('playerProjectileContainer', playerProjectileContainer);

        let enemyProjectileContainer = new PIXI.Container();
        this.addChild(enemyProjectileContainer);
        arcInc.objectStore.put('enemyProjectileContainer', enemyProjectileContainer);

        let enemyContainer = new PIXI.Container();
        this.addChild(enemyContainer);
        arcInc.objectStore.put('enemyContainer', enemyContainer);

        let playerContainer = new PIXI.Container();
        this.addChild(playerContainer);
        arcInc.objectStore.put('playerContainer', playerContainer);

        let guiContainer = new PIXI.Container();
        this.addChild(guiContainer);
        arcInc.objectStore.put('guiContainer', guiContainer);
    }

    initBackground() {
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

    initGui() {
        let guiContainer = arcInc.objectStore.get('guiContainer');

        let creditsStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 24,
            fill: "white",
            stroke: 'black',
            strokeThickness: 4
        });

        let healthStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 15,
            fill: "white",
            stroke: 'black',
            strokeThickness: 3
        });

        let fps = new PIXI.Text(this.pixiApp.ticker.FPS, creditsStyle);
        fps.position.set(this.pixiApp.screen.width/this.pixiApp.stage.scale.x - 125, 5);
        guiContainer.addChild(fps);
        arcInc.objectStore.put('fps', fps);

        let wave = new PIXI.Text('Wave: ' + this.wave, creditsStyle);
        wave.position.set(this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2 - this.wave.width/2, 5);
        guiContainer.addChild(wave);
        arcInc.objectStore.put('wave', wave);

        let shieldDamage = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/DamageBar.png"].texture);
        shieldDamage.x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2-100;
        shieldDamage.y = this.pixiApp.screen.height/this.pixiApp.stage.scale.y -60;
        shieldDamage.width = 200;
        shieldDamage.height = 15;
        guiContainer.addChild(shieldDamage);

        let shieldBar = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/HealthBar.png"].texture);
        shieldBar.x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2-100;
        shieldBar.y = this.pixiApp.screen.height/this.pixiApp.stage.scale.y -60;
        shieldBar.width = 200;
        shieldBar.height = 15;
        guiContainer.addChild(shieldBar);
        arcInc.objectStore.put('shieldBar', shieldBar);

        let shield = new PIXI.Text('0 / 0', healthStyle);
        shield.position.set(this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2-40, this.pixiApp.screen.height/this.pixiApp.stage.scale.y -63);
        guiContainer.addChild(shield);
        arcInc.objectStore.put('shield', shield);

        let armorDamage = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/DamageBar.png"].texture);
        armorDamage.x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2-100;
        armorDamage.y = this.pixiApp.screen.height/this.pixiApp.stage.scale.y -40;
        armorDamage.width = 200;
        armorDamage.height = 15;
        guiContainer.addChild(armorDamage);

        let armorBar = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/HealthBar.png"].texture);
        armorBar.x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2-100;
        armorBar.y = this.pixiApp.screen.height/this.pixiApp.stage.scale.y -40;
        armorBar.width = 200;
        armorBar.height = 15;
        guiContainer.addChild(armorBar);
        arcInc.objectStore.put('armorBar', armorBar);

        let armor = new PIXI.Text('0 / 0', healthStyle);
        armor.position.set(this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2-40, this.pixiApp.screen.height/this.pixiApp.stage.scale.y -43);
        guiContainer.addChild(armor);
        arcInc.objectStore.put('armor', armor);

        let energyBackdrop = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/DamageBar.png"].texture);
        energyBackdrop.x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2-100;
        energyBackdrop.y = this.pixiApp.screen.height/this.pixiApp.stage.scale.y -20;
        energyBackdrop.width = 200;
        energyBackdrop.height = 15;
        guiContainer.addChild(energyBackdrop);

        let energyBar = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/EnergyBar.png"].texture);
        energyBar.x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2-100;
        energyBar.y = this.pixiApp.screen.height/this.pixiApp.stage.scale.y -20;
        energyBar.width = 200;
        energyBar.height = 15;
        guiContainer.addChild(energyBar);
        arcInc.objectStore.put('energyBar', energyBar);

        let energy = new PIXI.Text('0 / 0', healthStyle);
        energy.position.set(this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2-40, this.pixiApp.screen.height/this.pixiApp.stage.scale.y -23);
        guiContainer.addChild(energy);
        arcInc.objectStore.put('energy', energy);
    }

    initPlayer() {
        let playerContainer = arcInc.objectStore.get('playerContainer');
        let player = new Player(
            PIXI.Loader.shared.resources["assets/sprites/A5.png"].texture,
            this.pixiApp.screen.width/this.pixiApp.stage.scale.x,
            this.pixiApp.screen.height/this.pixiApp.stage.scale.y);
        player.scale.set(0.5);
        player.x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2 - player.width/2;
        player.y = this.pixiApp.screen.height/this.pixiApp.stage.scale.y - player.height;
        playerContainer.addChild(player);
        arcInc.objectStore.put('player', player);
    }

    update(frameDelta) {
        this.frame += frameDelta;

        this.updateBackground(frameDelta);
        this.updatePlayer(frameDelta);
        this.updateEnemies(frameDelta);
        this.updateProjectiles(frameDelta);
        this.checkForCollisions();
        this.updateGui();
        arcInc.objectStore.get('abilityBar').update(frameDelta);
    }

    updateBackground(frameDelta) {

        arcInc.objectStore.get('backgroundFarLayer').tilePosition.y += 0.05 * frameDelta;
        arcInc.objectStore.get('backgroundMidLayer').tilePosition.y += 0.2 * frameDelta;
        arcInc.objectStore.get('backgroundMidNearLayer').tilePosition.y += 0.25 * frameDelta;
        arcInc.objectStore.get('backgroundNearLayer').tilePosition.y += 0.3 * frameDelta;
        arcInc.objectStore.get('backgroundVeryNearLayer').tilePosition.y += 0.4 * frameDelta;
    }

    updatePlayer(frameDelta) {
        let player = arcInc.objectStore.get('player');

        player.update(frameDelta);
    }

    updateEnemies(frameDelta) {
        this.framesTillWave -= frameDelta;
        let enemyContainer = arcInc.objectStore.get('enemyContainer');

        if (this.framesTillWave <= 0 || this.remainingEnemies === 0) {
            this.wave++;
            StatsAndFormulas.update();
            this.framesTillWave = 600;
            this.remainingEnemies = arcInc.spawner.spawnEnemyWave(this.wave);
        }
            for (let enemyIndex = enemyContainer.children.length - 1; enemyIndex >= 0; enemyIndex--) {
                let enemy = enemyContainer.children[enemyIndex];
                if (enemy.visible) {
                    enemy.update(frameDelta);
                    enemy.engage(frameDelta);
                }
            }
    }

    updateProjectiles(frameDelta) {
        let playerProjectileContainer = arcInc.objectStore.get('playerProjectileContainer');

        for (let playerProjectileIndex = playerProjectileContainer.children.length - 1; playerProjectileIndex >= 0; playerProjectileIndex--) {
            let playerProjectile = playerProjectileContainer.children[playerProjectileIndex];

            if (playerProjectile.visible) {
                if (playerProjectile.y < 0) {
                    playerProjectile.visible = false;
                } else {
                    playerProjectile.x += playerProjectile.vx * frameDelta;
                    playerProjectile.y += playerProjectile.vy * frameDelta;
                }
            }
        }

        let enemyProjectileContainer = arcInc.objectStore.get('enemyProjectileContainer');

        for (let enemyProjectileIndex = enemyProjectileContainer.children.length - 1; enemyProjectileIndex >= 0; enemyProjectileIndex--) {
            let enemyProjectile = enemyProjectileContainer.children[enemyProjectileIndex];
            if (enemyProjectile.visible) {
                if (enemyProjectile.y > this.pixiApp.screen.height/this.pixiApp.stage.scale.y) {
                    enemyProjectile.visible = false;
                } else {
                    enemyProjectile.x += enemyProjectile.vx * frameDelta;
                    enemyProjectile.y += enemyProjectile.vy * frameDelta;
                }
            }
        }
    }

    checkForCollisions() {
        let enemyContainer = arcInc.objectStore.get('enemyContainer');
        let playerProjectileContainer = arcInc.objectStore.get('playerProjectileContainer');
        let player = arcInc.objectStore.get('player');

        for (let enemyIndex = enemyContainer.children.length - 1; enemyIndex >= 0; enemyIndex--) {
            for (let projectileIndex = playerProjectileContainer.children.length - 1; projectileIndex >= 0; projectileIndex--) {
                let projectile = playerProjectileContainer.children[projectileIndex];
                let enemy = enemyContainer.children[enemyIndex];

                if (projectile.visible && enemy.visible && !projectile.ignore.includes(enemy.id)) {
                    if (Utils.intersect(enemy, projectile)) {
                        player.hits(enemy, projectile);
                    }
                }
            }
        }

        let enemyProjectileContainer = arcInc.objectStore.get('enemyProjectileContainer');

        for (let enemyProjectileIndex = 0; enemyProjectileIndex < enemyProjectileContainer.children.length; enemyProjectileIndex++) {
            let enemyProjectile = enemyProjectileContainer.children[enemyProjectileIndex];
            if (enemyProjectile.visible) {
                if (Utils.intersect(player, enemyProjectile)) {
                    player.isHit(enemyProjectile);

                }
            }
        }
    }

    updateGui() {
        arcInc.objectStore.get('fps').text = Math.round(this.pixiApp.ticker.FPS) + ' FPS';
        arcInc.objectStore.get('wave').text = 'Wave: ' + this.wave + ' [' + this.remainingEnemies + ' remaining]';
        arcInc.objectStore.get('wave').x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2 - arcInc.objectStore.get('wave').width/2;

        let player = arcInc.objectStore.get('player');
        arcInc.objectStore.get('shieldBar').width = 200 * player.currentShield / player.stats.effectiveMaxShield;
        arcInc.objectStore.get('shield').text = '' + Utils.format(Math.floor(player.currentShield), 3)  + ' / ' + Utils.format(Math.floor(player.stats.effectiveMaxShield), 3);
        arcInc.objectStore.get('shield').x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2 - arcInc.objectStore.get('shield').width/2;

        arcInc.objectStore.get('armorBar').width = 200 * player.currentArmor / player.stats.effectiveMaxArmor;
        arcInc.objectStore.get('armor').text = '' + Utils.format(Math.floor(player.currentArmor), 3)  + ' / ' + Utils.format(Math.floor(player.stats.effectiveMaxArmor), 3);
        arcInc.objectStore.get('armor').x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2 - arcInc.objectStore.get('armor').width/2;

        arcInc.objectStore.get('energyBar').width = 200 * player.currentEnergy/ player.stats.effectiveMaxEnergy;
        arcInc.objectStore.get('energy').text = '' + Utils.format(Math.floor(player.currentEnergy), 3)  + ' / ' + Utils.format(Math.floor(player.stats.effectiveMaxEnergy), 3);
        arcInc.objectStore.get('energy').x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2 - arcInc.objectStore.get('energy').width/2;
    }

    initAbilities() {
        let guiContainer = arcInc.objectStore.get('guiContainer');
        let abilityBar = new AbilityBar(arcInc.objectStore);
        abilityBar.init();
        abilityBar.y = this.pixiApp.screen.height/this.pixiApp.stage.scale.y - abilityBar.height - 10;
        abilityBar.x = 10;
        guiContainer.addChild(abilityBar);
        arcInc.objectStore.put('abilityBar', abilityBar);
    }
}
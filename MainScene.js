class MainScene extends Scene{
    constructor(arcInc) {
        super('main', arcInc.pixiApp);
        this.pixiApp = arcInc.pixiApp;
        this.init();
    }

    init() {
        this.objectStore = new ObjectStore();
        this.spawner = new Spawner(this.pixiApp, this.objectStore);
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
        let enemyContainer = this.objectStore.get('enemyContainer');
        for (let i = 0; i < enemyContainer.children.length; i++) {
            enemyContainer.children[i].visible = false;
        }

        let enemyProjectileContainer = this.objectStore.get('enemyProjectileContainer');
        for (let i = 0; i < enemyProjectileContainer.children.length; i++) {
            enemyProjectileContainer.children[i].visible = false;
        }

        let playerProjectileContainer = this.objectStore.get('playerProjectileContainer');
        for (let i = 0; i < playerProjectileContainer.children.length; i++) {
            playerProjectileContainer.children[i].visible = false;
        }

        let player = this.objectStore.get('player');
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
        this.objectStore.put('backgroundContainer', backgroundContainer);

        let playerProjectileContainer = new PIXI.Container();
        this.addChild(playerProjectileContainer);
        this.objectStore.put('playerProjectileContainer', playerProjectileContainer);

        let enemyProjectileContainer = new PIXI.Container();
        this.addChild(enemyProjectileContainer);
        this.objectStore.put('enemyProjectileContainer', enemyProjectileContainer);

        let enemyContainer = new PIXI.Container();
        this.addChild(enemyContainer);
        this.objectStore.put('enemyContainer', enemyContainer);

        let playerContainer = new PIXI.Container();
        this.addChild(playerContainer);
        this.objectStore.put('playerContainer', playerContainer);

        let guiContainer = new PIXI.Container();
        this.addChild(guiContainer);
        this.objectStore.put('guiContainer', guiContainer);
    }

    initBackground() {
        let backgroundContainer = this.objectStore.get('backgroundContainer');

        let backgroundFarLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/bg-far.png'].texture, 1024, 1024);
        backgroundFarLayer.position.x = 0;
        backgroundFarLayer.position.y = 0;
        backgroundContainer.addChild(backgroundFarLayer);
        this.objectStore.put('backgroundFarLayer', backgroundFarLayer);

        let backgroundMidLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/bg-mid.png'].texture, 1024, 1024);
        backgroundMidLayer.position.x = 0;
        backgroundMidLayer.position.y = 0;
        backgroundContainer.addChild(backgroundMidLayer);
        this.objectStore.put('backgroundMidLayer', backgroundMidLayer);

        let backgroundMidNearLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/bg-mid-near.png'].texture, 1024, 1024);
        backgroundMidNearLayer.position.x = 0;
        backgroundMidNearLayer.position.y = 0;
        backgroundContainer.addChild(backgroundMidNearLayer);
        this.objectStore.put('backgroundMidNearLayer', backgroundMidNearLayer);

        let backgroundNearLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/bg-near.png'].texture, 1024, 1024);
        backgroundNearLayer.position.x = 0;
        backgroundNearLayer.position.y = 0;
        backgroundContainer.addChild(backgroundNearLayer);
        this.objectStore.put('backgroundNearLayer', backgroundNearLayer);

        let backgroundVeryNearLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/bg-very-near.png'].texture, 1024, 1024);
        backgroundVeryNearLayer.position.x = 0;
        backgroundVeryNearLayer.position.y = 0;
        backgroundContainer.addChild(backgroundVeryNearLayer);
        this.objectStore.put('backgroundVeryNearLayer', backgroundVeryNearLayer);
    }

    initGui() {
        let guiContainer = this.objectStore.get('guiContainer');

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
        this.objectStore.put('fps', fps);

        let wave = new PIXI.Text('Wave: ' + this.wave, creditsStyle);
        wave.position.set(this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2 - this.wave.width/2, 5);
        guiContainer.addChild(wave);
        this.objectStore.put('wave', wave);

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
        this.objectStore.put('shieldBar', shieldBar);

        let shield = new PIXI.Text('0 / 0', healthStyle);
        shield.position.set(this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2-40, this.pixiApp.screen.height/this.pixiApp.stage.scale.y -63);
        guiContainer.addChild(shield);
        this.objectStore.put('shield', shield);

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
        this.objectStore.put('armorBar', armorBar);

        let armor = new PIXI.Text('0 / 0', healthStyle);
        armor.position.set(this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2-40, this.pixiApp.screen.height/this.pixiApp.stage.scale.y -43);
        guiContainer.addChild(armor);
        this.objectStore.put('armor', armor);

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
        this.objectStore.put('energyBar', energyBar);

        let energy = new PIXI.Text('0 / 0', healthStyle);
        energy.position.set(this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2-40, this.pixiApp.screen.height/this.pixiApp.stage.scale.y -23);
        guiContainer.addChild(energy);
        this.objectStore.put('energy', energy);
    }

    initPlayer() {
        let playerContainer = this.objectStore.get('playerContainer');
        let player = new Player(
            PIXI.Loader.shared.resources["assets/sprites/A5.png"].texture,
            this.spawner,
            this.pixiApp.screen.width/this.pixiApp.stage.scale.x,
            this.pixiApp.screen.height/this.pixiApp.stage.scale.y);
        player.scale.set(0.5);
        player.x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2 - player.width/2;
        player.y = this.pixiApp.screen.height/this.pixiApp.stage.scale.y - player.height;
        playerContainer.addChild(player);
        this.objectStore.put('player', player);
    }

    update() {
        this.now = Date.now();
        this.updateBackground();
        this.updatePlayer();
        this.updateEnemies();
        this.updateProjectiles();
        this.checkForCollisions();
        this.updateGui();
        this.objectStore.get('abilityBar').update();
        this.elapsed = this.now;
    }

    updateBackground() {
        this.objectStore.get('backgroundFarLayer').tilePosition.y += 0.05;
        this.objectStore.get('backgroundMidLayer').tilePosition.y += 0.2;
        this.objectStore.get('backgroundMidNearLayer').tilePosition.y += 0.25;
        this.objectStore.get('backgroundNearLayer').tilePosition.y += 0.3;
        this.objectStore.get('backgroundVeryNearLayer').tilePosition.y += 0.4;
    }

    updatePlayer() {
        let player = this.objectStore.get('player');

        player.update(this.frame);
    }

    updateEnemies() {
        this.framesTillWave--;
        let enemyContainer = this.objectStore.get('enemyContainer');

        if (this.framesTillWave <= 0 || this.remainingEnemies === 0) {
            this.wave++;
            arcInc.updateStatsAndFormulas();
            this.framesTillWave = 600;
            this.remainingEnemies = this.spawner.spawnEnemyWave(this.wave);
        }
            for (let enemyIndex = enemyContainer.children.length - 1; enemyIndex >= 0; enemyIndex--) {
                let enemy = enemyContainer.children[enemyIndex];
                if (enemy.visible) {
                    enemy.update();
                    enemy.engage();
                }
            }
    }

    updateProjectiles() {
        let playerProjectileContainer = this.objectStore.get('playerProjectileContainer');

        for (let playerProjectileIndex = playerProjectileContainer.children.length - 1; playerProjectileIndex >= 0; playerProjectileIndex--) {
            let playerProjectile = playerProjectileContainer.children[playerProjectileIndex];

            if (playerProjectile.visible) {
                if (playerProjectile.y < 0) {
                    playerProjectile.visible = false;
                } else {
                    playerProjectile.x += playerProjectile.vx;
                    playerProjectile.y += playerProjectile.vy;
                }
            }
        }

        let enemyProjectileContainer = this.objectStore.get('enemyProjectileContainer');

        for (let enemyProjectileIndex = enemyProjectileContainer.children.length - 1; enemyProjectileIndex >= 0; enemyProjectileIndex--) {
            let enemyProjectile = enemyProjectileContainer.children[enemyProjectileIndex];
            if (enemyProjectile.visible) {
                if (enemyProjectile.y > this.pixiApp.screen.height/this.pixiApp.stage.scale.y) {
                    enemyProjectile.visible = false;
                } else {
                    enemyProjectile.x += enemyProjectile.vx;
                    enemyProjectile.y += enemyProjectile.vy;
                }
            }
        }
    }

    intersect(r1, r2) {
        let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

        //A variable to determine whether there's a collision
        hit = false;

        //Calculate the distance vector
        vx = (r1.x + Math.abs(r1.width/2) - (r1.width * r1.anchor.x)) - (r2.x + Math.abs(r2.width/2) - (r2.width * r2.anchor.x));
        vy = (r1.y + Math.abs(r1.height/2) - (r1.height * r1.anchor.y)) - (r2.y + Math.abs(r2.height/2) - (r2.height * r2.anchor.y));

        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = Math.abs(r1.width/2) + Math.abs(r2.width/2);
        combinedHalfHeights = Math.abs(r1.height/2) + Math.abs(r2.height/2);

        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {

            //A collision might be occuring. Check for a collision on the y axis
            hit = Math.abs(vy) < combinedHalfHeights;
        } else {

            //There's no collision on the x axis
            hit = false;
        }

        //`hit` will be either `true` or `false`
        return hit;
    }

    checkForCollisions() {
        let enemyContainer = this.objectStore.get('enemyContainer');
        let playerProjectileContainer = this.objectStore.get('playerProjectileContainer');
        let player = this.objectStore.get('player');

        for (let enemyIndex = enemyContainer.children.length - 1; enemyIndex >= 0; enemyIndex--) {
            for (let projectileIndex = playerProjectileContainer.children.length - 1; projectileIndex >= 0; projectileIndex--) {
                let projectile = playerProjectileContainer.children[projectileIndex];
                let enemy = enemyContainer.children[enemyIndex];

                if (projectile.visible && enemy.visible && !projectile.ignore.includes(enemy.id)) {
                    if (this.intersect(enemy, projectile)) {
                        player.hits(enemy, projectile);
                    }
                }
            }
        }

        let enemyProjectileContainer = this.objectStore.get('enemyProjectileContainer');

        for (let enemyProjectileIndex = 0; enemyProjectileIndex < enemyProjectileContainer.children.length; enemyProjectileIndex++) {
            let enemyProjectile = enemyProjectileContainer.children[enemyProjectileIndex];
            if (enemyProjectile.visible) {
                if (this.intersect(player, enemyProjectile)) {
                    player.isHit(enemyProjectile);

                }
            }
        }
    }

    updateGui() {
        this.objectStore.get('fps').text = Math.round(this.pixiApp.ticker.FPS) + ' FPS';
        this.objectStore.get('wave').text = 'Wave: ' + this.wave + ' [' + this.remainingEnemies + ' remaining]';
        this.objectStore.get('wave').x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2 - this.objectStore.get('wave').width/2;

        let player = this.objectStore.get('player');
        this.objectStore.get('shieldBar').width = 200 * player.currentShield / player.stats.effectiveMaxShield;
        this.objectStore.get('shield').text = '' + arcInc.format(Math.floor(player.currentShield), 3)  + ' / ' + arcInc.format(Math.floor(player.stats.effectiveMaxShield), 3);
        this.objectStore.get('shield').x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2 - this.objectStore.get('shield').width/2;

        this.objectStore.get('armorBar').width = 200 * player.currentArmor / player.stats.effectiveMaxArmor;
        this.objectStore.get('armor').text = '' + arcInc.format(Math.floor(player.currentArmor), 3)  + ' / ' + arcInc.format(Math.floor(player.stats.effectiveMaxArmor), 3);
        this.objectStore.get('armor').x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2 - this.objectStore.get('armor').width/2;

        this.objectStore.get('energyBar').width = 200 * player.currentEnergy/ player.stats.effectiveMaxEnergy;
        this.objectStore.get('energy').text = '' + arcInc.format(Math.floor(player.currentEnergy), 3)  + ' / ' + arcInc.format(Math.floor(player.stats.effectiveMaxEnergy), 3);
        this.objectStore.get('energy').x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2 - this.objectStore.get('energy').width/2;
    }

    initAbilities() {
        let guiContainer = this.objectStore.get('guiContainer');
        let abilityBar = new AbilityBar(this.objectStore);
        abilityBar.init();
        abilityBar.y = this.pixiApp.screen.height/this.pixiApp.stage.scale.y - abilityBar.height - 10;
        abilityBar.x = 10;
        guiContainer.addChild(abilityBar);
        this.objectStore.put('abilityBar', abilityBar);
    }
}
class MainScene extends Scene{
    constructor(arcInc) {
        super('main', arcInc.pixiApp);
        this.pixiApp = arcInc.pixiApp;
        this.init();
        this.frame = 0;
    }

    init() {
        this.wave = arcInc.savegame.highestWave;
        if (this.wave < 0) {
            this.wave = 0;
        }
        this.framesTillWave = 0;

        this.initContainer();
        new ParallaxManager();
        this.particleEmitter = new ParticleEmitter();
        this.initGui();
        this.initAbilities();
        this.initPlayer();
    }

    reset() {
        let enemyContainer = arcInc.objectStore.get('enemyContainer');
        for (let i = 0; i < enemyContainer.children.length; i++) {
            enemyContainer.children[i].markedForDestruction = true;
        }

        let enemyProjectileContainer = arcInc.objectStore.get('enemyProjectileContainer');
        for (let i = 0; i < enemyProjectileContainer.children.length; i++) {
            enemyProjectileContainer.children[i].markedForDestruction = true;
        }

        let playerProjectileContainer = arcInc.objectStore.get('playerProjectileContainer');
        for (let i = 0; i < playerProjectileContainer.children.length; i++) {
            playerProjectileContainer.children[i].markedForDestruction = true;
        }

        let player = arcInc.objectStore.get('player');
        player.currentShield = player.stats.effectiveMaxShield;
        player.currentArmor = player.stats.effectiveMaxArmor;
        player.currentEnergy = player.stats.effectiveMaxEnergy;

        this.wave = arcInc.savegame.highestWave;
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

        let particleContainer = new PIXI.ParticleContainer();
        this.addChild(particleContainer);
        arcInc.objectStore.put('particleContainer', particleContainer);

        let guiContainer = new PIXI.Container();
        this.addChild(guiContainer);
        arcInc.objectStore.put('guiContainer', guiContainer);
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

        arcInc.eventEmitter.emit(Events.CREATION_PHASE_STARTED, frameDelta);

        arcInc.eventEmitter.emit(Events.REGENERATION_PHASE_STARTED, frameDelta);

        arcInc.eventEmitter.emit(Events.MOVEMENT_PHASE_STARTED, frameDelta);
        this.updatePlayer(frameDelta);
        this.updateEnemies(frameDelta);

        arcInc.eventEmitter.emit(Events.ENGAGEMENT_PHASE_STARTED, frameDelta);

        arcInc.eventEmitter.emit(Events.COLLISION_DETECTION_PHASE_STARTED, frameDelta);
        this.checkForCollisions();

        arcInc.eventEmitter.emit(Events.CLEANUP_PHASE_STARTED, frameDelta);

        this.particleEmitter.update();
        this.updateGui();
        arcInc.objectStore.get('abilityBar').update(frameDelta);
    }

    updatePlayer(frameDelta) {
        let player = arcInc.objectStore.get('player');

        player.update(frameDelta);
    }

    updateEnemies(frameDelta) {
        this.framesTillWave -= frameDelta;

        if (this.framesTillWave <= 0 || this.remainingEnemies === 0) {
            let compress = this.wave < arcInc.savegame.highestWaveEver/2;
            if (compress) {
                this.wave += 10;
            } else {
                this.wave++;
            }

            StatsAndFormulas.update();
            this.framesTillWave = 600;
            this.remainingEnemies = arcInc.spawner.spawnEnemyWave(this.wave, compress);
        }
    }

    checkForCollisions() {
        let player = arcInc.objectStore.get('player');

        let enemyProjectileContainer = arcInc.objectStore.get('enemyProjectileContainer');

        for (let enemyProjectileIndex = 0; enemyProjectileIndex < enemyProjectileContainer.children.length; enemyProjectileIndex++) {
            let enemyProjectile = enemyProjectileContainer.children[enemyProjectileIndex];
            if (!enemyProjectile.markedForDestruction) {
                if (Utils.intersect(player, enemyProjectile)) {
                    player.hitBy(enemyProjectile);
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
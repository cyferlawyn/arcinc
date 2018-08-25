class MainScene extends Scene{
    constructor(arcInc) {
        super('main', arcInc.pixiApp);
        this.arcInc = arcInc;
        this.pixiApp = arcInc.pixiApp;
        this.init();
    }

    init() {
        this.objectStore = new ObjectStore();
        this.spawner = new Spawner(this.pixiApp, this.objectStore);
        this.now = Date.now();
        this.elapsed = Date.now();
        this.wave = arcInc.savegame.highestWave - 11;
        if (this.wave < 0) {
            this.wave = 0;
        }
        this.framesTillWave = 0;

        this.initContainer();
        this.initBackground();
        this.initGui();
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
        player.currentShield = player.maxShield;
        player.currentArmor = player.maxArmor;
        player.currentStructure = player.maxStructure;

        this.wave = Math.floor(arcInc.savegame.highestWave - 10);
        if (this.wave < 0) {
            this.wave = 0;
        }
    }

    initContainer() {
        let backgroundContainer = new PIXI.Container();
        this.addChild(backgroundContainer);
        this.objectStore.put('backgroundContainer', backgroundContainer);

        let enemyContainer = new PIXI.Container();
        this.addChild(enemyContainer);
        this.objectStore.put('enemyContainer', enemyContainer);

        let playerContainer = new PIXI.Container();
        this.addChild(playerContainer);
        this.objectStore.put('playerContainer', playerContainer);

        let enemyProjectileContainer = new PIXI.Container();
        this.addChild(enemyProjectileContainer);
        this.objectStore.put('enemyProjectileContainer', enemyProjectileContainer);

        let playerProjectileContainer = new PIXI.Container();
        this.addChild(playerProjectileContainer);
        this.objectStore.put('playerProjectileContainer', playerProjectileContainer);

        let guiContainer = new PIXI.Container();
        this.addChild(guiContainer);
        this.objectStore.put('guiContainer', guiContainer);
    }

    initBackground() {
        let backgroundContainer = this.objectStore.get('backgroundContainer');

        let backgroundFarLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/NebulaBlue.png'].texture, 1024, 1024);
        backgroundFarLayer.position.x = 0;
        backgroundFarLayer.position.y = 0;
        backgroundContainer.addChild(backgroundFarLayer);
        this.objectStore.put('backgroundFarLayer', backgroundFarLayer);

        let backgroundMidLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/StarsSmall_1.png'].texture, 1024, 1024);
        backgroundMidLayer.position.x = 0;
        backgroundMidLayer.position.y = 0;
        backgroundContainer.addChild(backgroundMidLayer);
        this.objectStore.put('backgroundMidLayer', backgroundMidLayer);

        let backgroundNearLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/StarsSmall_2.png'].texture, 1024, 1024);
        backgroundNearLayer.position.x = 0;
        backgroundNearLayer.position.y = 0;
        backgroundContainer.addChild(backgroundNearLayer);
        this.objectStore.put('backgroundNearLayer', backgroundNearLayer);
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

        let structureDamage = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/DamageBar.png"].texture);
        structureDamage.x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2-100;
        structureDamage.y = this.pixiApp.screen.height/this.pixiApp.stage.scale.y -20;
        structureDamage.width = 200;
        structureDamage.height = 15;
        guiContainer.addChild(structureDamage);

        let structureBar = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/HealthBar.png"].texture);
        structureBar.x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2-100;
        structureBar.y = this.pixiApp.screen.height/this.pixiApp.stage.scale.y -20;
        structureBar.width = 200;
        structureBar.height = 15;
        guiContainer.addChild(structureBar);
        this.objectStore.put('structureBar', structureBar);

        let structure = new PIXI.Text('0 / 0', healthStyle);
        structure.position.set(this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2-40, this.pixiApp.screen.height/this.pixiApp.stage.scale.y -23);
        guiContainer.addChild(structure);
        this.objectStore.put('structure', structure);
    }

    initPlayer() {
        let playerContainer = this.objectStore.get('playerContainer');
        let player = new Player(
            PIXI.Loader.shared.resources["assets/sprites/A5.png"].texture,
            this.arcInc,
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
        this.engageEnemies();
        this.updateProjectiles();
        this.checkForCollisions();
        this.updateGui();
        this.elapsed = this.now;
    }

    updateBackground() {
        this.objectStore.get('backgroundFarLayer').tilePosition.y += 0.05;
        this.objectStore.get('backgroundMidLayer').tilePosition.y += 0.2;
        this.objectStore.get('backgroundNearLayer').tilePosition.y += 0.4;
    }

    updatePlayer() {
        let player = this.objectStore.get('player');

        player.update(this.frame);
    }

    engageEnemies() {
        if (this.frame%120 === 0) {
            let enemyContainer = this.objectStore.get('enemyContainer');
            for (let enemyIndex = enemyContainer.children.length - 1; enemyIndex >= 0; enemyIndex--) {
                let enemy = enemyContainer.children[enemyIndex];
                if (enemy.visible) {
                    this.spawner.spawnEnemyProjectile(enemy.x + enemy.width / 2,
                        enemy.y + enemy.height/2,
                        enemy.vx * 2,
                        enemy.vy * 2,
                        enemy.tint,
                        enemy.damage);
                }
            }
        }
    }

    updateEnemies() {
        this.framesTillWave--;
        let enemyContainer = this.objectStore.get('enemyContainer');

        if (this.remainingEnemies === 0 && arcInc.savegame.highestWave < this.wave) {
            arcInc.savegame.highestWave = this.wave;
            arcInc.saveSavegame();
        }
        if (this.framesTillWave <= 0 || this.remainingEnemies === 0) {
            this.wave++;
            this.framesTillWave = 600;
            this.remainingEnemies = this.spawner.spawnEnemyWave(this.wave);
        }
            for (let enemyIndex = enemyContainer.children.length - 1; enemyIndex >= 0; enemyIndex--) {
                let enemy = enemyContainer.children[enemyIndex];
                if (enemy.visible) {
                    if (enemy.y > this.pixiApp.screen.height/this.pixiApp.stage.scale.y) {
                        enemy.visible = false;
                    } else {
                        enemy.x += enemy.vx;
                        enemy.y += enemy.vy;

                        if (enemy.x < 0) {
                            enemy.x = 0;
                            enemy.vx *= -1;
                        }

                        if (enemy.x + enemy.width > this.pixiApp.screen.width/this.pixiApp.stage.scale.x) {
                            enemy.x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x - enemy.width;
                            enemy.vx *= -1;
                        }
                    }
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

    intersect(a, b) {
        return !(b.x + b.width > a.x + a.width||
            b.x + b.width < a.x ||
            b.y > a.y + a.height ||
            b.y + b.height < a.y);
    }

    checkForCollisions() {
        let enemyContainer = this.objectStore.get('enemyContainer');
        let playerProjectileContainer = this.objectStore.get('playerProjectileContainer');
        let player = this.objectStore.get('player');

        for (let enemyIndex = enemyContainer.children.length - 1; enemyIndex >= 0; enemyIndex--) {
            for (let projectileIndex = playerProjectileContainer.children.length - 1; projectileIndex >= 0; projectileIndex--) {
                let projectile = playerProjectileContainer.children[projectileIndex];
                let enemy = enemyContainer.children[enemyIndex];

                if (projectile.visible && enemy.visible) {
                    if (this.intersect(enemy, projectile)) {
                        enemy.currentHealth -= projectile.damage;
                        let piercingHit = (Math.random() * 100 > player.projectilePierceChance);

                        if (!piercingHit) {
                            projectile.visible = false;
                        }

                        if (enemy.currentHealth <= 0) {
                            this.arcInc.savegame.credits += enemyContainer.children[enemyIndex].credits;
                            arcInc.updateCredits();
                            if (enemy.wave === this.wave) {
                                this.remainingEnemies--;
                            }
                            enemy.visible = false;
                        } else {
                            enemy.updateHealthBar();
                        }
                    }
                }
            }
        }

        let enemyProjectileContainer = this.objectStore.get('enemyProjectileContainer');

        for (let enemyProjectileIndex = 0; enemyProjectileIndex < enemyProjectileContainer.children.length; enemyProjectileIndex++) {
            let enemyProjectile = enemyProjectileContainer.children[enemyProjectileIndex];
            if (enemyProjectile.visible) {
                if (this.intersect(player, enemyProjectile)) {
                    player.hit(enemyProjectile);
                    enemyProjectile.visible = false;
                }
            }
        }
    }

    updateGui() {
        this.objectStore.get('fps').text = Math.round(this.pixiApp.ticker.FPS) + ' FPS';
        this.objectStore.get('wave').text = 'Wave: ' + this.wave + ' [' + this.remainingEnemies + ' remaining]';
        this.objectStore.get('wave').x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2 - this.objectStore.get('wave').width/2;

        let player = this.objectStore.get('player');
        this.objectStore.get('shieldBar').width = 200 * player.currentShield / player.maxShield;
        this.objectStore.get('shield').text = '' + Math.floor(player.currentShield)  + ' / ' + Math.floor(player.maxShield);
        this.objectStore.get('shield').x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2 - this.objectStore.get('shield').width/2;

        this.objectStore.get('armorBar').width = 200 * player.currentArmor / player.maxArmor;
        this.objectStore.get('armor').text = '' + Math.floor(player.currentArmor)  + ' / ' + Math.floor(player.maxArmor);
        this.objectStore.get('armor').x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2 - this.objectStore.get('armor').width/2;

        this.objectStore.get('structureBar').width = 200 * player.currentStructure / player.maxStructure;
        this.objectStore.get('structure').text = '' + Math.floor(player.currentStructure)  + ' / ' + Math.floor(player.maxStructure);
        this.objectStore.get('structure').x = this.pixiApp.screen.width/this.pixiApp.stage.scale.x/2 - this.objectStore.get('structure').width/2;
    }
}
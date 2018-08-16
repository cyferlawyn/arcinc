class MainScene extends Scene{
    constructor(pixiApp) {
        super('main', pixiApp);
        this.init();
    }

    init() {
        this.objectStore = new ObjectStore();
        this.spawner = new Spawner(this.pixiApp, this.objectStore);
        this.now = Date.now();
        this.elapsed = Date.now();
        this.score = 0;

        this.initContainer();
        this.initBackground();
        this.initGui();
        this.initPlayer();
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

        let particleContainer = new PIXI.ParticleContainer();
        this.addChild(particleContainer);
        this.objectStore.put('particleContainer', particleContainer);

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

        let backgroundFarLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/28884-8-galaxy-photos.png'].texture, 640, 432);
        backgroundFarLayer.position.x = 0;
        backgroundFarLayer.position.y = 0;
        backgroundFarLayer.scale.set(1.5);
        backgroundContainer.addChild(backgroundFarLayer);
        this.objectStore.put('backgroundFarLayer', backgroundFarLayer);

        let backgroundMidLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/Parallax60.png'].texture, 500, 500);
        backgroundMidLayer.position.x = 0;
        backgroundMidLayer.position.y = 0;
        backgroundMidLayer.scale.set(1.5);
        backgroundContainer.addChild(backgroundMidLayer);
        this.objectStore.put('backgroundMidLayer', backgroundMidLayer);

        let backgroundNearLayer = new PIXI.TilingSprite(PIXI.Loader.shared.resources['assets/textures/Parallax60.png'].texture, 500, 500);
        backgroundNearLayer.position.x = 0;
        backgroundNearLayer.position.y = 0;
        backgroundNearLayer.scale.set(2);
        backgroundContainer.addChild(backgroundNearLayer);
        this.objectStore.put('backgroundNearLayer', backgroundNearLayer);
    }

    initGui() {
        let guiContainer = this.objectStore.get('guiContainer');

        let scoreStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 36,
            fill: "white",
            stroke: '#ff3300',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: "#000000",
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
        });

        let healthStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 12,
            fill: "white"
        });

        let score = new PIXI.Text(this.score, scoreStyle);
        score.position.set(5, 5);
        guiContainer.addChild(score);
        this.objectStore.put('score', score);

        let fps = new PIXI.Text(this.pixiApp.ticker.FPS, scoreStyle);
        fps.position.set(650, 5);
        guiContainer.addChild(fps);
        this.objectStore.put('fps', fps);

        let shieldDamage = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/DamageBar.png"].texture);
        shieldDamage.x = this.pixiApp.renderer.view.width/2-50;
        shieldDamage.y = this.pixiApp.renderer.view.height -60;
        shieldDamage.width = 100;
        shieldDamage.height = 10;
        guiContainer.addChild(shieldDamage);

        let shieldBar = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/HealthBar.png"].texture);
        shieldBar.x = this.pixiApp.renderer.view.width/2-50;
        shieldBar.y = this.pixiApp.renderer.view.height -60;
        shieldBar.width = 100;
        shieldBar.height = 10;
        guiContainer.addChild(shieldBar);
        this.objectStore.put('shieldBar', shieldBar);

        let shield = new PIXI.Text('0 / 0', healthStyle);
        shield.position.set(this.pixiApp.renderer.view.width/2-40, this.pixiApp.renderer.view.height -63);
        guiContainer.addChild(shield);
        this.objectStore.put('shield', shield);

        let armorDamage = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/DamageBar.png"].texture);
        armorDamage.x = this.pixiApp.renderer.view.width/2-50;
        armorDamage.y = this.pixiApp.renderer.view.height -40;
        armorDamage.width = 100;
        armorDamage.height = 10;
        guiContainer.addChild(armorDamage);

        let armorBar = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/HealthBar.png"].texture);
        armorBar.x = this.pixiApp.renderer.view.width/2-50;
        armorBar.y = this.pixiApp.renderer.view.height -40;
        armorBar.width = 100;
        armorBar.height = 10;
        guiContainer.addChild(armorBar);
        this.objectStore.put('armorBar', armorBar);

        let armor = new PIXI.Text('0 / 0', healthStyle);
        armor.position.set(this.pixiApp.renderer.view.width/2-40, this.pixiApp.renderer.view.height -43);
        guiContainer.addChild(armor);
        this.objectStore.put('armor', armor);

        let structureDamage = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/DamageBar.png"].texture);
        structureDamage.x = this.pixiApp.renderer.view.width/2-50;
        structureDamage.y = this.pixiApp.renderer.view.height -20;
        structureDamage.width = 100;
        structureDamage.height = 10;
        guiContainer.addChild(structureDamage);

        let structureBar = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/HealthBar.png"].texture);
        structureBar.x = this.pixiApp.renderer.view.width/2-50;
        structureBar.y = this.pixiApp.renderer.view.height -20;
        structureBar.width = 100;
        structureBar.height = 10;
        guiContainer.addChild(structureBar);
        this.objectStore.put('structureBar', structureBar);

        let structure = new PIXI.Text('0 / 0', healthStyle);
        structure.position.set(this.pixiApp.renderer.view.width/2-40, this.pixiApp.renderer.view.height -23);
        guiContainer.addChild(structure);
        this.objectStore.put('structure', structure);
    }

    initPlayer() {
        let playerContainer = this.objectStore.get('playerContainer');
        let player = new Player(PIXI.Loader.shared.resources["assets/sprites/A5.png"].texture, this.spawner, this.pixiApp.renderer.view.width, this.pixiApp.renderer.view.height);
        player.scale.set(0.5);
        player.x = this.pixiApp.renderer.view.width/2 - player.width/2;
        player.y = this.pixiApp.renderer.view.height - player.height;
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
        this.objectStore.get('backgroundFarLayer').tilePosition.y += 0.2;
        this.objectStore.get('backgroundMidLayer').tilePosition.y += 0.1;
        this.objectStore.get('backgroundNearLayer').tilePosition.y += 0.3;
    }

    updatePlayer() {
        let player = this.objectStore.get('player');
        let mousePosition = this.pixiApp.renderer.plugins.interaction.mouse.global;

        player.update(this.frame, mousePosition);
    }

    engageEnemies() {
        if (this.frame%180 === 0) {
            let enemyContainer = this.objectStore.get('enemyContainer');
            for (let enemyIndex = enemyContainer.children.length - 1; enemyIndex >= 0; enemyIndex--) {
                let enemy = enemyContainer.children[enemyIndex];
                if (enemy.visible) {
                    this.spawner.spawnEnemyProjectile(enemy.x + enemy.width / 2,
                        enemy.y - enemy.height,
                        enemy.vx * 2,
                        enemy.vy * 2,
                        enemy.tint);
                }
            }
        }
    }

    updateEnemies() {
        let enemyContainer = this.objectStore.get('enemyContainer');

        if (this.frame%2 === 0) {
            this.spawner.spawnRandomEnemy();
        }

        for (let enemyIndex = enemyContainer.children.length - 1; enemyIndex >= 0; enemyIndex--) {
            let enemy = enemyContainer.children[enemyIndex];
            if (enemy.visible) {
                if (enemy.y > this.pixiApp.renderer.view.height) {
                    enemy.visible = false;
                } else {
                    enemy.x += enemy.vx;
                    enemy.y += enemy.vy;
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

                    playerProjectile.emitter.updateOwnerPos(playerProjectile.x, playerProjectile.y);
                }
            }

            playerProjectile.emitter.update((this.now - this.elapsed) * 0.001);
            playerProjectile.emitter.emit = playerProjectile.visible;
        }

        let enemyProjectileContainer = this.objectStore.get('enemyProjectileContainer');

        for (let enemyProjectileIndex = enemyProjectileContainer.children.length - 1; enemyProjectileIndex >= 0; enemyProjectileIndex--) {
            let enemyProjectile = enemyProjectileContainer.children[enemyProjectileIndex];
            if (enemyProjectile.visible) {
                if (enemyProjectile.y > this.pixiApp.renderer.view.height) {
                    enemyProjectile.visible = false;
                } else {
                    enemyProjectile.x += enemyProjectile.vx;
                    enemyProjectile.y += enemyProjectile.vy;

                    enemyProjectile.emitter.updateOwnerPos(enemyProjectile.x, enemyProjectile.y);
                }
            }

            enemyProjectile.emitter.update((this.now - this.elapsed) * 0.001);
            enemyProjectile.emitter.emit = enemyProjectile.visible;
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

        for (let enemyIndex = enemyContainer.children.length - 1; enemyIndex >= 0; enemyIndex--) {
            for (let projectileIndex = playerProjectileContainer.children.length - 1; projectileIndex >= 0; projectileIndex--) {
                let projectile = playerProjectileContainer.children[projectileIndex];
                let enemy = enemyContainer.children[enemyIndex];

                if (projectile.visible && enemy.visible) {
                    if (this.intersect(enemy, projectile)) {
                        enemy.currentHealth -= projectile.damage;
                        projectile.visible = false;
                        if (enemy.currentHealth <= 0) {
                            this.score += enemyContainer.children[enemyIndex].maxHealth;
                            enemy.visible = false;
                        } else {
                            enemy.updateHealthBar();
                        }
                    }
                }
            }
        }

        let player = this.objectStore.get('player');
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
        this.objectStore.get('score').text = this.score;
        this.objectStore.get('fps').text = Math.round(this.pixiApp.ticker.FPS) + ' FPS';

        let player = this.objectStore.get('player');
        this.objectStore.get('shieldBar').width = 100 * player.currentShield / player.maxShield;
        this.objectStore.get('shield').text = '' + Math.floor(player.currentShield)  + ' / ' + player.maxShield;

        this.objectStore.get('armorBar').width = 100 * player.currentArmor / player.maxArmor;
        this.objectStore.get('armor').text = '' + Math.floor(player.currentArmor)  + ' / ' + player.maxArmor;

        this.objectStore.get('structureBar').width = 100 * player.currentStructure / player.maxStructure;
        this.objectStore.get('structure').text = '' + Math.floor(player.currentStructure)  + ' / ' + player.maxStructure;
    }
}
class ArcInc {
    init() {
        this.initPixiApp();
        this.initEventHandler();
        this.initSavegame();
        this.initKeyboard();
        this.initScenes();
        this.initStation();

        window.setInterval(arcInc.saveSavegame, 5000);
    }

    initPixiApp() {
        this.pixiApp = new PIXI.Application(
            {
                width: 1024,
                height: 768
            }
        );

        this.resize = function(){
            let parent = arcInc.pixiApp.view.parentNode;
            let ratio = (parent.clientWidth - 30) / 1024;
            arcInc.pixiApp.stage.scale.x = ratio;
            arcInc.pixiApp.stage.scale.y = ratio;
            arcInc.pixiApp.renderer.resize(Math.ceil(1024 * ratio), Math.ceil(768 * ratio));
        };
        window.addEventListener('resize', this.resize);

        document.getElementById('canvas').appendChild(this.pixiApp.view);
        this.resize();

        this.pixiApp.stage.interactive = true;
        this.pixiApp.stage.on('touchmove', function(event) {
            arcInc.pixiApp.renderer.plugins.interaction.mouse.global = {
                'x': event.data.global.x / arcInc.pixiApp.stage.scale.x,
                'y': event.data.global.y / arcInc.pixiApp.stage.scale.y
            };
        });
    }

    initEventHandler() {
        this.selectUpgradeCategory = function(event) {
            let category = event.target.id;
            document.getElementById('defense-upgrades').classList.remove('active');
            document.getElementById('offense-upgrades').classList.remove('active');

            document.getElementById('defense-upgrades-list').classList.add('d-none');
            document.getElementById('offense-upgrades-list').classList.add('d-none');

            document.getElementById(category).classList.add('active');
            document.getElementById(category + '-list').classList.remove('d-none')
        };
        document.getElementById('defense-upgrades').addEventListener('click', this.selectUpgradeCategory);
        document.getElementById('offense-upgrades').addEventListener('click', this.selectUpgradeCategory);
    }

    initScenes() {
        this.sceneManager = new SceneManager(this);
        this.sceneManager.registerScene(new MainScene(this));
        this.sceneManager.registerScene(new UpgradeScene(this));
        this.sceneManager.loadScene('main');
    }

    initKeyboard() {
        window.addEventListener('keypress', function (event) {

            if (event.keyCode === 32) {
                arcInc.sceneManager.paused = !arcInc.sceneManager.paused;
            }

            event.preventDefault();
        });
    }

    initStation() {
        this.station = new Station();
        this.station.init();
    }

    initSavegame() {
        this.savegame = JSON.parse(localStorage.getItem('savegame'));
        if (this.savegame === null) {
            this.savegame = new Savegame();
            this.saveSavegame();
        }

        // Fill update-induced gaps
        if (!this.savegame.upgrades.hasOwnProperty('projectileSpread')) {
            this.savegame.upgrades['projectileSpread'] = 0;
        }

        if (!this.savegame.hasOwnProperty('highestWave')) {
            this.savegame['highestWave'] = 0;
        }

        if (!this.savegame.hasOwnProperty('modules')) {
            this.savegame.modules = {
                'solarPanels': 0,
                'scienceLab': 0,
                'factory': 0
            };
        }
    }

    saveSavegame() {
        localStorage.setItem('savegame', JSON.stringify(arcInc.savegame));
    }
}

class ArcInc {
    init() {
        // bootstrapping
        this.eventEmitter = new EventEmitter();
        this.backend = new Backend();
        this.objectStore = new ObjectStore();

        // game variables
        this.growth = 1.03;

        // ui state
        this.mousedown = false;
        this.alwaysTrailCheckbox = document.getElementById('always-trail');

        // auth behavior
        this.authToken = localStorage.getItem(authTokenName);
        CloudManager.initLogin(this.authToken === null);
    }

    authenticated() {
        let loginScreen = document.getElementById('login-screen');
        loginScreen.classList.add('d-none');

        this.initPixiApp();
        this.initSavegame();
        this.initKeyboard();
        this.initScenes();
        this.initStation();
        this.initPage();
    }

    initPixiApp() {
        this.pixiApp = new PIXI.Application(
            {
                width: 1024,
                height: 738
            }
        );

        this.resize = function(){
            let parent = arcInc.pixiApp.view.parentNode;
            let ratio = (parent.clientWidth - 30) / 1024;
            arcInc.pixiApp.stage.scale.x = ratio;
            arcInc.pixiApp.stage.scale.y = ratio;
            arcInc.pixiApp.renderer.resize(Math.ceil(1024 * ratio), Math.ceil(738 * ratio));
        };
        window.addEventListener('resize', this.resize);

        document.getElementById('container-left').appendChild(this.pixiApp.view);
        this.resize();

        this.pixiApp.stage.interactive = true;
        this.pixiApp.stage.on('touchmove', function(event) {
            arcInc.objectStore.get('player').destination = {
                'x': event.data.global.x,
                'y': event.data.global.y
            };
        });

        this.pixiApp.stage.on('mousedown', function() {
            arcInc.mousedown = true;
        });

        this.pixiApp.stage.on('mouseup', function() {
            arcInc.mousedown = false;
        });

        this.pixiApp.stage.on('mouseout', function() {
            arcInc.mousedown = false;
        });

        document.addEventListener('dragstart', function(event) {
            event.preventDefault();
        });

        this.pixiApp.stage.on('mousemove', function(event) {
            if (arcInc.alwaysTrailCheckbox.checked || arcInc.mousedown) {
                arcInc.objectStore.get('player').destination = {
                    'x': event.data.global.x,
                    'y': event.data.global.y
                };
            }
        });

        this.pixiApp.stage.on('click', function(event) {
            arcInc.objectStore.get('player').destination = {
                'x': event.data.global.x,
                'y': event.data.global.y
            };
        });

        arcInc.spawner = new Spawner(this.pixiApp, this.objectStore);
    }

    initPage() {
        let parent = document.querySelector('#container-right');
        Chat.prepare(parent);
        Leaderboard.prepare(parent);
        Antimatter.prepare(parent);
        StationModules.prepare(parent);
        ShipUpgrades.prepare(parent);
        StatsAndFormulas.prepare(parent);

        this.eventEmitter.subscribe(Events.CREDITS_UPDATED, '#credits', function(credits) {
            document.querySelector('#credits').innerText = 'Credits: ' + Utils.format(credits, 2) + ' $ (+ ' + Utils.format(arcInc.station.cps) + ' $ / s)';
        });
    }

    initScenes() {
        this.sceneManager = new SceneManager(this);
        this.sceneManager.registerScene(new MainScene(this));
        this.sceneManager.loadScene('main');
    }

    initKeyboard() {
        window.addEventListener('keyup', function (event) {
            if (event.keyCode === 27) {
                arcInc.sceneManager.paused = !arcInc.sceneManager.paused;
            }
        });
    }

    initStation() {
        this.station = new Station();
        this.station.init();
    }

    initSavegame() {
        this.savegame = JSON.parse(localStorage.getItem(savegameName));
        if (this.savegame === null) {
            this.savegame = new Savegame();
        } else {
            if (this.savegame.version === 'v0.15') {
                this.savegame.version = 'v0.16';
            }

            if (this.savegame.version === 'v0.16') {
                this.savegame.version = 'v0.17';

                let pendingAntimatter = 0;

                for (let i = 0; i < this.savegame.highestWave; i++) {
                    if (i % 1000 === 0) {
                        pendingAntimatter += i * 25 * (0.1 * 300);
                    } else if (i % 100 === 0) {
                        pendingAntimatter += i * 5 * (0.1 * 300);
                    }else if (i % 10 === 0) {
                        pendingAntimatter += i * (0.1 * 300);
                    }
                }

                this.savegame.activeAntimatter = "0";
                this.savegame.pendingAntimatter = "" + pendingAntimatter;
            }

            if (this.savegame.version === 'v0.17') {
                if (!this.savegame.hasOwnProperty('highestWaveEver')) {
                    this.savegame.highestWaveEver = this.savegame.highestWave;
                }
            }

            if (this.savegame.version !== 'v0.17') {
                this.savegame = new Savegame();
            }
        }

        arcInc.saveSavegame();
    }

    saveSavegame() {
        let savegameString = JSON.stringify(arcInc.savegame);
        localStorage.setItem(savegameName, savegameString);
    }
}

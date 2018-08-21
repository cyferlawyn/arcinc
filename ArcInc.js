class ArcInc {
    init() {
        this.initPixiApp();
        this.initSavegame();
        this.initKeyboard();
        this.initScenes();
        this.initStation();
        this.initEventHandler();
        this.initPage();

        window.setInterval(arcInc.saveSavegame, 5000);
    }

    initPixiApp() {
        this.pixiApp = new PIXI.Application(
            {
                width: 1024,
                height: 680
            }
        );

        this.resize = function(){
            let parent = arcInc.pixiApp.view.parentNode;
            let ratio = (parent.clientWidth - 30) / 1024;
            arcInc.pixiApp.stage.scale.x = ratio;
            arcInc.pixiApp.stage.scale.y = ratio;
            arcInc.pixiApp.renderer.resize(Math.ceil(1024 * ratio), Math.ceil(680 * ratio));
        };
        window.addEventListener('resize', this.resize);

        document.getElementById('container-center').appendChild(this.pixiApp.view);
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

    initPage() {
        // init station modules
        for (let i = 0; i < Object.keys(this.station.modules).length; i++) {
            let key = Object.keys(this.station.modules)[i];
            let value = this.station.modules[key];
            this.initCard(
                'container-left',
                key,
                value.title,
                'Level ' + this.savegame.modules[key] + ' (' + Math.floor(this.savegame.modules[key] * value.effect) + '$ / s)',
                'Buy 1 (' + Math.ceil(value.cost * Math.pow(1.05, this.savegame.modules[key])) + '$)',
                function (event) {
                    let key = event.currentTarget.name;
                    let effectiveCost = Math.ceil(value.cost * Math.pow(1.05, arcInc.savegame.modules[key]));
                    if (arcInc.savegame.credits >= effectiveCost) {
                        arcInc.savegame.credits -= effectiveCost;
                        arcInc.savegame.modules[key]++;
                        arcInc.saveSavegame();

                        document.getElementById(key + '-card-text').innerText = 'Level ' + arcInc.savegame.modules[key] + ' (' + Math.floor(arcInc.savegame.modules[key] * value.effect) + '$ / s)';
                        document.getElementById(key + '-card-anchor').innerText = 'Buy 1 (' + Math.ceil(value.cost * Math.pow(1.05, arcInc.savegame.modules[key])) + '$)';
                    }
                });
        }

        // init ship defensive upgrades
        for (let i = 0; i < 5; i++) {
            let key = Object.keys(this.sceneManager.scenes['main'].objectStore.get('player').upgrades)[i];
            let value = this.sceneManager.scenes['main'].objectStore.get('player').upgrades[key];
            this.initCard(
                'defense-upgrades-list',
                key,
                value.title,
                'Level ' + this.savegame.upgrades[key] + ' (+' + Math.floor(this.savegame.upgrades[key] * value.effect * 100) + '%)',
                'Buy 1 (' + Math.ceil(value.cost * Math.pow(1.05, this.savegame.upgrades[key])) + '$)',
                function (event) {
                    let key = event.currentTarget.name;
                    let effectiveCost = Math.ceil(value.cost * Math.pow(1.05, arcInc.savegame.upgrades[key]));
                    if (arcInc.savegame.credits >= effectiveCost) {
                        arcInc.savegame.credits -= effectiveCost;
                        arcInc.savegame.upgrades[key]++;
                        arcInc.saveSavegame();
                        arcInc.sceneManager.scenes['main'].objectStore.get('player').applyUpgrades();

                        document.getElementById(key + '-card-text').innerText = 'Level ' + arcInc.savegame.upgrades[key] + ' (+' + Math.floor(arcInc.savegame.upgrades[key] * value.effect * 100) + '%)';
                        document.getElementById(key + '-card-anchor').innerText = 'Buy 1 (' + Math.ceil(value.cost * Math.pow(1.05, arcInc.savegame.upgrades[key])) + '$)';
                    }
                });
        }

        // init ship offense upgrades
        for (let i = 5; i < 10; i++) {
            let key = Object.keys(this.sceneManager.scenes['main'].objectStore.get('player').upgrades)[i];
            let value = this.sceneManager.scenes['main'].objectStore.get('player').upgrades[key];
            this.initCard(
                'offense-upgrades-list',
                key,
                value.title,
                'Level ' + this.savegame.upgrades[key] + ' (+' + Math.floor(this.savegame.upgrades[key] * value.effect * 100) + '%)',
                'Buy 1 (' + Math.ceil(value.cost * Math.pow(1.05, this.savegame.upgrades[key])) + '$)',
                function (event) {
                    let key = event.currentTarget.name;
                    let effectiveCost = Math.ceil(value.cost * Math.pow(1.05, arcInc.savegame.upgrades[key]));
                    if (arcInc.savegame.credits >= effectiveCost) {
                        arcInc.savegame.credits -= effectiveCost;
                        arcInc.savegame.upgrades[key]++;
                        arcInc.saveSavegame();
                        arcInc.sceneManager.scenes['main'].objectStore.get('player').applyUpgrades();

                        document.getElementById(key + '-card-text').innerText = 'Level ' + arcInc.savegame.upgrades[key] + ' (+' + Math.floor(arcInc.savegame.upgrades[key] * value.effect * 100) + '%)';
                        document.getElementById(key + '-card-anchor').innerText = 'Buy 1 (' + Math.ceil(value.cost * Math.pow(1.05, arcInc.savegame.upgrades[key])) + '$)';
                    }
                });
        }
    }

    initCard(parentId, name, headerText, bodyText, anchorText, callback) {
        let parent = document.getElementById(parentId);

        let card = document.createElement('div');
        card.id = name + '-card';
        card.classList.add('card', 'bg-st-patricks-blue');
        card.classList.add();
        parent.appendChild(card);

        let cardHeader = document.createElement('h5');
        cardHeader.id = name + '-card-header';
        cardHeader.classList.add('card-header', 'bg-space-cadet');
        cardHeader.innerText = headerText;
        card.appendChild(cardHeader);

        let cardBody = document.createElement('div');
        cardBody.id = name + '-card-body';
        cardBody.classList.add('card-body');
        card.appendChild(cardBody);

        let cardText = document.createElement('p');
        cardText.id = name + '-card-text';
        cardText.classList.add('card-text');
        cardText.innerText = bodyText;
        cardBody.appendChild(cardText);

        let cardAnchor = document.createElement('a');
        cardAnchor.id = name + '-card-anchor';
        cardAnchor.href = '#';
        cardAnchor.innerText = anchorText;
        cardAnchor.name = name;
        cardAnchor.addEventListener('click', callback);
        cardBody.appendChild(cardAnchor);
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
                'factory': 0,
                'crewQuarters': 0,
                'waterTreatmentPlant': 0
            };
        }

        if (!this.savegame.modules.hasOwnProperty('crewQuarters')) {
            this.savegame.modules['crewQuarters'] = 0;
        }

        if (!this.savegame.modules.hasOwnProperty('waterTreatmentPlant')) {
            this.savegame.modules['waterTreatmentPlant'] = 0;
        }
    }

    saveSavegame() {
        localStorage.setItem('savegame', JSON.stringify(arcInc.savegame));
    }
}

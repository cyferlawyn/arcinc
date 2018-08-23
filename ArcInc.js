class ArcInc {
    init() {
        this.initPixiApp();
        this.initSavegame();
        this.initKeyboard();
        this.initScenes();
        this.initStation();
        this.initPage();

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

        document.getElementById('container-left').appendChild(this.pixiApp.view);
        this.resize();

        this.pixiApp.stage.interactive = true;
        this.pixiApp.stage.on('touchmove', function(event) {
            arcInc.pixiApp.renderer.plugins.interaction.mouse.global = {
                'x': event.data.global.x / arcInc.pixiApp.stage.scale.x,
                'y': event.data.global.y / arcInc.pixiApp.stage.scale.y
            };
        });
    }

    initPage() {
        let parent = document.getElementById('container-right');
        this.initChat(parent);
        this.initLeaderboard(parent);
        this.initStationModules(parent);
        this.initShipUpgrades(parent);
    }

    initChat(parent) {
        let chat = this.initCategoryCard(parent, 'chat', 'Chat');
        let chatHistory = [
            {
                'time': '20:24',
                'name': 'JohnDoe',
                'text': 'First! :D'
            },
            {
                'time': '20:25',
                'name': 'WhinyUser',
                'text': 'Damn :( I was supposed to be THE ONE. My life has no meaning anymore...'
            },
            {
                'time': '20:26',
                'name': 'CountVonCount',
                'text': '1'
            },
            {
                'time': '20:26',
                'name': 'CountVonCount',
                'text': '2'
            },
            {
                'time': '20:26',
                'name': 'CountVonCount',
                'text': '3'
            },
            {
                'time': '20:26',
                'name': 'CountVonCount',
                'text': '4'
            },
            {
                'time': '20:26',
                'name': 'CountVonCount',
                'text': '5'
            },
            {
                'time': '20:26',
                'name': 'CountVonCount',
                'text': '6'
            },
            {
                'time': '20:26',
                'name': 'CountVonCount',
                'text': '7'
            },
            {
                'time': '20:26',
                'name': 'CountVonCount',
                'text': '8'
            }
        ];

        let chatLog = document.createElement('div');
        chatLog.style.maxHeight = '200px';
        chatLog.style.overflow = 'auto';
        chatLog.style.margin = '5px 0px';
        chat.appendChild(chatLog);

        let table = document.createElement('table');
        table.classList.add('table-sm', 'text-light', 'table-dark', 'bg-st-patricks-blue');
        chatLog.appendChild(table);

        let tableBody = document.createElement('tbody');
        table.appendChild(tableBody);

        for (let i = 0; i < chatHistory.length; i++){
            let tableRow = document.createElement('tr');
            tableBody.appendChild(tableRow);

            let time = document.createElement('td');
            time.textContent = chatHistory[i].time;
            tableRow.appendChild(time);

            let name = document.createElement('td');
            name.textContent = chatHistory[i].name;
            tableRow.appendChild(name);

            let text = document.createElement('td');
            text.textContent = chatHistory[i].text;
            tableRow.appendChild(text);
        }

        let input = document.createElement('input');
        input.classList.add('form-control', 'form-control-sm');
        input.type = 'text';
        input.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 && event.target.value.length > 0) {
                event.target.value = '';
            }
        });
        chat.appendChild(input);

        // Scroll into view
        chatLog.scrollTop = chat.scrollHeight;
    }

    initLeaderboard(parent) {
        let leaderboard = this.initCategoryCard(parent, 'leaderboard', 'Leaderboard');
        let leaderboardData = [
            {
                'pos': 1,
                'name': 'JohnDoe',
                'wave': 1337
            },
            {
                'pos': 2,
                'name': 'WhinyUser',
                'wave': 1336
            },
            {
                'pos': 3,
                'name': 'CountVonCount',
                'wave': 1234
            },
            {
                'pos': 4,
                'name': 'RandomScrub1',
                'wave': 110
            },
            {
                'pos': 5,
                'name': 'RandomScrub2',
                'wave': 105
            },
            {
                'pos': 6,
                'name': 'RandomScrub3',
                'wave': 103
            },
            {
                'pos': 7,
                'name': 'RandomScrub4',
                'wave': 102
            },
            {
                'pos': 8,
                'name': 'RandomScrub5',
                'wave': 100
            },
            {
                'pos': 9,
                'name': 'RandomScrub6',
                'wave': 97
            },
            {
                'pos': 10,
                'name': 'RandomScrub7',
                'wave': 95
            },
        ];

        let table = document.createElement('table');
        table.classList.add('table-sm', 'text-light', 'table-dark', 'bg-st-patricks-blue');
        leaderboard.appendChild(table);

        let tableBody = document.createElement('tbody');
        table.appendChild(tableBody);

        for (let i = 0; i < leaderboardData.length; i++){
            let tableRow = document.createElement('tr');
            tableBody.appendChild(tableRow);

            let pos = document.createElement('td');
            pos.textContent = '#' + leaderboardData[i].pos;
            tableRow.appendChild(pos);

            let name = document.createElement('td');
            name.textContent = leaderboardData[i].name;
            tableRow.appendChild(name);

            let wave = document.createElement('td');
            wave.textContent = 'Wave: ' + leaderboardData[i].wave;
            tableRow.appendChild(wave);
        }
    }

    initStationModules(parent) {
        let categoryCardBody = this.initCategoryCard(parent, 'station-modules', 'Station Modules');

        let cardDeck;
        for (let i = 0; i < Object.keys(this.station.modules).length; i++) {
            let key = Object.keys(this.station.modules)[i];
            let value = this.station.modules[key];

            if (i%2 === 0) {
                cardDeck = document.createElement('div');
                cardDeck.classList.add('card-deck');
                categoryCardBody.appendChild(cardDeck);
            }

            this.initCard(
                cardDeck,
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
    }

    initShipUpgrades(parent) {
        let categoryCardBody = this.initCategoryCard(parent, 'ship-upgrades', 'Ship Upgrades');

        let cardDeck;
        for (let i = 0; i < Object.keys(this.sceneManager.scenes['main'].objectStore.get('player').upgrades).length; i++) {
            let key = Object.keys(this.sceneManager.scenes['main'].objectStore.get('player').upgrades)[i];
            let value = this.sceneManager.scenes['main'].objectStore.get('player').upgrades[key];

            if (i%2 === 0) {
                cardDeck = document.createElement('div');
                cardDeck.classList.add('card-deck');
                categoryCardBody.appendChild(cardDeck);
            }

            this.initCard(
                cardDeck,
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

    initCategoryCard(parent, name, headerText) {
        let toggleCategoryFunction = function(event) {
            let card = event.target.parentElement;
            let cardBody = card.children[1];

            if (cardBody.classList.contains('d-none')) {
                cardBody.classList.remove('d-none');
            } else {
                cardBody.classList.add('d-none');
            }
        };

        let card = document.createElement('div');
        card.id = name + '-category-card';
        card.classList.add('card', 'bg-space-cadet');
        parent.appendChild(card);

        let cardHeader = document.createElement('h5');
        cardHeader.id = name + '-category-card-header';
        cardHeader.classList.add('card-header', 'bg-space-cadet');
        cardHeader.innerText = headerText;
        cardHeader.style.cursor = 'pointer';
        cardHeader.style.textDecoration = 'underline';
        cardHeader.addEventListener('click', toggleCategoryFunction);
        card.appendChild(cardHeader);

        let cardBody = document.createElement('div');
        cardBody.id = name + '-category-card-body';
        cardBody.classList.add('card-body');
        card.appendChild(cardBody);

        return cardBody;
    }

    initCard(parent, name, headerText, bodyText, anchorText, callback) {
        let card = document.createElement('div');
        card.id = name + '-card';
        card.classList.add('card', 'bg-st-patricks-blue');
        parent.appendChild(card);

        let cardHeader = document.createElement('h5');
        cardHeader.id = name + '-card-header';
        cardHeader.classList.add('card-header', 'bg-st-patricks-blue');
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

        let cardAnchor = document.createElement('p');
        cardAnchor.id = name + '-card-anchor';
        cardAnchor.innerText = anchorText;
        cardAnchor.name = name;
        cardAnchor.style.cursor = 'pointer';
        cardAnchor.style.textDecoration = 'underline';
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
                'waterTreatmentPlant': 0,
                'teleporter': 0
            };
        }

        if (!this.savegame.modules.hasOwnProperty('crewQuarters')) {
            this.savegame.modules['crewQuarters'] = 0;
        }

        if (!this.savegame.modules.hasOwnProperty('waterTreatmentPlant')) {
            this.savegame.modules['waterTreatmentPlant'] = 0;
        }

        if (!this.savegame.modules.hasOwnProperty('teleporter')) {
            this.savegame.modules['teleporter'] = 0;
        }
    }

    saveSavegame() {
        localStorage.setItem('savegame', JSON.stringify(arcInc.savegame));
    }
}

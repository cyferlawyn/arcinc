class ArcInc {
    init() {
        this.growth = 1.03;
        this.mousedown = false;
        this.alwaysTrailCheckbox = document.getElementById('always-trail');

        this.cps = 0;

        this.backend = new Backend();

        this.authToken = localStorage.getItem('authToken-v0.10');
        this.initLogin(this.authToken === null);
    }

    initLogin(loginRequired) {
        if (loginRequired) {
            let loginScreen = document.getElementById('login-screen');
            loginScreen.classList.remove('d-none');

            let registerButton = document.getElementById('register-button');
            registerButton.addEventListener('click', function() {
                let usernameInput = document.getElementById('username-input');
                let passwordInput = document.getElementById('password-input');

                let sha256 = new jsSHA('SHA-256', 'TEXT');
                sha256.update(passwordInput.value);
                let passwordHash = sha256.getHash("HEX");

                arcInc.backend.createUser(usernameInput.value, passwordHash, arcInc.loginSucceeded, arcInc.registerFailed);
            });

            let loginButton = document.getElementById('login-button');
            loginButton.addEventListener('click', function() {
                let usernameInput = document.getElementById('username-input');
                let passwordInput = document.getElementById('password-input');

                let sha256 = new jsSHA('SHA-256', 'TEXT');
                sha256.update(passwordInput.value);
                let passwordHash = sha256.getHash("HEX");

                arcInc.backend.loginUser(usernameInput.value, passwordHash, arcInc.loginSucceeded, arcInc.loginFailed);
            });
        } else {
            this.loggedIn();
        }
    }

    loginSucceeded(authToken) {
        localStorage.setItem('authToken-v0.10', authToken);
        arcInc.authToken = authToken;
        arcInc.loggedIn();
    }

    registerFailed() {
        let loginFeedback = document.getElementById('login-feedback');
        loginFeedback.innerText = "Username already taken";
    }

    loginFailed() {
        let loginFeedback = document.getElementById('login-feedback');
        loginFeedback.innerText = "Password is either wrong or user does not exist";
    }

    loggedIn() {
        let loginScreen = document.getElementById('login-screen');
        loginScreen.classList.add('d-none');

        this.initPixiApp();
        this.initSavegame();
        this.initKeyboard();
        this.initScenes();
        this.initStation();
        this.initPage();

        window.setInterval(arcInc.cloudSave, 60000);
        window.setInterval(arcInc.updateLeaderboard, 10000);
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
            arcInc.sceneManager.scenes['main'].objectStore.get('player').destination = {
                'x': event.data.global.x,
                'y': event.data.global.y
            };
        });

        this.pixiApp.stage.on('mousedown', function(event) {
            arcInc.mousedown = true;
        });

        this.pixiApp.stage.on('mouseup', function(event) {
            arcInc.mousedown = false;
        });

        this.pixiApp.stage.on('mouseout', function(event) {
            arcInc.mousedown = false;
        });

        document.addEventListener('dragstart', function(event) {
            event.preventDefault();
        });

        this.pixiApp.stage.on('mousemove', function(event) {
            if (arcInc.alwaysTrailCheckbox.checked || arcInc.mousedown) {
                arcInc.sceneManager.scenes['main'].objectStore.get('player').destination = {
                    'x': event.data.global.x,
                    'y': event.data.global.y
                };
            }
        });

        this.pixiApp.stage.on('click', function(event) {
            arcInc.sceneManager.scenes['main'].objectStore.get('player').destination = {
                'x': event.data.global.x,
                'y': event.data.global.y
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

        this.chatLog = document.createElement('div');
        this.chatLog.style.maxHeight = '200px';
        this.chatLog.style.height = '200px';
        this.chatLog.style.overflowX = 'none';
        this.chatLog.style.overflowY = 'auto';
        this.chatLog.style.margin = '5px 0px';
        chat.appendChild(this.chatLog);

        let table = document.createElement('table');
        table.classList.add('table-sm', 'text-light', 'table-dark', 'bg-st-patricks-blue');
        this.chatLog.appendChild(table);

        this.chatEntries = document.createElement('tbody');
        table.appendChild(this.chatEntries);

        arcInc.backend.receiveChat(function(time, name, text) {
            let tableRow = document.createElement('tr');
            arcInc.chatEntries.appendChild(tableRow);

            let timeTableData = document.createElement('td');
            timeTableData.textContent = time;
            tableRow.appendChild(timeTableData);

            let nameTableData = document.createElement('td');
            nameTableData.textContent = name;
            tableRow.appendChild(nameTableData);

            let textTableData = document.createElement('td');
            textTableData.textContent = text;
            tableRow.appendChild(textTableData);

            // Scroll into view
            arcInc.chatLog.scrollTo(0,10000000);
        });

        let input = document.createElement('input');
        input.classList.add('form-control', 'form-control-sm');
        input.type = 'text';
        input.addEventListener('keypress', function(event) {
            let text = event.target.value;
            if (event.keyCode === 13 && text.length > 0) {

                if (text === '/cls') {
                    while( arcInc.chatEntries.hasChildNodes() ){
                        arcInc.chatEntries.removeChild(arcInc.chatEntries.lastChild);
                    }
                } else if (text === '/load') {
                    arcInc.backend.loadUser(arcInc.authToken, function(savegame) {
                        let savegameString = JSON.stringify(savegame);
                        localStorage.setItem('savegame', savegameString);
                        location.reload();
                    }, function() {
                        alert('Cloud load failed');
                    })
                } else {
                    arcInc.backend.sendChat(arcInc.authToken, text);
                }
                event.target.value = '';
            }
        });
        chat.appendChild(input);
    }

    initLeaderboard(parent) {
        let leaderboard = this.initCategoryCard(parent, 'leaderboard', 'Leaderboard');

        let scrollBlock = document.createElement('div');
        scrollBlock.style.maxHeight = '200px';
        scrollBlock.style.height = '200px';
        scrollBlock.style.overflow = 'auto';
        scrollBlock.style.margin = '5px 0px';
        leaderboard.appendChild(scrollBlock);

        let table = document.createElement('table');
        table.classList.add('table-sm', 'text-light', 'table-dark', 'bg-st-patricks-blue');
        scrollBlock.appendChild(table);

        this.leaderboardTableBody = document.createElement('tbody');
        table.appendChild(this.leaderboardTableBody);
    }

    updateLeaderboard() {
        arcInc.backend.getLeaderboard(function(leaderboardData) {
            while( arcInc.leaderboardTableBody.hasChildNodes() ){
                arcInc.leaderboardTableBody.removeChild(arcInc.leaderboardTableBody.lastChild);
            }

            for (let i = 0; i < leaderboardData.length; i++) {
                let tableRow = document.createElement('tr');
                arcInc.leaderboardTableBody.appendChild(tableRow);

                let pos = document.createElement('td');
                pos.textContent = '#' + leaderboardData[i].rank;
                tableRow.appendChild(pos);

                let name = document.createElement('td');
                name.textContent = leaderboardData[i].name;
                tableRow.appendChild(name);

                let wave = document.createElement('td');
                wave.textContent = 'Wave: ' + leaderboardData[i].highestWave;
                tableRow.appendChild(wave);
            }
        })
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
                value.description,
                'Level ' + this.savegame.modules[key] + ' (' + arcInc.format(Math.floor(this.savegame.modules[key] * value.effect)) + ' $ / s)',
                'Buy 1 (' + arcInc.format(Math.ceil(value.cost * Math.pow(arcInc.growth, this.savegame.modules[key]))) + ' $)',
                function (event) {
                    let key = event.currentTarget.name;
                    let effectiveCost = Math.ceil(value.cost * Math.pow(arcInc.growth, arcInc.savegame.modules[key]));
                    if (arcInc.savegame.credits >= effectiveCost) {
                        arcInc.savegame.credits -= effectiveCost;
                        arcInc.updateCredits();
                        arcInc.savegame.modules[key]++;
                        arcInc.saveSavegame();

                        document.getElementById(key + '-card-text').innerText = 'Level ' + arcInc.savegame.modules[key] + ' (' + arcInc.format(Math.floor(arcInc.savegame.modules[key] * value.effect)) + ' $ / s)';
                        document.getElementById(key + '-card-anchor').innerText = 'Buy 1 (' + arcInc.format(Math.ceil(value.cost * Math.pow(arcInc.growth, arcInc.savegame.modules[key]))) + ' $)';
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
                value.description,
                'Level ' + this.savegame.upgrades[key] + ' (+' + arcInc.format(Math.floor(this.savegame.upgrades[key] * value.effect * 100)) + ' %)',
                'Buy 1 (' + arcInc.format(Math.ceil(value.cost * Math.pow(arcInc.growth, this.savegame.upgrades[key]))) + ' $)',
                function (event) {
                    let key = event.currentTarget.name;
                    let effectiveCost = Math.ceil(value.cost * Math.pow(arcInc.growth, arcInc.savegame.upgrades[key]));
                    if (arcInc.savegame.credits >= effectiveCost) {
                        arcInc.savegame.credits -= effectiveCost;
                        arcInc.updateCredits();
                        arcInc.savegame.upgrades[key]++;
                        arcInc.saveSavegame();
                        arcInc.sceneManager.scenes['main'].objectStore.get('player').applyUpgrades();

                        document.getElementById(key + '-card-text').innerText = 'Level ' + arcInc.savegame.upgrades[key] + ' (+' + arcInc.format(Math.floor(arcInc.savegame.upgrades[key] * value.effect * 100)) + ' %)';
                        document.getElementById(key + '-card-anchor').innerText = 'Buy 1 (' + arcInc.format(Math.ceil(value.cost * Math.pow(arcInc.growth, arcInc.savegame.upgrades[key]))) + ' $)';
                    }
                });
        }
    }

    initCategoryCard(parent, name, headerText) {
        let toggleCategoryFunction = function(event) {
            let image = event.target;
            let card = event.target.parentElement.parentElement;
            let cardBody = card.children[1];

            let imageSrc = image.src;
            image.src = image.altSrc;
            image.altSrc = imageSrc;
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

        let cardHeader = document.createElement('div');
        cardHeader.id = name + '-category-card-header';
        cardHeader.classList.add('card-header', 'bg-space-cadet', 'd-flex', 'justify-content-between');
        card.appendChild(cardHeader);

        let cardHeaderParagraph = document.createElement('h5');
        cardHeaderParagraph.innerText = headerText;
        cardHeader.appendChild(cardHeaderParagraph);

        let resizeImg = document.createElement('img');
        resizeImg.src = 'assets/icons/glyphicons-215-resize-small.png';
        resizeImg.altSrc = 'assets/icons/glyphicons-216-resize-full.png';
        resizeImg.width = 16;
        resizeImg.height = 16;
        resizeImg.style.cursor = 'pointer';
        resizeImg.addEventListener('click', toggleCategoryFunction);
        cardHeader.appendChild(resizeImg);

        let cardBody = document.createElement('div');
        cardBody.id = name + '-category-card-body';
        cardBody.classList.add('card-body');
        card.appendChild(cardBody);

        return cardBody;
    }

    initCard(parent, name, headerText, description, bodyText, anchorText, callback) {
        let card = document.createElement('div');
        card.id = name + '-card';
        card.classList.add('card', 'bg-st-patricks-blue');
        parent.appendChild(card);

        let cardHeader = document.createElement('div');
        cardHeader.id = name + '-card-header';
        cardHeader.classList.add('card-header', 'bg-st-patricks-blue', 'd-flex', 'justify-content-between');
        card.appendChild(cardHeader);

        let cardHeaderParagraph = document.createElement('h5');
        cardHeaderParagraph.innerText = headerText;
        cardHeader.appendChild(cardHeaderParagraph);

        let infoImg = document.createElement('img');
        infoImg.src = 'assets/icons/glyphicons-196-info-sign.png';
        infoImg.width = 16;
        infoImg.height = 16;
        infoImg.style.cursor = 'pointer';
        cardHeader.appendChild(infoImg);

        let cardBody = document.createElement('div');
        cardBody.id = name + '-card-body';
        cardBody.classList.add('card-body');
        card.appendChild(cardBody);

        let cardDescription = document.createElement('p');
        cardDescription.innerHTML = description;
        cardDescription.classList.add('d-none');
        cardBody.appendChild(cardDescription);

        infoImg.addEventListener('click', function() {
            if (cardDescription.classList.contains('d-none')) {
                cardDescription.classList.remove('d-none');
            } else {
                cardDescription.classList.add('d-none');
            }
        });

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
        cardAnchor.interval = null;
        cardAnchor.intervalHandler = function() {
            cardAnchor.click();
        };
        cardAnchor.addEventListener('mousedown', function() {
            cardAnchor.interval = setInterval(cardAnchor.intervalHandler, 75);
        });
        cardAnchor.addEventListener('mouseup', function() {
            clearInterval(cardAnchor.interval);
        });
        cardAnchor.addEventListener('mouseout', function() {
            clearInterval(cardAnchor.interval);
        });
        cardBody.appendChild(cardAnchor);
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
        this.savegame = JSON.parse(localStorage.getItem('savegame'));
        if (this.savegame === null) {
            this.savegame = new Savegame();
        } else {
            if (this.savegame.version === 'v0.10' || this.savegame.version === 'v0.10b') {
                this.savegame.upgrades['overshieldChance'] = 0;
                this.savegame.upgrades['freezeChance'] = 0;
                this.savegame.version = 'v0.11';
            }

            if (this.savegame.version === 'v0.11') {
                this.savegame.upgrades['plasmaField'] = 0;
                this.savegame.upgrades['titaniumAlloy'] = 0;
                this.savegame.upgrades['clusterAmmunition'] = 0;
                this.savegame.upgrades['burnChance'] = 0;
                this.savegame.modules['droneBay'] = 0;
                this.savegame.modules['hangar'] = 0;
                this.savegame.modules['antimatterSiphon'] = 0;
                this.savegame.modules['warpDrive'] = 0;
                this.savegame.version = 'v0.12';
            }

            if (this.savegame.version !== 'v0.12') {
                this.savegame = new Savegame();
            }
        }

        arcInc.saveSavegame();
    }

    saveSavegame() {
        let savegameString = JSON.stringify(arcInc.savegame);
        localStorage.setItem('savegame', savegameString);
    }

    cloudSave() {
        let savegameString = JSON.stringify(arcInc.savegame);
        localStorage.setItem('savegame', savegameString);
        arcInc.backend.saveUser(arcInc.authToken, savegameString);
    }

    updateCredits() {
        document.getElementById('credits').innerText = 'Credits: ' + arcInc.format(arcInc.savegame.credits) + ' $ (+ ' + arcInc.format(arcInc.cps) + ' $ / s)';
    }

    format(number) {
        let suffixes = ['K', 'M', 'B', 't', 'q', 'Q', 's', 'S', 'o', 'n'];
        let suffix = '';

        for (let i = 0; i < suffixes.length; i++) {
            if (number / 1000 > 1) {
                suffix = suffixes[i];
                number /= 1000;
            } else {
                break;
            }
        }

        return Number(number.toFixed(3)) + suffix;
    }
}

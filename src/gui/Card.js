class Card {
    static prepare(parent, category, name, headerText, description, callback) {
        let card = document.createElement('div');
        card.name = name;
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
        infoImg.width = 22;
        infoImg.height = 22;
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
        cardBody.appendChild(cardText);

        let cardAnchor = document.createElement('p');
        cardAnchor.id = name + '-card-anchor';
        cardAnchor.name = name;
        cardAnchor.style.cursor = 'pointer';
        cardAnchor.style.textDecoration = 'underline';

        cardAnchor.addEventListener('click', callback);
        cardAnchor.interval = null;
        cardAnchor.intervalDelay = 250;
        cardAnchor.intervalHandler = function() {
            if (cardAnchor.style.visibility === 'hidden') {
                clearInterval(cardAnchor.interval);
                cardAnchor.intervalDelay = 250;
            } else {
                cardAnchor.click();
                cardAnchor.intervalDelay = Math.max(10, cardAnchor.intervalDelay - 10);
                clearInterval(cardAnchor.interval);
                cardAnchor.interval = setInterval(cardAnchor.intervalHandler, cardAnchor.intervalDelay);
            }
        };
        cardAnchor.addEventListener('mousedown', function() {
            cardAnchor.interval = setInterval(cardAnchor.intervalHandler, cardAnchor.intervalDelay);
        });
        cardAnchor.addEventListener('mouseup', function() {
            clearInterval(cardAnchor.interval);
            cardAnchor.intervalDelay = 250;
        });
        cardAnchor.addEventListener('mouseout', function() {
            clearInterval(cardAnchor.interval);
            cardAnchor.intervalDelay = 250;
        });
        cardBody.appendChild(cardAnchor);

        let cardAnchorAll = document.createElement('p');
        cardAnchorAll.innerText = 'Buy All';
        cardAnchorAll.style.cursor = 'pointer';
        cardAnchorAll.style.textDecoration = 'underline';
        cardAnchorAll.addEventListener('click', function(){
            let currentLevel = arcInc.savegame[category][name];
            let levelsToBuy = -1;
            let totalCost = 0;
            let nextTotalCost = 0;

            do {
                totalCost = nextTotalCost;
                levelsToBuy++;

                if (category === 'modules') {
                    nextTotalCost += Math.ceil(arcInc.station.modules[name].cost * Math.pow(arcInc.growth, currentLevel + levelsToBuy));
                } else if (category === 'upgrades') {
                    nextTotalCost += Math.ceil(arcInc.objectStore.get('player').upgrades[name].cost * Math.pow(arcInc.growth, currentLevel + levelsToBuy));
                    if (arcInc.objectStore.get('player').upgrades[name].cap !== undefined &&
                        arcInc.objectStore.get('player').upgrades[name].cap <= currentLevel + levelsToBuy) {
                        break;
                    }
                }
            } while (nextTotalCost <= arcInc.savegame.credits);

            if (levelsToBuy > 0) {
                arcInc.savegame.credits -= totalCost;
                arcInc.eventEmitter.emit(Events.CREDITS_UPDATED, arcInc.savegame.credits);

                arcInc.savegame[category][name] += levelsToBuy;
                arcInc.saveSavegame();
                arcInc.objectStore.get('player').applyUpgrades();

                if (category === 'modules') {
                    arcInc.eventEmitter.emit(Events.STATION_MODULE_PURCHASED, {'name': name, 'level': arcInc.savegame.modules[name]});
                } else if (category === 'upgrades') {
                    arcInc.eventEmitter.emit(Events.SHIP_UPGRADE_PURCHASED, {'name': name, 'level': arcInc.savegame.upgrades[name]});
                }
            }
        });
        cardBody.appendChild(cardAnchorAll);

        card.update = function() {
            let levelText = arcInc.savegame[category][name];
            let costText;
            let effectText;

            if (category === 'modules') {
                costText = Utils.format(Math.ceil(arcInc.station.modules[name].cost * Math.pow(arcInc.growth, arcInc.savegame[category][name])));

                let effect = Utils.format(arcInc.station.modules[name].effect * arcInc.savegame[category][name], 4);
                effectText = arcInc.station.modules[name].effectTemplate.replace('{EFFECT}', effect);
            } else if (category === 'upgrades') {
                costText = Utils.format(Math.ceil(arcInc.objectStore.get('player').upgrades[name].cost * Math.pow(arcInc.growth, arcInc.savegame[category][name])));

                let effect = Utils.format(arcInc.objectStore.get('player').stats[name], 4);
                effectText = arcInc.objectStore.get('player').upgrades[name].effectTemplate.replace('{EFFECT}', effect);

                if (arcInc.objectStore.get('player').upgrades[name].cap !== undefined &&
                    arcInc.savegame[category][name] >= arcInc.objectStore.get('player').upgrades[name].cap) {
                    if (!cardAnchor.classList.contains('d-none')) {
                        cardAnchor.classList.add('d-none')
                    }
                    if (!cardAnchorAll.classList.contains('d-none')) {
                        cardAnchorAll.classList.add('d-none')
                    }
                }
            }

            cardText.innerText = 'Level {LEVEL} ({EFFECT})'.replace('{LEVEL}', levelText).replace('{EFFECT}', effectText);
            cardAnchor.innerText = 'Buy 1 ({COST} $)'.replace('{COST}', costText);
        };

        card.setVisibility = function(visible) {
            if (visible) {
                if (card.classList.contains('d-none')) {
                    card.classList.remove('d-none')
                }
            } else {
                if (!card.classList.contains('d-none')) {
                    card.classList.add('d-none')
                }
            }
        };

        arcInc.eventEmitter.subscribe(Events.STATION_MODULE_PURCHASED, card.id, function(event) {
            if (event.name === card.name) {
                card.update();
            }
            card.setVisibility(Utils.areRequirementsMet(category, name));
        });

        arcInc.eventEmitter.subscribe(Events.SHIP_UPGRADE_PURCHASED, card.id, function(event) {
            if (event.name === card.name) {
                card.update();
            }
            card.setVisibility(Utils.areRequirementsMet(category, name));
        });

        return card;
    }
}
class ShipUpgrades {
    static prepare(parent) {
        let categoryCardBody = CategoryCard.prepare(parent, 'ship-upgrades', 'Ship Upgrades');

        let cardDeck;
        for (let i = 0; i < Object.keys(arcInc.objectStore.get('player').upgrades).length; i++) {
            let key = Object.keys(arcInc.objectStore.get('player').upgrades)[i];
            let value = arcInc.objectStore.get('player').upgrades[key];

            if (i%2 === 0) {
                cardDeck = document.createElement('div');
                cardDeck.classList.add('card-deck');
                categoryCardBody.appendChild(cardDeck);
            }

            Card.prepare(
                cardDeck,
                key,
                value.title,
                value.description,
                'Level ' + arcInc.savegame.upgrades[key] + ' (' + value.valueTemplate.replace('VALUE', Utils.format(arcInc.objectStore.get('player').stats[key])) + ')',
                'Buy 1 (' + Utils.format(Math.ceil(value.cost * Math.pow(arcInc.growth, arcInc.savegame.upgrades[key]))) + ' $)',
                function (event) {
                    let key = event.currentTarget.name;
                    let effectiveCost = Math.ceil(value.cost * Math.pow(arcInc.growth, arcInc.savegame.upgrades[key]));
                    if (arcInc.savegame.credits >= effectiveCost) {
                        arcInc.savegame.credits -= effectiveCost;
                        arcInc.eventEmitter.emit(Events.CREDITS_UPDATED, arcInc.savegame.credits);
                        arcInc.savegame.upgrades[key]++;
                        arcInc.saveSavegame();
                        arcInc.objectStore.get('player').applyUpgrades();

                        document.getElementById(key + '-card-text').innerText = 'Level ' + arcInc.savegame.upgrades[key] + ' (' + value.valueTemplate.replace('VALUE', Utils.format(arcInc.objectStore.get('player').stats[key])) + ')';

                        if (value.cap === undefined || arcInc.savegame.upgrades[key] < value.cap) {
                            document.getElementById(key + '-card-anchor').innerText = 'Buy 1 (' + Utils.format(Math.ceil(value.cost * Math.pow(arcInc.growth, arcInc.savegame.upgrades[key]))) + ' $)';
                        } else {
                            let cardAnchor = document.getElementById(key + '-card-anchor');
                            cardAnchor.style.visibility = 'hidden';
                        }
                    }
                });

            if (value.cap !== undefined && arcInc.savegame.upgrades[key] >= value.cap) {
                let cardAnchor = document.getElementById(key + '-card-anchor');
                cardAnchor.style.visibility = 'hidden';
            }
        }
    }
}
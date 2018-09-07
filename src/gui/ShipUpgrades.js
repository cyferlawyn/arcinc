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

            let card = Card.prepare(
                cardDeck,
                'upgrades',
                key,
                value.title,
                value.description,
                function (event) {
                    let key = event.currentTarget.name;
                    let effectiveCost = Math.ceil(value.cost * Math.pow(arcInc.growth, arcInc.savegame.upgrades[key]));
                    if (arcInc.savegame.credits >= effectiveCost) {
                        arcInc.savegame.credits -= effectiveCost;
                        arcInc.savegame.upgrades[key]++;

                        arcInc.saveSavegame();
                        arcInc.objectStore.get('player').applyUpgrades();

                        arcInc.eventEmitter.emit(Events.CREDITS_UPDATED, arcInc.savegame.credits);
                        arcInc.eventEmitter.emit(Events.SHIP_UPGRADE_PURCHASED, {'name': key, 'level': arcInc.savegame.upgrades[key]});
                    }
                });

            card.update();
            //card.setVisibility(Utils.areRequirementsMet('upgrades', key));
        }
    }
}
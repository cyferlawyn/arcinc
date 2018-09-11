class StationModules {
    static prepare(parent) {
        let categoryCardBody = CategoryCard.prepare(parent, 'station-modules', 'Station Modules');

        let cardDeck;
        for (let i = 0; i < Object.keys(arcInc.station.modules).length; i++) {
            let key = Object.keys(arcInc.station.modules)[i];
            let value = arcInc.station.modules[key];

            if (i%2 === 0) {
                cardDeck = document.createElement('div');
                cardDeck.classList.add('card-deck');
                categoryCardBody.appendChild(cardDeck);
            }

            let card = Card.prepare(
                cardDeck,
                'modules',
                key,
                value.title,
                value.description,
                function (event) {
                    event.preventDefault();
                    let key = event.currentTarget.name;
                    let effectiveCost = Math.ceil(value.cost * Math.pow(arcInc.growth, arcInc.savegame.modules[key]));
                    if (arcInc.savegame.credits >= effectiveCost) {
                        arcInc.savegame.credits -= effectiveCost;
                        arcInc.savegame.modules[key]++;

                        arcInc.saveSavegame();
                        arcInc.objectStore.get('player').applyUpgrades();

                        arcInc.eventEmitter.emit(Events.CREDITS_UPDATED, arcInc.savegame.credits);
                        arcInc.eventEmitter.emit(Events.STATION_MODULE_PURCHASED, {'name': key, 'level': arcInc.savegame.modules[key]});
                    }
                    return false;
                });

            card.update();
            //card.setVisibility(Utils.areRequirementsMet('modules', key));
        }
    }
}
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
                    let name = event.currentTarget.name;
                    let effectiveCost = Math.ceil(value.cost * Math.pow(arcInc.station.modules[name].growthFactor, arcInc.savegame.modules[name]));
                    if (arcInc.savegame.credits >= effectiveCost) {
                        arcInc.savegame.credits -= effectiveCost;
                        arcInc.savegame.modules[name]++;

                        arcInc.saveSavegame();
                        arcInc.objectStore.get('player').applyUpgrades();

                        arcInc.eventEmitter.emit(Events.CREDITS_UPDATED, arcInc.savegame.credits);
                        arcInc.eventEmitter.emit(Events.STATION_MODULE_PURCHASED, {'name': name, 'level': arcInc.savegame.modules[name]});
                    }
                    return false;
                });

            card.update();
            //card.setVisibility(Utils.areRequirementsMet('modules', name));
        }
    }
}
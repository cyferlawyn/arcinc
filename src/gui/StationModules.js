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

            Card.prepare(
                cardDeck,
                key,
                value.title,
                value.description,
                'Level ' + arcInc.savegame.modules[key] + ' (' + Utils.format(Math.floor(arcInc.savegame.modules[key] * value.effect)) + ' $ / s)',
                'Buy 1 (' + Utils.format(Math.ceil(value.cost * Math.pow(arcInc.growth, arcInc.savegame.modules[key]))) + ' $)',
                function (event) {
                    let key = event.currentTarget.name;
                    let effectiveCost = Math.ceil(value.cost * Math.pow(arcInc.growth, arcInc.savegame.modules[key]));
                    if (arcInc.savegame.credits >= effectiveCost) {
                        arcInc.savegame.credits -= effectiveCost;
                        arcInc.eventEmitter.emit(Events.CREDITS_UPDATED, arcInc.savegame.credits);
                        arcInc.savegame.modules[key]++;
                        arcInc.saveSavegame();
                        arcInc.objectStore.get('player').applyUpgrades();

                        document.getElementById(key + '-card-text').innerText = 'Level ' + arcInc.savegame.modules[key] + ' (' + Utils.format(Math.floor(arcInc.savegame.modules[key] * value.effect)) + ' $ / s)';
                        document.getElementById(key + '-card-anchor').innerText = 'Buy 1 (' + Utils.format(Math.ceil(value.cost * Math.pow(arcInc.growth, arcInc.savegame.modules[key]))) + ' $)';
                    }
                });
        }
    }
}
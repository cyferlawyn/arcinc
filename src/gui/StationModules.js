class StationModules {
    static prepare(parent) {
        let categoryCardBody = CategoryCard.prepare(parent, 'station-modules', 'Station Modules');

        for (let i = 0; i < Object.keys(arcInc.station.modules).length; i++) {
            let key = Object.keys(arcInc.station.modules)[i];
            let value = arcInc.station.modules[key];

            let card = Card.prepare(
                categoryCardBody,
                'modules',
                key,
                value.title,
                value.description,
                function (event) {
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
                });

            card.update();
            card.setVisibility(Utils.areRequirementsMet('modules', key));
        }
    }
}
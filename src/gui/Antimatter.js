class Antimatter {
    static prepare(parent) {
        let antimatter = CategoryCard.prepare(parent, 'antimatter', 'Antimatter');

        let explanation = document.createElement('p');
        explanation.innerHTML = '<b>Antimatter</b> is this games prestige currency.<br/>' +
            '<br/>' +
            'Once an <b>Antimatter Siphon</b> is installed on your station, you will start collecting <b>Antimatter</b> from defeated bosses.<br/>' +
            'Each <b>Antimatter Siphon</b> will increase the yield by <b>10%</b>. <br />' +
            '<br/>' +
            'To prestige, you will need to install a <b>Warp Drive</b> on your Station.<br/>' +
            '<br/>';
        antimatter.appendChild(explanation);

        let activeAntimatterOuterDiv = document.createElement('div');
        activeAntimatterOuterDiv.classList.add('d-flex', 'justify-content-between');
        antimatter.appendChild(activeAntimatterOuterDiv);

        let activeAntimatter = document.createElement('p');
        activeAntimatter.textContent = 'Active Antimatter: ' + Utils.format(arcInc.savegame.activeAntimatter);
        activeAntimatterOuterDiv.appendChild(activeAntimatter);

        let activeAntimatterEffect = document.createElement('p');
        activeAntimatterEffect.textContent = 'Base stat boost this prestige: ' + Utils.format(arcInc.savegame.activeAntimatter) + '%';
        activeAntimatterOuterDiv.appendChild(activeAntimatterEffect);

        let pendingAntimatterOuterDiv = document.createElement('div');
        pendingAntimatterOuterDiv.classList.add('d-flex', 'justify-content-between');
        antimatter.appendChild(pendingAntimatterOuterDiv);

        let pendingAntimatter = document.createElement('p');
        pendingAntimatter.id = 'pending-antimatter';
        pendingAntimatter.textContent = 'Pending Antimatter: ' + Utils.format(arcInc.savegame.pendingAntimatter);
        pendingAntimatterOuterDiv.appendChild(pendingAntimatter);
        arcInc.eventEmitter.subscribe(Events.ANTIMATTER_UPDATED, '#pending-antimatter', function() {
            document.querySelector('#pending-antimatter').textContent = 'Pending Antimatter: ' + Utils.format(arcInc.savegame.pendingAntimatter);
        } );

        let pendingAntimatterEffect = document.createElement('p');
        pendingAntimatterEffect.id = 'pending-antimatter-effect';
        pendingAntimatterEffect.textContent = 'Base stat boost after prestige: ' + Utils.format((arcInc.savegame.activeAntimatter + arcInc.savegame.pendingAntimatter)) + '%';
        pendingAntimatterOuterDiv.appendChild(pendingAntimatterEffect);
        arcInc.eventEmitter.subscribe(Events.ANTIMATTER_UPDATED, '#pending-antimatter-effect', function() {
            document.querySelector('#pending-antimatter-effect').textContent = 'Base stat boost after prestige: ' + Utils.format((arcInc.savegame.activeAntimatter + arcInc.savegame.pendingAntimatter)) + '%';
        } );

        let button = document.createElement('button');
        button.id = 'warp-button';
        button.classList.add('btn', 'btn-danger');
        button.innerText = 'Warp to Parallel Universe';
        button.addEventListener('click', function() {
            let newSavegame = new Savegame();

            newSavegame.activeAntimatter = arcInc.savegame.activeAntimatter + arcInc.savegame.pendingAntimatter;
            newSavegame.highestWaveEver = arcInc.savegame.highestWaveEver;

            arcInc.savegame = newSavegame;
            arcInc.saveSavegame();

            let savegameString = JSON.stringify(arcInc.savegame);
            localStorage.setItem(savegameName, savegameString);
            location.reload();
        });
        antimatter.appendChild(button);

        // Hide the warp button until the warp drive module is purchased
        if (arcInc.savegame.modules.warpDrive === 0) {
            button.classList.add('d-none');

            arcInc.eventEmitter.subscribe(Events.STATION_MODULE_PURCHASED, '#warp-button', function(event) {
                if(event.name === 'warpDrive') {
                    document.querySelector('#warp-button').classList.remove('d-none');
                    arcInc.eventEmitter.unsubscribe(Events.STATION_MODULE_PURCHASED, '#warp-button')
                }
            } );
        }
    }
}
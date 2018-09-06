class Antimatter {
    static prepare(parent) {
        let antimatter = CategoryCard.prepare(parent, 'antimatter', 'Antimatter');

        let explanation = document.createElement('span');
        explanation.innerHTML = 'Antimatter is this games prestige currency.<br/><br/>' +
            'Once an Antimatter Siphon is installed on your station, you will start collecting Antimatter from defeated bosses.<br/>' +
            'Each Antimatter Siphon will increase the yield by 10%. Press "Warp to Parallel Universe" to prestige<br/><br/>';
        antimatter.appendChild(explanation);

        let activeAntimatterOuterDiv = document.createElement('div');
        activeAntimatterOuterDiv.classList.add('d-flex', 'justify-content-between');
        antimatter.appendChild(activeAntimatterOuterDiv);

        let activeAntimatter = document.createElement('span');
        activeAntimatter.textContent = 'Active Antimatter: ' + Utils.format(arcInc.savegame.activeAntimatter);
        activeAntimatterOuterDiv.appendChild(activeAntimatter);

        let activeAntimatterEffect = document.createElement('span');
        activeAntimatterEffect.textContent = 'Base stat boost this prestige: ' + Utils.format(arcInc.savegame.activeAntimatter/100) + '%';
        activeAntimatterOuterDiv.appendChild(activeAntimatterEffect);

        let pendingAntimatterOuterDiv = document.createElement('div');
        pendingAntimatterOuterDiv.classList.add('d-flex', 'justify-content-between');
        antimatter.appendChild(pendingAntimatterOuterDiv);

        let pendingAntimatter = document.createElement('span');
        pendingAntimatter.id = 'pending-antimatter';
        pendingAntimatter.textContent = 'Pending Antimatter: ' + Utils.format(arcInc.savegame.pendingAntimatter);
        pendingAntimatterOuterDiv.appendChild(pendingAntimatter);
        arcInc.eventEmitter.subscribe(Events.ANTIMATTER_UPDATED, '#pending-antimatter', function() {
            document.querySelector('#pending-antimatter').textContent = 'Pending Antimatter: ' + Utils.format(arcInc.savegame.pendingAntimatter);
        } );

        let pendingAntimatterEffect = document.createElement('span');
        pendingAntimatterEffect.id = 'pending-antimatter-effect';
        pendingAntimatterEffect.textContent = 'Base stat boost after prestige: ' + Utils.format((arcInc.savegame.activeAntimatter + arcInc.savegame.pendingAntimatter)/100) + '%';
        pendingAntimatterOuterDiv.appendChild(pendingAntimatterEffect);
        arcInc.eventEmitter.subscribe(Events.ANTIMATTER_UPDATED, '#pending-antimatter-effect', function() {
            document.querySelector('#pending-antimatter-effect').textContent = 'Base stat boost after prestige: ' + Utils.format((arcInc.savegame.activeAntimatter + arcInc.savegame.pendingAntimatter)/100) + '%';
        } );

        let button = document.createElement('button');
        button.classList.add('btn', 'btn-danger');
        button.innerText = 'Warp to Parallel Universe';
        button.addEventListener('click', function() {
            let newSavegame = new Savegame();
            newSavegame.activeAntimatter = arcInc.savegame.activeAntimatter + arcInc.savegame.pendingAntimatter;
            arcInc.savegame = newSavegame;
            arcInc.saveSavegame();
            let savegameString = JSON.stringify(arcInc.savegame);
            localStorage.setItem(savegameName, savegameString);
            location.reload();
        });
        antimatter.appendChild(button);
    }
}
class Antimatter {
    static prepare(parent) {
        let categoryCardBody = CategoryCard.prepare(parent, 'antimatter', 'Antimatter');

        let explanation = document.createElement('p');
        explanation.innerHTML = '<b>Antimatter</b> is this games prestige currency.<br/>' +
            '<br/>' +
            'Once an <b>Antimatter Siphon</b> is installed on your station, you will start collecting <b>Antimatter</b> from defeated bosses.<br/>' +
            'Each <b>Antimatter Siphon</b> will increase the yield by <b>10%</b>. <br />' +
            '<br/>' +
            'To prestige, you will need to install a <b>Warp Drive</b> on your Station.<br/>' +
            '<br/>';
        categoryCardBody.appendChild(explanation);

        let activeAntimatterOuterDiv = document.createElement('div');
        activeAntimatterOuterDiv.classList.add('d-flex', 'justify-content-between');
        categoryCardBody.appendChild(activeAntimatterOuterDiv);

        let activeAntimatter = document.createElement('p');
        activeAntimatter.id = "active-antimatter";
        activeAntimatter.textContent = 'Active Antimatter: ' + Utils.format(arcInc.savegame.activeAntimatter);
        activeAntimatterOuterDiv.appendChild(activeAntimatter);
        arcInc.eventEmitter.subscribe(Events.ANTIMATTER_UPDATED, '#active-antimatter', function() {
            document.querySelector('#active-antimatter').textContent = 'Active Antimatter: ' + Utils.format(arcInc.savegame.activeAntimatter);
        } );

        let pendingAntimatter = document.createElement('p');
        pendingAntimatter.id = 'pending-antimatter';
        pendingAntimatter.textContent = 'Pending Antimatter: ' + Utils.format(arcInc.savegame.pendingAntimatter);
        activeAntimatterOuterDiv.appendChild(pendingAntimatter);
        arcInc.eventEmitter.subscribe(Events.ANTIMATTER_UPDATED, '#pending-antimatter', function() {
            document.querySelector('#pending-antimatter').textContent = 'Pending Antimatter: ' + Utils.format(arcInc.savegame.pendingAntimatter);
        } );

        let pendingAntimatterOuterDiv = document.createElement('div');
        pendingAntimatterOuterDiv.classList.add('d-flex', 'justify-content-between');
        categoryCardBody.appendChild(pendingAntimatterOuterDiv);

        let activeAntimatterEffect = document.createElement('p');
        activeAntimatterEffect.id = "active-antimatter-effect";
        activeAntimatterEffect.textContent = 'Base stat boost this prestige: ' + Utils.format(arcInc.savegame.activeAntimatter) + ' %';
        pendingAntimatterOuterDiv.appendChild(activeAntimatterEffect);
        arcInc.eventEmitter.subscribe(Events.ANTIMATTER_UPDATED, '#active-antimatter-effect', function() {
            document.querySelector('#active-antimatter-effect').textContent = 'Base stat boost this prestige: ' + Utils.format(arcInc.savegame.activeAntimatter) + ' %';
        } );

        let pendingAntimatterEffect = document.createElement('p');
        pendingAntimatterEffect.id = 'pending-antimatter-effect';
        pendingAntimatterEffect.textContent = 'Base stat boost after prestige: ' + Utils.format((arcInc.savegame.activeAntimatter + arcInc.savegame.pendingAntimatter)) + ' %';
        pendingAntimatterOuterDiv.appendChild(pendingAntimatterEffect);
        arcInc.eventEmitter.subscribe(Events.ANTIMATTER_UPDATED, '#pending-antimatter-effect', function() {
            document.querySelector('#pending-antimatter-effect').textContent = 'Base stat boost after prestige: ' + Utils.format((arcInc.savegame.activeAntimatter + arcInc.savegame.pendingAntimatter)) + ' %';
        } );

        let buttonContainer = document.createElement('div');
        buttonContainer.classList.add('d-flex', 'justify-content-between');
        categoryCardBody.appendChild(buttonContainer);

        let talentButton = document.createElement('button');
        talentButton.classList.add('btn', 'btn-danger');
        talentButton.innerText = 'Spend Antimatter for talents';
        talentButton.addEventListener('click', function() {
            if (talentContainer.classList.contains('d-none')) {
                talentContainer.classList.remove('d-none');
            } else {
                talentContainer.classList.add('d-none');
            }
        });
        buttonContainer.appendChild(talentButton);

        let warpButton = document.createElement('button');
        warpButton.id = 'warp-button';
        warpButton.classList.add('btn', 'btn-danger');
        warpButton.innerText = 'Warp to Parallel Universe';
        warpButton.addEventListener('click', function() {
            let newSavegame = new Savegame();

            newSavegame.activeAntimatter = arcInc.savegame.activeAntimatter + arcInc.savegame.pendingAntimatter;
            newSavegame.highestWaveEver = arcInc.savegame.highestWaveEver;
            newSavegame.talents = arcInc.savegame.talents;
            newSavegame.config = arcInc.savegame.config;

            arcInc.savegame = newSavegame;
            arcInc.saveSavegame();

            let savegameString = JSON.stringify(arcInc.savegame);
            localStorage.setItem(savegameName, savegameString);
            location.reload();
        });
        buttonContainer.appendChild(warpButton);

        // Hide the warp button until the warp drive module is purchased
        if (arcInc.savegame.modules.warpDrive === 0) {
            warpButton.classList.add('d-none');

            arcInc.eventEmitter.subscribe(Events.STATION_MODULE_PURCHASED, '#warp-button', function(event) {
                if(event.name === 'warpDrive') {
                    document.querySelector('#warp-button').classList.remove('d-none');
                    arcInc.eventEmitter.unsubscribe(Events.STATION_MODULE_PURCHASED, '#warp-button')
                }
            } );
        }

        let talentContainer = document.createElement("div");
        talentContainer.classList.add("d-none");
        categoryCardBody.appendChild(talentContainer);

        let cardDeck;
        for (let i = 0; i < Object.keys(arcInc.antimatterTalents.talents).length; i++) {
            let key = Object.keys(arcInc.antimatterTalents.talents)[i];
            let value = arcInc.antimatterTalents.talents[key];

            if (i%2 === 0) {
                cardDeck = document.createElement('div');
                cardDeck.classList.add('card-deck');
                talentContainer.appendChild(cardDeck);
            }

            let card = Card.prepare(
                cardDeck,
                'talents',
                key,
                value.title,
                value.description,
                function (event) {
                    let name = event.currentTarget.name;
                    let effectiveCost = Math.ceil(value.cost * Math.pow(arcInc.antimatterTalents.talents[name].growthFactor, arcInc.savegame.talents[name]));
                    if (arcInc.savegame.activeAntimatter >= effectiveCost) {
                        arcInc.savegame.activeAntimatter -= effectiveCost;
                        arcInc.savegame.talents[name]++;

                        arcInc.saveSavegame();
                        arcInc.antimatterTalents.calculate();
                        arcInc.objectStore.get('player').applyUpgrades();

                        arcInc.eventEmitter.emit(Events.ANTIMATTER_UPDATED, arcInc.savegame.credits);
                        arcInc.eventEmitter.emit(Events.ANTIMATTER_TALENT_PURCHASED, {'name': name, 'level': arcInc.savegame.talents[name]});
                    }
                });

            card.update();
            //card.setVisibility(Utils.areRequirementsMet('talents', name));
        }
    }
}
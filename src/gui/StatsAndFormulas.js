class StatsAndFormulas {
    static prepare(parent) {
        CategoryCard.prepare(parent, 'stats-and-formulas', 'Stats & Formulas');
    }

    static update() {
        let categoryCardBody = document.getElementById('stats-and-formulas-category-card-body');
        if (categoryCardBody === null) {
            return;
        }
        while (categoryCardBody.hasChildNodes()) {
            let cardBodyChild = categoryCardBody.lastChild;
            categoryCardBody.removeChild(cardBodyChild);
        }

        // Enemy
        StatsAndFormulas.prepareCard(
            categoryCardBody,
            'Current Wave Enemy Health',
            '-> 10 * [Growth Factor] ^ [Wave]',
            '-> 10 * [' + arcInc.growth + '] ^ [' + arcInc.sceneManager.scenes['main'].wave + ']',
            '-> ' + Utils.format(10 * arcInc.growth ** arcInc.sceneManager.scenes['main'].wave ));

        StatsAndFormulas.prepareCard(
            categoryCardBody,
            'Current Wave Enemy Damage',
            '-> 5 * [Growth Factor] ^ [Wave]',
            '-> 5 * [' + arcInc.growth + '] ^ [' + arcInc.sceneManager.scenes['main'].wave + ']',
            '-> ' + Utils.format(5 * arcInc.growth ** arcInc.sceneManager.scenes['main'].wave ));

        StatsAndFormulas.prepareCard(
            categoryCardBody,
            'Current Wave Enemy Credits',
            '-> 10 * [Growth Factor] ^ [Wave] * [Effective Kill Credit Multiplier]',
            '-> 10 * [' + arcInc.growth + '] ^ [' + arcInc.sceneManager.scenes['main'].wave + '] * [' + Utils.evStat('effectiveKillCreditMultiplier') + ']',
            '-> ' + Utils.format(10 * arcInc.growth ** arcInc.sceneManager.scenes['main'].wave ) * arcInc.objectStore.get('player').stats.effectiveKillCreditMultiplier);

        // Energy
        StatsAndFormulas.prepareCard(
            categoryCardBody,
            'Effective Energy regeneration Per Tick',
            '-> [Solar Panel Scaling] / 60',
            '-> [' + Utils.evStat('solarPanelScaling') + '] / 60',
            '-> ' + Utils.evStat('effectiveEnergyRegenerationPerTick'));

        // Antimatter
        StatsAndFormulas.prepareCard(
            categoryCardBody,
            'Antimatter Scaling',
            '-> 1 + 0.01 * [Active Antimatter]',
            '-> 1 * 0.01 * [' + Utils.format(arcInc.savegame.activeAntimatter) + ']',
            '-> ' + Utils.evStat('antimatterScaling'));

        // Offense
        StatsAndFormulas.prepareCard(
            categoryCardBody,
            'Effective Projectile Damage',
            '-> 10 * [Projectile Damage] * [Cluster Ammunition] * [Effective Projectile Amount Compensation] * [Antimatter Scaling]',
            '-> 10 * [' + Utils.evStat('projectileDamage') + '] * [' + Utils.evStat('clusterAmmunition') + '] * [' + Utils.evStat('effectiveProjectileAmountCompensation') + '] * [' + Utils.evStat('antimatterScaling') + ']',
            '-> ' + Utils.evStat('effectiveProjectileDamage'));

        StatsAndFormulas.prepareCard(
            categoryCardBody,
            'Effective Critical Hit Damage Multiplier',
            '-> [Critical Hit Damage] * [FactoryScaling] ^ 0.75',
            '-> [' + Utils.evStat('criticalHitDamage') + '] * [' + Utils.evStat('factoryScaling') + '] ^ 0.75',
            '-> ' + Utils.evStat('effectiveCriticalHitDamageMultiplier'));

        StatsAndFormulas.prepareCard(
            categoryCardBody,
            'Effective Critical Projectile Damage',
            '-> [Effective Projectile Damage] * [Effective Critical Hit Damage Multiplier]',
            '-> [' + Utils.evStat('effectiveProjectileDamage') + '] * [' + Utils.evStat('effectiveCriticalHitDamageMultiplier') + ']',
            '-> ' + Utils.format(
            arcInc.objectStore.get('player').stats['effectiveProjectileDamage'] *
            arcInc.objectStore.get('player').stats['effectiveCriticalHitDamageMultiplier']));

        // Defense
        StatsAndFormulas.prepareCard(
            categoryCardBody,
            'Effective Shield Recharge / Tick (In Combat)',
            '-> [Effective Max Shield] / (600 / ([Shield Recharge Time]) * 60)',
            '-> [' + Utils.evStat('effectiveMaxShield') + '] / (600 / [' + Utils.evStat('shieldRechargeTime') + ']) * 60)',
            '-> ' + Utils.evStat('effectiveShieldRechargePerTickInCombat'));

        StatsAndFormulas.prepareCard(
            categoryCardBody,
            'Effective Shield Recharge / tick (Out of Combat for 5 sec)',
            '-> [Effective Shield Recharge Per Tick In Combat] * [Shield Recharge Accelerator]',
            '-> [' + Utils.evStat('effectiveShieldRechargePerTickInCombat') + '] * [' + Utils.evStat('shieldRechargeAccelerator') + ']',
            '-> ' + Utils.evStat('effectiveShieldRechargePerTickOutOfCombat'));

        StatsAndFormulas.prepareCard(
            categoryCardBody,
            'Effective Max Shield',
            '-> 100 * [Max Shield] * [Plasma Field] * [Factory Scaling] * [Antimatter Scaling]',
            '-> 100 * [' + Utils.evStat('maxShield') + '] * [' + Utils.evStat('plasmaField') + '] * [' + Utils.evStat('factoryScaling') +  '] * [' + Utils.evStat('antimatterScaling') + ']',
            '-> ' + Utils.evStat('effectiveMaxShield'));

        StatsAndFormulas.prepareCard(
            categoryCardBody,
            'Effective Max Armor',
            '-> 250 * [Max Armor] * [Titanium Alloy] * [Factory Scaling] * [Antimatter Scaling]',
            '-> 250 * [' + Utils.evStat('maxArmor') + '] * [' + Utils.evStat('titaniumAlloy') + '] * [' + Utils.evStat('factoryScaling') +  '] * [' + Utils.evStat('antimatterScaling') + ']',
            '-> ' + Utils.evStat('effectiveMaxArmor'));

        // Utility
        StatsAndFormulas.prepareCard(
            categoryCardBody,
            'Effective Movement Speed',
            '-> 5 * [Movement Speed]',
            '-> 5 * [' + Utils.evStat('movementSpeed') + ']',
            '-> ' + Utils.evStat('effectiveMovementSpeed'));
    }

    static prepareCard(parent,  headerText, ...bodyText) {
        let card = document.createElement('div');
        card.classList.add('card', 'bg-st-patricks-blue');
        parent.appendChild(card);

        let cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header', 'bg-st-patricks-blue', 'd-flex', 'justify-content-between');
        card.appendChild(cardHeader);

        let cardHeaderParagraph = document.createElement('h5');
        cardHeaderParagraph.innerText = headerText;
        cardHeader.appendChild(cardHeaderParagraph);

        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        card.appendChild(cardBody);

        for (let i = 0; i < bodyText.length; i++)
        {
            let cardText = document.createElement('p');
            cardText.classList.add('card-text');
            cardText.innerText = bodyText[i];
            cardBody.appendChild(cardText);
        }
    }
}
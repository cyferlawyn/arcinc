class Station {
    constructor() {
        this.modules = {
            'solarPanels': {
                'title': 'Solar Panels',
                'cost': 100,
                'revenue': 1
            },
            'scienceLab': {
                'title': 'Science Lab',
                'cost': 1100,
                'revenue': 8
            },
            'factory': {
                'title': 'Factory',
                'cost': 12000,
                'revenue': 47
            }
        };
    }

    init() {
        this.calculateBuildingProduction = function() {
            for (let i = 0; i < Object.keys(arcInc.station.modules).length; i++) {
                let moduleKey = Object.keys(arcInc.station.modules)[i];
                let moduleValue = arcInc.station.modules[moduleKey];

                arcInc.savegame.credits += moduleValue.revenue * arcInc.savegame.modules[moduleKey];
            }

            //document.getElementById('credits').innerText = arcInc.savegame.credits;
        };

        window.setInterval(this.calculateBuildingProduction, 1000);

        this.moduleHandler = function(moduleKey) {
            let cost = arcInc.station.modules[moduleKey].cost * Math.pow(1.15, arcInc.savegame.modules[moduleKey]);
            if (arcInc.savegame.credits >= cost) {
                arcInc.savegame.credits -= cost;
                arcInc.savegame.modules[moduleKey]++;
                //document.getElementById('credits').innerText = arcInc.savegame.credits;
                //document.getElementById(moduleKey + 'Button').innerText = arcInc.station.modules[moduleKey].cost * Math.pow(1.15, arcInc.savegame.modules[moduleKey]);
            }
        };

        //document.getElementById('solarPanelsButton').addEventListener('click', this.moduleHandler('solarPanels'));
        //document.getElementById('scienceLabButton').addEventListener('click', this.moduleHandler('scienceLab'));
        //document.getElementById('factoryButton').addEventListener('click', this.moduleHandler('factory'));
    }
}
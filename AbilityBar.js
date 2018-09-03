class AbilityBar extends PIXI.Container {
    constructor(objectStore) {
        super();
        this.objectStore = objectStore;

        this.textStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 9,
            fill: "white",
            stroke: 'black'
        });

        this.abilities = {
            'tacticalNuke': {
                'name': 'Tactical Nuke',
                'resourceUri': 'assets/sprites/abilities/tacticalNuke.png',
                'abilityController': new TacticalNuke()
            },
            'armorRepairer': {
                'name': 'Armor Repairer',
                'resourceUri': 'assets/sprites/abilities/armorRepairer.png',
                'abilityController': new ArmorRepairer()
            },
            'nyi': {
                'name': 'nyi',
                'resourceUri': 'assets/sprites/abilities/comingSoon.png'
            }
        };

        this.keyBindings = {

            '1': {
                'hotkey': '1',
                'ability': 'tacticalNuke'
            },
            '2': {
                'hotkey': '2',
                'ability': 'armorRepairer'
            },
            '3': {
                'hotkey': '3',
                'ability': 'nyi'
            },
            '4': {
                'hotkey': '4',
                'ability': 'nyi'
            },
            '5': {
                'hotkey': '5',
                'ability': 'nyi'
            },
            '6': {
                'hotkey': '6',
                'ability': 'nyi'
            },
            '7': {
                'hotkey': '7',
                'ability': 'nyi'
            },
            '8': {
                'hotkey': '8',
                'ability': 'nyi'
            },
            '9': {
                'hotkey': '9',
                'ability': 'nyi'
            },
            '10': {
                'hotkey': '0',
                'ability': 'nyi'
            }
        };
    }

    init() {
        let row = 0;
        let col = 0;

        for (let i = 1; i < 11; i++) {
            if (col > 4) {
                row++;
                col = 0;
            }

            let keyBinding = this.keyBindings[i];
            if (keyBinding.ability !== null) {
                let ability = this.abilities[keyBinding.ability];

                let abilityButton = new PIXI.Sprite(PIXI.Loader.shared.resources[ability.resourceUri].texture);
                abilityButton.width = 45;
                abilityButton.height = 45;
                abilityButton.x = col * 50;
                abilityButton.y = row * 50;

                this.addChild(abilityButton);
                this.objectStore.put('abilityButton' + i, abilityButton);

                if (ability.abilityController !== undefined) {
                    ability.abilityController.button = abilityButton;
                    this.objectStore.put('abilityController' + i, ability.abilityController);

                    document.addEventListener('keypress', function (event) {
                        let charCode = (typeof event.which === "number") ? event.which : event.keyCode;
                        if (String.fromCharCode(charCode) === keyBinding.hotkey) {
                            if (document.activeElement.id !== 'chatInput') {
                                ability.abilityController.toggle();
                            }
                        }
                    });
                }

                let hotkeyText = new PIXI.Text(keyBinding.hotkey, this.textStyle);
                hotkeyText.x = col * 50 + 4;
                hotkeyText.y = row * 50 + 2;
                this.addChild(hotkeyText);

                col++;
            }
        }
    }

    update() {
        for (let i = 1; i < 11; i++) {
            let abilityController = this.objectStore.get('abilityController' + i);
            if (abilityController !== undefined) {
                abilityController.update();
            }
        }
    }
}
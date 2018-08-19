class Upgrade extends PIXI.Container {
    constructor(name, title, baseCost, effect, level) {
        super();

        this.name = name;
        this.title = title;
        this.baseCost = baseCost;
        this.effectiveCost = this.baseCost;
        this.effect = effect;
        this.level = level;

        this.init();
    }

    init() {
        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 20,
            fill: "white",
            stroke: 'black',
            strokeThickness: 3
        });

        // outer box
        this.outerBox = new PIXI.Graphics();
        this.outerBox.lineStyle(6, 0xffffff, 1);
        this.outerBox.beginFill(0xdddddd);
        this.outerBox.drawRoundedRect(0, 0, 150, 275, 10);
        this.outerBox.endFill();
        this.outerBox.position.set(0, 0);
        this.addChild(this.outerBox);

        // name
        let nameText = new PIXI.Text(this.title, style);
        nameText.position.set(this.width/2 - nameText.width/2, 10);
        this.addChild(nameText);

        // level
        this.levelText = new PIXI.Text('Level ' + this.level, style);
        this.levelText.position.set(this.width/2 - this.levelText.width/2, 110);
        this.addChild(this.levelText);

        // total
        this.totalText = new PIXI.Text('( + ' + Math.round(this.level * this.effect * 100) + '% )', style);
        this.totalText.position.set(this.width/2 - this.totalText.width/2, 135);
        this.addChild(this.totalText);

        // effect
        let effectText = new PIXI.Text('+ ' + this.effect * 100 + '%', style);
        effectText.position.set(this.width/2 - effectText.width/2, 210);
        this.addChild(effectText);

        // cost
        this.costText = new PIXI.Text(this.effectiveCost + '$', style);
        this.costText.position.set(this.width/2 - this.costText.width/2, 235);
        this.addChild(this.costText);

        this.on('click', function(event){
            if (arcInc.savegame.credits >= event.currentTarget.effectiveCost) {
                arcInc.savegame.credits -= event.currentTarget.effectiveCost;
                arcInc.savegame.upgrades[event.currentTarget.name] += 1;
                arcInc.saveSavegame();
                arcInc.sceneManager.scenes['main'].objectStore.get('player').applyUpgrades();
            }
        });

        this.on('tap', function(event){
            if (arcInc.savegame.credits >= event.currentTarget.effectiveCost) {
                arcInc.savegame.credits -= event.currentTarget.effectiveCost;
                arcInc.savegame.upgrades[event.currentTarget.name] += 1;
                arcInc.saveSavegame();
                arcInc.sceneManager.scenes['main'].objectStore.get('player').applyUpgrades();
            }
        });

        this.on('mouseover', function(event){
            event.currentTarget.outerBox.tint = 0xdddddd;
        });

        this.on('mouseout', function(event){
            event.currentTarget.outerBox.tint = 0xffffff;
        });

        this.interactive = true;
    }

    update() {
        this.effectiveCost = Math.ceil(this.baseCost * Math.pow(1.07, this.level));

        this.levelText.text = 'Level ' + this.level;
        this.totalText.text = '( + ' + Math.round(this.level * this.effect * 100) + '% )';
        this.costText.text = this.effectiveCost + '$';

        if (arcInc.savegame.credits >= this.effectiveCost) {
            this.costText.tint = 0x66ff66;
        } else {
            this.costText.tint = 0xff6666;
        }
    }
}
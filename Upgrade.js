class Upgrade extends PIXI.Container {
    constructor(name, cost, level, effect) {
        super();

        this.name = name;
        this.cost = cost;
        this.level = level;
        this.effect = effect;

        this.init();
    }

    init() {
        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 20,
            fill: "white",
            stroke: 'black',
            strokeThickness: 5
        });

        // outer box
        let outerBox = new PIXI.Graphics();
        outerBox.lineStyle(6, 0xffffff, 1);
        outerBox.beginFill(0xdddddd);
        outerBox.drawRoundedRect(0, 0, 150, 275, 10);
        outerBox.endFill();
        outerBox.position.set(0, 0);
        this.addChild(outerBox);

        // name
        let name = new PIXI.Text(this.name, style);
        name.position.set(this.width/2 - name.width/2, 10);
        this.addChild(name);

        // level
        this.levelText = new PIXI.Text('Level ' + this.level, style);
        this.levelText.position.set(this.width/2 - this.levelText.width/2, 110);
        this.addChild(this.levelText);

        // total
        this.totalText = new PIXI.Text('( + ' + Math.round(this.level * this.effect * 100) + '% )', style);
        this.totalText.position.set(this.width/2 - this.totalText.width/2, 135);
        this.addChild(this.totalText);

        // effect
        let effect = new PIXI.Text('+ ' + this.effect * 100 + '%', style);
        effect.position.set(this.width/2 - effect.width/2, 210);
        this.addChild(effect);

        // cost
        let cost = new PIXI.Text(this.cost + '$', style);
        cost.position.set(this.width/2 - cost.width/2, 235);
        this.addChild(cost);

        this.interactive = true;
    }

    update() {
        this.levelText.text = 'Level ' + this.level;
        this.totalText.text = '( + ' + Math.round(this.level * this.effect * 100) + '% )';
    }
}
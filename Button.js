class Button extends PIXI.Graphics {
    constructor(posX, posY, dimWidth, dimHeight) {
        super();

        this.lineStyle(6, 0xffffff, 1);
        this.beginFill(0xdddddd);
        this.drawRoundedRect(0, 0, dimWidth, dimHeight, 10);
        this.endFill();
        this.position.set(posX, posY);
        this.interactive = true;
        this.on('mouseover', function() {
            this.tint = 0xff3333;
        });
        this.on('mouseout', function() {
            this.tint = 0xffffff;
        });
    }
}
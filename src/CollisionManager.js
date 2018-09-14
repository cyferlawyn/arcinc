class CollisionManager {
    constructor() {
        this.verticalCells = 10;
        this.horizontalCells = 10;

        this.horizontalCellSize = Utils.getEffectiveScreenWidth()/this.horizontalCells;
        this.verticalCellSize = Utils.getEffectiveScreenHeight()/this.verticalCells;

        this.cellHash = {};

        this.cells = [];

        for (let v = 0; v < this.verticalCells; v++) {
            this.cells[v] = [];
        }

            for (let v = 0; v < this.verticalCells; v++) {
                for (let h = 0; h < this.horizontalCells; h++) {
                    let id = v+";"+h;
                    this.cells[v][h] = {"id": id};
                    this.cellHash[id] = this.cells[v][h];
                }
            }

        arcInc.eventEmitter.subscribe(Events.COLLIDER_CREATED, "CollisionManager", this.onColliderCreated.bind(this));
        arcInc.eventEmitter.subscribe(Events.COLLIDER_MOVED, "CollisionManager", this.onColliderMoved.bind(this));
        arcInc.eventEmitter.subscribe(Events.COLLIDER_DESTROYED, "CollisionManager", this.onColliderDestroyed.bind(this));
    }

    onColliderCreated(collider) {
        this.addCollider(collider);
    }

    onColliderMoved(collider) {
        let inCellsCurrently = this.hash(collider);

        for (let i = 0; i < collider.inCellsCurrently.length; i++) {
            if (inCellsCurrently.indexOf(collider.inCellsCurrently[i]) === -1) {
                let cell = this.cellHash[collider.inCellsCurrently[i]];
                delete cell[collider.id];
            }
        }

        for (let i = 0; i < inCellsCurrently.length; i++) {
            let targetCell = this.cellHash[inCellsCurrently[i]];
            targetCell[collider.id] = collider;
        }

        collider.inCellsCurrently = inCellsCurrently;
    }

    onColliderDestroyed(collider) {
        for (let i = 0; i < collider.inCellsCurrently.length; i++) {
            let cell = this.cellHash[collider.inCellsCurrently[i]];
            delete cell[collider.id];
        }
    }

    addCollider(collider) {
        let inCellsCurrently = this.hash(collider);

        for (let i = 0; i < inCellsCurrently.length; i++) {
            let targetCell = this.cellHash[inCellsCurrently[i]];
            targetCell[collider.id] = collider;
        }

        collider.inCellsCurrently = inCellsCurrently;
    }

    hash(collider) {
        let xMin = Math.floor((collider.x - collider.width/2)/this.horizontalCellSize);
        let xMax = Math.floor((collider.x + collider.width/2)/this.horizontalCellSize);

        let yMin = Math.floor((collider.y - collider.height/2)/this.verticalCellSize);
        let yMax = Math.floor((collider.y + collider.height/2)/this.verticalCellSize);

        let cells = [];
        for (let h = xMin; h <= xMax; h++) {
            for (let v = yMin; v <= yMax; v++) {
                if (v >= 0 && v < this.verticalCells && h >= 0 && h < this.horizontalCells) {
                    let targetCell = this.cells[v][h];
                    cells.push(targetCell.id);
                }
            }
        }

        return cells;
    }
}
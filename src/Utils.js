class Utils {
    static format(number, decPlaces) {
        if (number === 0) {
            return 0;
        }

        let prefix = '';
        if (number < 0) {
            prefix = '-';
            number = Math.abs(number);
        }

        let suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "UDc", "DDc",
            "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "ODc", "NoDc", "Vg", "UVg", "DVg", "TVg", "QaVg",
            "QiVg", "SxVg", "SpVg", "OVg", "NoVg", "Tg"];

        if (decPlaces === undefined) {
            decPlaces = 3;
        }

        if (number >= 1) {
            let suffix = " " + suffixes[Math.floor(Math.log10(number) / 3)];
            number = +(Math.pow(10, (Math.log10(number) % 3))).toFixed(decPlaces);

            return prefix + number + suffix;
        } else {
            return prefix + number.toFixed(decPlaces);
        }
    }

    static evStat(name) {
        let stats = arcInc.objectStore.get('player').stats;
        return Utils.format(stats[name]);
    }

    static intersect(r1, r2) {
        let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

        //A variable to determine whether there's a collision
        hit = false;

        //Calculate the distance vector
        vx = (r1.x + Math.abs(r1.width/2) - (r1.width * r1.anchor.x)) - (r2.x + Math.abs(r2.width/2) - (r2.width * r2.anchor.x));
        vy = (r1.y + Math.abs(r1.height/2) - (r1.height * r1.anchor.y)) - (r2.y + Math.abs(r2.height/2) - (r2.height * r2.anchor.y));

        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = Math.abs(r1.width/2) + Math.abs(r2.width/2);
        combinedHalfHeights = Math.abs(r1.height/2) + Math.abs(r2.height/2);

        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {

            //A collision might be occurring. Check for a collision on the y axis
            hit = Math.abs(vy) < combinedHalfHeights;
        } else {

            //There's no collision on the x axis
            hit = false;
        }

        //`hit` will be either `true` or `false`
        return hit;
    }

    static getDistance(r1, r2) {
        let distanceX = r1.x - r2.x;
        let distanceY = r1.y - r2.y;

        // calculate the velocity vector length
        return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    }

    static getNormVector(r1, r2) {
        let distanceX = r1.x - r2.x;
        let distanceY = r1.y - r2.y;

        // calculate the velocity vector length
        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // normalize velocity vector length
        let vx = distanceX / distance;
        let vy = distanceY / distance;

        return {'vx': vx, 'vy': vy};
    }

    static getUUID() {
        let uuid = "";
        for (let i = 0; i < 32; i++) {
            let random = Math.random() * 16 | 0;

            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += "-";
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    }

    static leftBounds(r) {
        return (r.x > 2 * Utils.getEffectiveScreenWidth()
            || r.x < -Utils.getEffectiveScreenWidth()
            || r.y > 2 * Utils.getEffectiveScreenHeight()
            || r.y < -Utils.getEffectiveScreenHeight());
    }

    static leftBoundsStrict(r) {
        return (r.x - r.width > Utils.getEffectiveScreenWidth()
            || r.x + r.width < 0
            || r.y - r.height > Utils.getEffectiveScreenHeight()
            || r.y + r.height < 0);
    }

    static getEffectiveScreenWidth() {
        return arcInc.pixiApp.screen.width / arcInc.pixiApp.stage.scale.x;
    }

    static getEffectiveScreenHeight() {
        return arcInc.pixiApp.screen.height / arcInc.pixiApp.stage.scale.y;
    }

    static areRequirementsMet(category, name) {
        let source;

        if (category === 'modules') {
            source = arcInc.station.modules;
        } else if (category === 'upgrades') {
            source = arcInc.objectStore.get('player').upgrades;
        }

        for (let i = 0; i < source[name].requirements.length; i++) {
            let requirement = source[name].requirements[i];

            if (arcInc.savegame[requirement.type][requirement.name] < requirement.level) {
                return false;
            }
        }

        return true;
    }
}
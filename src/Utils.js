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

        let suffixes = ['', 'K', 'M', 'B', 't', 'q', 'Q', 's', 'S', 'o', 'n'];

        if (decPlaces === undefined) {
            decPlaces = 3;
        }

        if (number >= 1) {
            let suffix = suffixes[Math.floor(Math.log10(number) / 3)];
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
}
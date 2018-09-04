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
        let stats = arcInc.sceneManager.scenes['main'].objectStore.get('player').stats;
        return Utils.format(stats[name]);
    }
}
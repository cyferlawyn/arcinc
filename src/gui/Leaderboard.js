class Leaderboard {
    static prepare(parent) {
        let leaderboard = CategoryCard.prepare(parent, 'leaderboard', 'Leaderboard');

        let scrollBlock = document.createElement('div');
        scrollBlock.style.maxHeight = '200px';
        scrollBlock.style.height = '200px';
        scrollBlock.style.overflow = 'auto';
        scrollBlock.style.margin = '5px 0px';
        leaderboard.appendChild(scrollBlock);

        let table = document.createElement('table');
        table.classList.add('table-sm', 'text-light', 'table-dark', 'bg-st-patricks-blue');
        scrollBlock.appendChild(table);

        let tableHead = document.createElement('thead');
        tableHead.innerHTML =
            '<tr>\n' +
            '  <th>#</th>\n' +
            '  <th>Name</th>\n' +
            '  <th>Highest Wave Ever</th>\n' +
            '  <th>Highest Wave</th>\n' +
            '  <th>Active Antimatter</th>\n' +
            '</tr>'
        table.appendChild(tableHead);

        let leaderboardTableBody = document.createElement('tbody');
        leaderboardTableBody.id = 'leaderboard-table-body';
        table.appendChild(leaderboardTableBody);

        window.setInterval(Leaderboard.update, 10000);
    }

    static update() {
        arcInc.backend.getLeaderboard(Leaderboard.onUpdateReceived)
    }

    static onUpdateReceived(leaderboardData) {
        let leaderboardTableBody = document.querySelector('#leaderboard-table-body');
        while(leaderboardTableBody.hasChildNodes() ){
            leaderboardTableBody.removeChild(leaderboardTableBody.lastChild);
        }

        for (let i = 0; i < leaderboardData.length; i++) {
            let tableRow = document.createElement('tr');
            leaderboardTableBody.appendChild(tableRow);

            let pos = document.createElement('td');
            pos.textContent = leaderboardData[i].rank;
            tableRow.appendChild(pos);

            let name = document.createElement('td');
            name.textContent = leaderboardData[i].name;
            tableRow.appendChild(name);

            let highestWaveEver = document.createElement('td');
            highestWaveEver.textContent = leaderboardData[i].highestWaveEver;
            tableRow.appendChild(highestWaveEver);

            let highestWave = document.createElement('td');
            highestWave.textContent = leaderboardData[i].highestWave;
            tableRow.appendChild(highestWave);

            let antimatter = document.createElement('td');
            antimatter.textContent = Utils.format(leaderboardData[i].activeAntimatter);
            tableRow.appendChild(antimatter);
        }
    }
}
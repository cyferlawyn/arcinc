class Acquisitions {
    static prepare(parent) {
        let categoryCardBody = CategoryCard.prepare(parent, 'aquisitions', 'Acquisitions');

        let progressContainer = document.createElement("div");
        categoryCardBody.appendChild(progressContainer);

        let progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar", "progress-bar-striped", "bg-danger");
        progressBar.setAttribute("role", "progressbar");
        progressBar.progress = 0;
        progressBar.style.width = "100%";
        progressBar.style.height = "20px";
        progressBar.style.cursor = "pointer";
        progressBar.active = false;
        progressBar.textContent = "Click to toggle";
        progressContainer.appendChild(progressBar);
        progressBar.addEventListener("click", function() {
           if (progressBar.active) {
               progressBar.classList.remove("progress-bar-animated", "bg-success");
               progressBar.classList.add("bg-danger");
           } else {
               progressBar.classList.add("progress-bar-animated", "bg-success");
               progressBar.classList.remove("bg-danger");
           }

           progressBar.active = !progressBar.active;
        });
        window.setInterval(function() {
            if (progressBar.active) {
                progressBar.progress += 50;
                if (Math.round(progressBar.progress) >= 100) {
                    progressBar.progress = 0;

                    let acquired = false;

                    for (let acquisition of arcInc.savegame.config.acquisitions) {
                        if (!acquisition.skip) {
                            let effectiveCost;
                            if (acquisition.category === "upgrades") {
                                let value = arcInc.objectStore.get("player").upgrades[acquisition.name];
                                effectiveCost = Math.ceil(value.cost * Math.pow(value.growthFactor, arcInc.savegame.upgrades[acquisition.name]));
                                if (value.cap !== undefined && arcInc.savegame.upgrades[acquisition.name] >= value.cap){
                                    break;
                                }
                            }
                            if (acquisition.category === "modules") {
                                let value = arcInc.station.modules[acquisition.name];
                                effectiveCost = Math.ceil(value.cost * Math.pow(value.growthFactor, arcInc.savegame.modules[acquisition.name]));
                                if (value.cap !== undefined && arcInc.savegame.modules[acquisition.name] >= value.cap){
                                    break;
                                }
                            }

                            if (arcInc.savegame.credits >= effectiveCost) {
                                arcInc.savegame.credits -= effectiveCost;
                                arcInc.savegame[acquisition.category][acquisition.name]++;
                                arcInc.saveSavegame();

                                arcInc.eventEmitter.emit(Events.CREDITS_UPDATED, arcInc.savegame.credits);

                                if (acquisition.category === "upgrades") {
                                    arcInc.eventEmitter.emit(Events.SHIP_UPGRADE_PURCHASED, {
                                        'name': acquisition.name,
                                        'level': arcInc.savegame.upgrades[acquisition.name]
                                    });

                                }
                                if (acquisition.category === "modules") {
                                    arcInc.eventEmitter.emit(Events.STATION_MODULE_PURCHASED, {
                                        'name': acquisition.name,
                                        'level': arcInc.savegame.modules[acquisition.name]
                                    });
                                }

                                acquired = true;
                            }
                        }
                    }

                    if (acquired) {
                        arcInc.objectStore.get('player').applyUpgrades();
                    }
                }
            }
        }, 100);

        let scrollBlock = document.createElement('div');
        scrollBlock.style.maxHeight = '200px';
        scrollBlock.style.height = '200px';
        scrollBlock.style.overflow = 'auto';
        scrollBlock.style.margin = '5px 0px';
        categoryCardBody.appendChild(scrollBlock);

        let table = document.createElement('table');
        table.classList.add('table-sm', 'text-light', 'table-dark', 'bg-st-patricks-blue');
        scrollBlock.appendChild(table);

        let tableHead = document.createElement('thead');
        tableHead.innerHTML =
            '<tr>\n' +
            '  <th>Name</th>\n' +
            '  <th>Category</th>\n' +
            '  <th>Up</th>\n' +
            '  <th>Down</th>\n' +
            '  <th>Skip</th>\n' +
            '</tr>';
        table.appendChild(tableHead);

        let tableBody = document.createElement('tbody');
        tableBody.id = 'aquisition-table-body';
        table.appendChild(tableBody);

        let index = 0;
        for (let acquisition of arcInc.savegame.config.acquisitions){
            index++;

            let tableRow = document.createElement('tr');
            tableBody.appendChild(tableRow);

            let title = document.createElement('td');
            if (acquisition.category === "modules") {
                title.textContent = arcInc.station.modules[acquisition.name].title;
            } else if (acquisition.category === "upgrades") {
                title.textContent = arcInc.objectStore.get("player").upgrades[acquisition.name].title;
            }
            tableRow.appendChild(title);

            let category = document.createElement('td');
            if (acquisition.category === "modules") {
                category.textContent = "Station Module";
            } else if (acquisition.category === "upgrades") {
                category.textContent = "Ship Upgrades";
            }
            tableRow.appendChild(category);

            let upTd = document.createElement("td");
            tableRow.appendChild(upTd);

            let up = document.createElement('img');
            up.src = "assets/icons/arrow-up.png";
            up.style.cursor = "pointer";
            up.height = "10";
            upTd.appendChild(up);
            up.addEventListener("click", function() {
                let acquisitionIndex = arcInc.savegame.config.acquisitions.indexOf(acquisition);
                if (acquisitionIndex > 0) {
                    let removedElement = arcInc.savegame.config.acquisitions.splice(acquisitionIndex, 1)[0];
                    arcInc.savegame.config.acquisitions.splice(acquisitionIndex - 1, 0, removedElement);
                }

                let previousRow = tableRow.previousSibling;
                if (previousRow) {
                    let removedRow = tableBody.removeChild(tableRow);
                    tableBody.insertBefore(removedRow, previousRow);
                }
                arcInc.saveSavegame();
            });

            let downTd = document.createElement("td");
            tableRow.appendChild(downTd);

            let down = document.createElement('img');
            down.src = "assets/icons/arrow-down.png";
            down.style.cursor = "pointer";
            down.height = "10";
            down.tableRow = index;
            downTd.appendChild(down);
            down.addEventListener("click", function() {
                let acquisitionIndex = arcInc.savegame.config.acquisitions.indexOf(acquisition);
                let removedElement = arcInc.savegame.config.acquisitions.splice(acquisitionIndex, 1)[0];
                arcInc.savegame.config.acquisitions.splice(acquisitionIndex+1, 0, removedElement);

                let nextRow = tableRow.nextSibling;
                if (nextRow) {
                    let removedRow = tableBody.removeChild(tableRow);
                    tableBody.insertBefore(removedRow, nextRow.nextSibling);
                }
                arcInc.saveSavegame();
            });

            let skipTd = document.createElement("td");
            tableRow.appendChild(skipTd);

            let skip = document.createElement('input');
            skip.type = "checkbox";
            skip.checked = acquisition.skip;
            skipTd.appendChild(skip);
            skip.addEventListener("click", function(event) {
                acquisition.skip = event.target.checked;
                arcInc.saveSavegame();
            });
        }
    }
}
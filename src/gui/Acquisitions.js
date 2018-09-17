class Acquisitions {
    static prepare(parent) {
        let categoryCardBody = CategoryCard.prepare(parent, 'acquisitionAutomaton', 'Acquisition Automaton');

        let progressContainer = document.createElement("div");
        categoryCardBody.appendChild(progressContainer);

        let progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar", "progress-bar-striped", );
        progressBar.setAttribute("role", "progressbar");
        progressBar.progress = 0;
        progressBar.style.width = "100%";
        progressBar.style.height = "20px";
        progressBar.style.cursor = "pointer";
        progressBar.textContent = "Click to toggle";

        if (!arcInc.savegame.acquisitions.active) {
            progressBar.classList.remove("progress-bar-animated", "bg-success");
            progressBar.classList.add("bg-danger");
        } else {
            progressBar.classList.add("progress-bar-animated", "bg-success");
            progressBar.classList.remove("bg-danger");
        }

        progressContainer.appendChild(progressBar);
        progressBar.addEventListener("click", function() {
           if (arcInc.savegame.acquisitions.active) {
               progressBar.classList.remove("progress-bar-animated", "bg-success");
               progressBar.classList.add("bg-danger");
           } else {
               progressBar.classList.add("progress-bar-animated", "bg-success");
               progressBar.classList.remove("bg-danger");
           }

           arcInc.savegame.acquisitions.active = !arcInc.savegame.acquisitions.active;
           arcInc.saveSavegame();
        });

        window.setInterval(function() {
            if (arcInc.savegame.acquisitions.active) {
                progressBar.progress += 10 / arcInc.antimatterTalents.acquisitionInterval;
                if (Math.round(progressBar.progress) >= 100) {
                    progressBar.progress = 0;

                    let overallCost = 0;
                    let purchases = [];
                    for (let acquisition of arcInc.savegame.acquisitions.config) {
                        if (!acquisition.skip) {
                            let purchase = {};
                            purchase.name = acquisition.name;
                            purchase.amount = 0;
                            purchase.category = acquisition.category;
                            purchase.cost = 0;

                            for (let i = 0; i < arcInc.antimatterTalents.acquisitionBulkBuy; i++) {
                                let capped;
                                let effectiveCost;

                                if (acquisition.category === "upgrades") {
                                    let value = arcInc.objectStore.get("player").upgrades[acquisition.name];
                                    effectiveCost = Math.ceil(value.cost * Math.pow(value.growthFactor, arcInc.savegame.upgrades[acquisition.name]));
                                    capped =  (value.cap !== undefined && arcInc.savegame.upgrades[acquisition.name] >= value.cap)
                                }
                                if (acquisition.category === "modules") {
                                    let value = arcInc.station.modules[acquisition.name];
                                    effectiveCost = Math.ceil(value.cost * Math.pow(value.growthFactor, arcInc.savegame.modules[acquisition.name]));
                                    capped = (value.cap !== undefined && arcInc.savegame.modules[acquisition.name] >= value.cap)
                                }

                                if (capped || effectiveCost + overallCost > arcInc.savegame.credits) {
                                    break;
                                } else {
                                    purchase.amount++;
                                    purchase.cost += effectiveCost;
                                    overallCost += effectiveCost;
                                }
                            }

                            if (purchase.amount > 0) {
                                purchases.push(purchase);
                            }
                        }
                    }

                    for (let purchase of purchases) {
                        arcInc.savegame.credits -= purchase.cost;
                        arcInc.savegame[purchase.category][purchase.name] += purchase.amount;
                        arcInc.saveSavegame();
                        arcInc.objectStore.get('player').applyUpgrades();

                        if (purchase.category === "upgrades") {
                            arcInc.eventEmitter.emit(Events.SHIP_UPGRADE_PURCHASED, {
                                'name': purchase.name,
                                'level': arcInc.savegame.upgrades[purchase.name]
                            });

                        }
                        if (purchase.category === "modules") {
                            arcInc.eventEmitter.emit(Events.STATION_MODULE_PURCHASED, {
                                'name': purchase.name,
                                'level': arcInc.savegame.modules[purchase.name]
                            });
                        }
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
        for (let acquisition of arcInc.savegame.acquisitions.config){
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
                let acquisitionIndex = arcInc.savegame.acquisitions.config.indexOf(acquisition);
                if (acquisitionIndex > 0) {
                    let removedElement = arcInc.savegame.acquisitions.config.splice(acquisitionIndex, 1)[0];
                    arcInc.savegame.acquisitions.config.splice(acquisitionIndex - 1, 0, removedElement);
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
                let acquisitionIndex = arcInc.savegame.acquisitions.config.indexOf(acquisition);
                let removedElement = arcInc.savegame.acquisitions.config.splice(acquisitionIndex, 1)[0];
                arcInc.savegame.acquisitions.config.splice(acquisitionIndex+1, 0, removedElement);

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
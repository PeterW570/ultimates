const searchParams = new URLSearchParams(window.location.search);

const queryVals = {};
for (let [key, val] of searchParams) {
  queryVals[key] = val;
}

const $container = document.querySelector('main.container');
const $loading = document.querySelector('.loading-message');
const $error = document.querySelector('.error-message');
try {
    const teamData = statsData[queryVals.division].find(({ team }) => team == queryVals.team);
    const games = teamData.games;

    const $team = document.createElement('h2');
    $team.appendChild(document.createTextNode(queryVals.team));
    $container.appendChild($team);

    const $division = document.createElement('h4');
    $division.appendChild(document.createTextNode(queryVals.division));
    $container.appendChild($division);

    if (games.length > 0) {
        const $table = document.createElement('table');
        $table.className = 'results-table';

        const columns = [
            { name: 'Score', resolve: game => `${game.scoreFor} - ${game.scoreAgainst}` },
            { name: 'vs', resolve: game => game.against },
            { name: 'Tournament', resolve: game => game.tournament },
            { name: 'Time', resolve: game => {
                return new Intl.DateTimeFormat('en-GB', {
                    year: 'numeric', month: 'numeric', day: 'numeric',
                    hour: 'numeric', minute: 'numeric', second: 'numeric',
                }).format(new Date(game.timestamp));
            }},
        ];
        const $headingTr = document.createElement('tr');
        columns.forEach(col => {
            const $th = document.createElement('th');
            $th.appendChild(document.createTextNode(col.name));
            $headingTr.appendChild($th);
        });
        $table.appendChild($headingTr);
        games.reverse().forEach(game => {
            const $tr = document.createElement('tr');
            columns.forEach(col => {
                const $td = document.createElement('td');
                $td.appendChild(document.createTextNode(col.resolve(game)));
                $tr.appendChild($td);
            });
            $tr.className = game.netScore > 0 ? 'win'
                : game.netScore < 0 ? 'loss'
                : 'draw';
            $table.appendChild($tr);
        });
        $container.appendChild($table);
    }
    else {
        $error.hidden = false;
    }
}
catch (err) {
    console.error(err);
    $error.hidden = false;
}

$loading.hidden = true;

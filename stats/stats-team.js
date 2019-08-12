const searchParams = new URLSearchParams(window.location.search);

const queryVals = {};
for (let [key, val] of searchParams) {
  queryVals[key] = val;
}

const $header = document.querySelector('.team-header');
const $results = document.querySelector('.results-container');
const $stats = document.querySelector('.stats-container');
const $loading = document.querySelector('.loading-message');
const $error = document.querySelector('.error-message');

function createStatFragment(statKey, statValue) {
    const $stat = document.createElement('div');
    $stat.className = 'stat-tile';

    const $statHeading = document.createElement('span');
    $statHeading.appendChild(document.createTextNode(statKey));
    $statHeading.className = 'heading';

    const $statValue = document.createElement('span');
    $statValue.appendChild(document.createTextNode(statValue));

    $stat.appendChild($statHeading);
    $stat.appendChild($statValue);

    return $stat;
}

function bestRival(headToHeads) {
    let bestRival;
    let bestRivalScore = 0;

    for (let team in headToHeads) {
        const score = (15 - headToHeads[team].totalAbsNetScore / headToHeads[team].meetings) * (1 + headToHeads[team].meetings/8);
        // TODO: factor in recency and bonus for if each team has won & lost
        if (score > bestRivalScore) {
            bestRivalScore = score;
            bestRival = team;
        }
    }

    return bestRival;
}

try {
    const teamData = statsData[queryVals.division].find(({ team }) => team == queryVals.team);
    const games = teamData.games;

    const $team = document.createElement('h2');
    $team.appendChild(document.createTextNode(queryVals.team));
    $header.appendChild($team);

    const $division = document.createElement('h4');
    $division.appendChild(document.createTextNode(queryVals.division));
    $header.appendChild($division);

    const record = {
        wins: 0,
        losses: 0,
        draws: 0
    };
    let totalNetScore = 0;
    const headToHeads = {};

    const $resultsHeader = document.createElement('h4');
    $resultsHeader.appendChild(document.createTextNode('Results'));
    $results.appendChild($resultsHeader);

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

            const againstAlias = statAliases[queryVals.division][game.against] || game.against;
            if (againstAlias in headToHeads) {
                headToHeads[againstAlias].meetings++;
                headToHeads[againstAlias].totalAbsNetScore += Math.abs(game.netScore);
                headToHeads[againstAlias].wins += game.netScore > 0 ? 1 : 0;
                headToHeads[againstAlias].losses += game.netScore < 0 ? 1 : 0;
                headToHeads[againstAlias].draws += game.netScore == 0 ? 1 : 0;
            }
            else {
                headToHeads[againstAlias] = {
                    meetings: 1,
                    totalAbsNetScore: Math.abs(game.netScore),
                    wins: game.netScore > 0 ? 1 : 0,
                    losses: game.netScore < 0 ? 1 : 0,
                    draws: game.netScore == 0 ? 1 : 0,
                };
            }

            if (game.netScore > 0) {
                $tr.className = 'win';
                record.wins++;
            }
            else if (game.netScore < 0) {
                $tr.className = 'loss';
                record.losses++;
            }
            else {
                tr.className = 'draw';
                record.draws++;
            }
            totalNetScore += game.netScore;

            $table.appendChild($tr);
        });
        $results.appendChild($table);
        const $totalWins = createStatFragment('Overall Record', `${record.wins}W ${record.losses}L ${record.draws}D`);
        const $averageNetScore = createStatFragment('Average W/L Margin', (totalNetScore / games.length).toFixed(2));
        const $biggestRival = createStatFragment('Biggest Rival', bestRival(headToHeads));
        [$totalWins, $averageNetScore, $biggestRival].forEach(fragment => $stats.appendChild(fragment));
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

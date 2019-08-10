const container = document.querySelector('main.container');

Object.keys(statsData).forEach(division => {
    const divisionContainer = document.createElement('div');
    divisionContainer.className = 'division-list';

    const heading = document.createElement('h3');
    heading.appendChild(document.createTextNode(division));

    const teamList = document.createElement('ul');
    statsData[division].forEach(({ team, games }) => {
        const teamItem = document.createElement('li');
        teamItem.className = 'team-item';

        const link = document.createElement('a');
        link.setAttribute('href', `team.html?team=${encodeURIComponent(team)}&division=${division}`)
        link.appendChild(document.createTextNode(team));

        const lastFiveGames = games.slice(-5);

        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'result-indicators';
        lastFiveGames.forEach(game => {
            const resultDiv = document.createElement('div');
            const result = game.netScore > 0 ? 'win'
                : game.netScore < 0 ? 'loss'
                : 'draw';
            resultDiv.className = `result-indicator ${result}`;
            resultDiv.setAttribute('title', `${result[0].toUpperCase() + result.slice(1)} ${game.scoreFor}-${game.scoreAgainst} vs ${game.against}`);

            resultsContainer.appendChild(resultDiv)
        });
        teamItem.appendChild(resultsContainer);

        teamItem.appendChild(link);
        teamList.appendChild(teamItem);
    });

    divisionContainer.appendChild(heading);
    divisionContainer.appendChild(teamList);
    container.appendChild(divisionContainer);
});

const initialSeeding = [
  '-',
  'Seattle Mixtape',
  'AMP',
  'BFG',
  'Anchor',
  'GRUT',
  'Crash',
  'Friskee',
  'Cafe de Luida',
  'Slow White',
  'Hässliche Erdferkel',
  'Freakshow Singapore',
  'Wild Card',
  'Marvellous DC',
  'Pie Wagon',
  'Banana Cutters',
  'Battleship',
  'SMOG',
  'Urosoul',
  'Sesquidistus',
  'Reading Ultimate',
  'Shinshu Loose',
  'Voltaje',
  'Black Eagles',
  'Colorado',
  'Macondo',
  'Sugar Mix',
  'BOOM!',
  'Mulatto Pilipinas',
  'Flying Rabbits Ultimate Club',
  'Vanguard',
  'IKU',
  'Mubidisk',
  'Cóndor Ultimate',
  'Stall7',
  'UCT Flying Tigers',
  'Hong Kong NEON',
  'RusMixed',
  'Glasgow Ultimate',
  'Panthers Bern',
  'Black Sheep',
  'Yanomami',
  'Disctèrics',
  'Wizards',
  'Chuckies',
  'Argentina Ultimate Club',
  'Kisumu Frisbee Club',
  'Disco Sour',
  'Charrúa'
]

const numPools = 8;

function seedToPosition(seed) {
  return Math.ceil(seed / numPools);
}

function shouldReverseForPos(position) {
  return Math.floor(position / 2) % 2;
}

function seedToPool(seed, shouldReverse) {
  let pool = seed % numPools;
  if (pool === 0)
    pool = numPools;
  if (shouldReverse)
    pool = numPools + 1 - pool;
  return pool;
}

function seedToPoolIndexMap(seed) {
  var position = seedToPosition(seed);
  var shouldReverse = shouldReverseForPos(position);
  var pool = seedToPool(seed, shouldReverse);

  return {
    pool: pool - 1,
    pos: position - 1
  };
}

let poolData = [];
initialSeeding.forEach((team, i) => {
  if (i === 0)
     return;

  if (i <= numPools) {
    poolData.push({
      name: String.fromCharCode(64 + i),
      teams: [
        team
      ]
    })
  }
  else {
    let teamPoolIndex = seedToPoolIndexMap(i);
    poolData[teamPoolIndex.pool].teams.push(team);
  }
});

Vue.component('pool-results', {
  template: '#pool-results-template',
  props: ['pool', 'poolResults'],
  methods: {
    seedForTeam(team) {
      return initialSeeding.indexOf(team);
    }
  }
});

Vue.component('bracket', {
  template: '#bracket-template',
  props: ['teams', 'initialRounds'],
  data() {
    return {
      rounds: _.cloneDeep(this.initialRounds)
    }
  },
  methods: {
    teamsForMatch: function(match, round) {
      if (round == 0) {
        var teamIndices = this.rounds[0][match].teams;
        return [
          teamIndices[0],
          teamIndices[1]
        ]
      }
      else {
        var previousRound = this.rounds[round - 1]
        return [
          previousRound[match * 2].winner,
          previousRound[match * 2 + 1].winner]
      }
    },
    onSelectWinner: function(team, match, round) {
      var teams = this.teamsForMatch(match, round);

      if (teams[team] === 0)
        return

      var match = this.rounds[round][match];
      match.winner = teams[team]
      match.selected = team
    }
  },
  computed: {
    roundsWithTeams() {
      let roundsWithTeams = _.cloneDeep(this.rounds);
      roundsWithTeams.forEach((round, roundIdx) => {
        round.forEach((match, matchIdx) => {
          let teamIndices = this.teamsForMatch(matchIdx, roundIdx);
          match.teams = [
            this.teams[teamIndices[0]],
            this.teams[teamIndices[1]]
          ]
          if (!_.includes(teamIndices, match.winner)) {
            match.winner = 0;
            match.selected = null;

            var origMatch = this.rounds[roundIdx][matchIdx]
            origMatch.winner = 0;
            origMatch.selected = null;
          }
        })
      })
      return roundsWithTeams;
    }
  }
});

new Vue({
  el: '#app',
  data() {
    return {
      tournament: 'WUCC 2018',
      title: 'Mixed Division',
      poolData: poolData,
      teamsAfterPools: [],
      rounds: [[
        {
          info: 'Bye (1)',
          teams: [1, 0],
          winner: 1,
          selected: 0,
          bye: true
        },
        {
          info: 'RO32 (32 vs 34)',
          teams: [32, 34],
          winner: 0,
          selected: null
        },
        {
          info: 'Bye (15)',
          teams: [15, 0],
          winner: 15,
          selected: 0,
          bye: true
        },
        {
          info: 'Bye (18)',
          teams: [18, 0],
          winner: 18,
          selected: 0,
          bye: true
        },
        {
          info: 'Bye (8)',
          teams: [8, 0],
          winner: 8,
          selected: 0,
          bye: true
        },
        {
          info: 'RO32 (25 vs 39)',
          teams: [25, 39],
          winner: 0,
          selected: null
        },
        {
          info: 'Bye (10)',
          teams: [10, 0],
          winner: 10,
          selected: 0,
          bye: true
        },
        {
          info: 'Bye (23)',
          teams: [23, 0],
          winner: 23,
          selected: 0,
          bye: true
        }, {
          info: 'Bye (4)',
          teams: [4, 0],
          winner: 4,
          selected: 0,
          bye: true
        },
        {
          info: 'RO32 (29 vs 35)',
          teams: [29, 35],
          winner: 0,
          selected: null
        },
        {
          info: 'Bye (14)',
          teams: [14, 0],
          winner: 14,
          selected: 0,
          bye: true
        },
        {
          info: 'Bye (19)',
          teams: [19, 0],
          winner: 19,
          selected: 0,
          bye: true
        },
        {
          info: 'Bye (5)',
          teams: [5, 0],
          winner: 5,
          selected: 0,
          bye: true
        },
        {
          info: 'RO32 (28 vs 35)',
          teams: [28, 35],
          winner: 0,
          selected: null
        },
        {
          info: 'Bye (11)',
          teams: [11, 0],
          winner: 11,
          selected: 0,
          bye: true
        },
        {
          info: 'Bye (22)',
          teams: [22, 0],
          winner: 22,
          selected: 0,
          bye: true
        },
        {
          info: 'Bye (3)',
          teams: [3, 0],
          winner: 3,
          selected: 0,
          bye: true
        },
        {
          info: 'RO32 (30 vs 36)',
          teams: [30, 36],
          winner: 0,
          selected: null
        },
        {
          info: 'Bye (13)',
          teams: [13, 0],
          winner: 13,
          selected: 0,
          bye: true
        },
        {
          info: 'Bye (20)',
          teams: [20, 0],
          winner: 20,
          selected: 0,
          bye: true
        },
        {
          info: 'Bye (6)',
          teams: [6, 0],
          winner: 6,
          selected: 0,
          bye: true
        },
        {
          info: 'RO32 (27 vs 37)',
          teams: [27, 37],
          winner: 0,
          selected: null
        },
        {
          info: 'Bye (12)',
          teams: [12, 0],
          winner: 12,
          selected: 0,
          bye: true
        },
        {
          info: 'Bye (21)',
          teams: [21, 0],
          winner: 21,
          selected: 0,
          bye: true
        }, {
          info: 'Bye (2)',
          teams: [2, 0],
          winner: 2,
          selected: 0,
          bye: true
        },
        {
          info: 'RO32 (31 vs 33)',
          teams: [31, 33],
          winner: 0,
          selected: null
        },
        {
          info: 'Bye (16)',
          teams: [16, 0],
          winner: 16,
          selected: 0,
          bye: true
        },
        {
          info: 'Bye (17)',
          teams: [17, 0],
          winner: 17,
          selected: 0,
          bye: true
        },
        {
          info: 'Bye (7)',
          teams: [7, 0],
          winner: 7,
          selected: 0,
          bye: true
        },
        {
          info: 'RO32 (26 vs 40)',
          teams: [26, 40],
          winner: 0,
          selected: null
        },
        {
          info: 'Bye (9)',
          teams: [9, 0],
          winner: 9,
          selected: 0,
          bye: true
        },
        {
          info: 'Bye (24)',
          teams: [24, 0],
          winner: 24,
          selected: 0,
          bye: true
        }
      ], [
        {
          info: 'RO32 (1 vs 32)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO32 (15 vs 18)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO32 (8 vs 25)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO32 (10 vs 23)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO32 (4 vs 29)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO32 (14 vs 19)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO32 (5 vs 28)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO32 (11 vs 22)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO32 (3 vs 30)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO32 (13 vs 20)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO32 (6 vs 27)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO32 (12 vs 21)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO32 (2 vs 31)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO32 (16 vs 17)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO32 (7 vs 26)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO32 (9 vs 24)',
          winner: 0,
          selected: null
        }
      ], [
        {
          info: 'RO16 (1 vs 15)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO16 (8 vs 10)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO16 (4 vs 14)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO16 (5 vs 11)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO16 (3 vs 13)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO16 (6 vs 12)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO16 (2 vs 16)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO16 (7 vs 9)',
          winner: 0,
          selected: null
        }
      ], [
        {
          info: 'QF (1 vs 8)',
          winner: 0,
          selected: null
        },
        {
          info: 'QF (4 vs 5)',
          winner: 0,
          selected: null
        },
        {
          info: 'QF (3 vs 6)',
          winner: 0,
          selected: null
        },
        {
          info: 'QF (2 vs 7)',
          winner: 0,
          selected: null
        }
      ], [
        {
          info: 'SF (1 vs 4)',
          winner: 0,
          selected: null
        },
        {
          info: 'SF (2 vs 3)',
          winner: 0,
          selected: null
        }
      ], [
        {
          info: 'Final (1 vs 2)',
          winner: 0,
          selected: null
        }
      ]]
    }
  },
  created() {
    this.updateBracketInitialData();
  },
  methods: {
    updateBracketInitialData() {
      this.teamsAfterPools = this.teamListAfterPools();
    },
    teamListAfterPools() {
      let teamList = [
        '-'
      ]
      for (let i = 1; i < initialSeeding.length; i++) {
        let teamIndex = seedToPoolIndexMap(i);
        let pool = teamIndex.pool;
        let pos = teamIndex.pos;
        teamList.push(poolData[pool].teams[pos]);
      }
      return teamList;
    }
  }
})

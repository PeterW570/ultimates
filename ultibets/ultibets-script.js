var publicSpreadsheetUrl =
  'https://docs.google.com/spreadsheets/d/1qXQFz5mYEWBGSz252q1D8zjM-x0zPAkxhwmsZUvFpl4/edit?usp=sharing';

new Vue({
  el: '#app',
  data() {
    return {
      availableBetsData: [],
      rawAvailableBetsData: [],
      balance: 100,
      pendingBets: [],
      betToPlace: 0,
      selectedBet: null,
      loading: true
    };
  },
  created() {
    Tabletop.init({
      key: publicSpreadsheetUrl,
      callback: this.parseDataForSchedule
    });
  },
  methods: {
    parseDataForSchedule(data) {
      let tournamentOddsSheet = data['Tournament Odds'];
      let parsedAvailableOdds = {};
      let availableBets = tournamentOddsSheet.elements;
      availableBets.forEach(bet => {
        if (!(bet['Tournament'] in parsedAvailableOdds)) {
            parsedAvailableOdds[bet['Tournament']] = {};
        }
        if (!(bet['Division'] in parsedAvailableOdds[bet['Tournament']])) {
            parsedAvailableOdds[bet['Tournament']][bet['Division']] = [];
        }
        parsedAvailableOdds[bet['Tournament']][bet['Division']].push({
            team: bet['Team'],
            odds: bet['Odds']
        });
      });
      this.rawAvailableBetsData = availableBets;
      this.availableBetsData = parsedAvailableOdds;
      this.loading = false;
    },
    selectBet(team, division, tournament) {
        this.selectedBet = {
            tournament,
            division,
            ...team
        }
    },
    placeBet() {
        this.pendingBets.push({
            value: this.betToPlace,
            ...this.selectedBet
        });
        this.balance -= this.betToPlace;
        this.selectedBet = null;
        this.betToPlace = 0;
    },
    potentialBetGains(bet, odds) {
        return bet * odds;
    }
  },
  filters: {
      prettyOdds(odds) {
          if (odds < 10) {
              return '+' + odds * 100;
          }
          else if (odds.endsWith('.5')) {
              return Number(odds) * 2 + '/2';
          }
          else {
              return odds + '/1';
          }
      }
  }
});

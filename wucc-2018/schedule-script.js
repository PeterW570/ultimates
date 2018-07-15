var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1kqbddiAi-NBjZGvYhXROzzFzkB0_MKiRgM_naIgEr5E/edit?usp=sharing';

Vue.component('match-list', {
template: '#match-list-template',
props: ['matchList', 'relativeTiming'],
methods: {
  flagClass(match, team) {
    return 'flag-icon flag-icon-' + match['Team ' + team + ' CC'];
  },
  streamLinkForMatch(match) {
    let stream = match['Stream'];
    switch(stream) {
      case 'Ultiworld':
        return 'https://ultiworld.com/live';
      case 'Fanseat':
        return 'https://www.fanseat.com/league/wfdf';
      case 'Olympic Channel':
        return 'https://www.olympicchannel.com/';
      case 'WFDF':
        return 'https://www.youtube.com/user/WFDFChannel';
      default:
        return '';
    }
  }
},
filters: {
  localTime(timestamp) {
    return moment(timestamp).format("h:mma");
  },
  timeFromNow(timestamp) {
    return moment(timestamp).fromNow();
  },
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
});

new Vue({
el: '#app',
data() {
  return {
    scheduleData: [],
    rawScheduleData: [],
    loading: true
  }
},
created() {
  Tabletop.init({
    key: publicSpreadsheetUrl,
    callback: this.parseDataForSchedule,
    simpleSheet: true
  });
},
methods: {
  parseDataForSchedule(data) {
    var parsed = {};
    data.forEach(row => {
      if (parsed[row['Day']])
        parsed[row['Day']].push(row);
      else
        parsed[row['Day']] = [row];
    });
    this.rawScheduleData = data;
    this.scheduleData = parsed;
    this.loading = false;
  }
},
computed: {
  upcomingGames() {
    let gamesInFuture = this.rawScheduleData.filter(d => {
      var diff = moment().diff(moment(d['Time']), 'minutes');
      return diff < 0;
    });
    return gamesInFuture.slice(0, 4);
  },
  liveGames() {
    let liveGames = this.rawScheduleData.filter(d => {
      var diff = moment().diff(moment(d['Time']), 'minutes');
      return diff >= 0 && diff < 120;
    });
    return liveGames;
  }
},
filters: {
  prettyDay(day) {
    return moment(day).format('dddd Do MMMM');
  }
}
});

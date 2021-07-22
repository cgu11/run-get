const fetch = require('node-fetch');
const config = require('./config');
module.exports = {
  twitchUser: async name => {
    const response = await fetch(`https://www.speedrun.com/api/v1/users?twitch=${name}`);
    const object = await response.json();
    return object.data.length === 0 ? undefined : {"name": object.data[0].names.international, "id": object.data[0].id};
  },
  srcUser: async name => {
    const response = await fetch(`https://www.speedrun.com/api/v1/users?name=${name}&max=2`);
    const object = await response.json();
    return object.data.length === 0 ? 'No user found with name ' + name : object.data.length > 1 ? 'Too many users found. Try connecting your Twitch account to speedrun.com and use that.' : {"name": object.data[0].names.international, "id": object.data[0].id};
  },
  srcUserById: async id => {
    const response = await fetch(`https://www.speedrun.com/api/v1/users/${id}`);
    const object = await response.json();
    return object.status == 404 ? 'No user found with id ' + id : {"name": object.data.names.international};
  },
  moderatedGames: async id => {
    const response = await fetch(`https://www.speedrun.com/api/v1/games?moderator=${id}&max=200`);
    const object = await response.json();
    return object.data;
  },
  game: async abbr => {
    const response = await fetch(`https://www.speedrun.com/api/v1/games?abbreviation=${abbr}`);
    const object = await response.json();
    return object.data.length === 0 ? undefined : object.data[0];
  },
  verifiedRuns: async page => {
    const offset = page === 0 ? '' : '&offset=' + (20 * page).toString();
    const response = await fetch(`https://www.speedrun.com/api/v1/runs?status=verified&orderby=verify-date&direction=desc&embed=game,category.variables,players,level${offset}`);
    const object = await response.json();
    return object.data;
  },
  levelLB: async (game, level, category, subcategory) => {
    const response = await fetch(`https://www.speedrun.com/api/v1/leaderboards/${game}/level/${level}/${category}${subcategory}`);
    const object = await response.json();
    return object.data.runs;
  },
  gameLB: async (game, category, subcategory) => {
    const response = await fetch(`https://www.speedrun.com/api/v1/leaderboards/${game}/category/${category}${subcategory}`);
    const object = await response.json();
    return object.data.runs;
  },
  varLevelLB: async(game, level, category, subcategory, varID, varValue) => {
    subcatQuery = subcategory
    subcatQuery += subcategory === '' ? '?var-' + varID + '=' + varValue : '&var-' + varID + '=' + varValue;
    const response = await fetch(`https://www.speedrun.com/api/v1/leaderboards/${game}/level/${level}/${category}${subcatQuery}`);
    const object = await response.json();
    return object.data.runs;
  },
  varGameLB: async(game, category, subcategory, varID, varValue) => {
    subcatQuery = subcategory
    subcatQuery += subcategory === '' ? '?var-' + varID + '=' + varValue : '&var-' + varID + '=' + varValue;
    const response = await fetch(`https://www.speedrun.com/api/v1/leaderboards/${game}/category/${category}${subcatQuery}`);
    const object = await response.json();
    return object.data.runs;
  },
  submittedRuns: async page => {
    const offset = page === 0 ? '' : '&offset=' + (20 * page).toString();
    const response = await fetch(`https://www.speedrun.com/api/v1/runs?status=new&orderby=submitted&direction=desc&embed=game,category.variables,players,level${offset}`);
    const object = await response.json();
    return object.data;
  },
  variable: async varID => {
    const response = await fetch(`https://www.speedrun.com/api/v1/variables/${varID}`);
    const object = await response.json();
    return object.status == 404 ? 'No variable found with id ' + varID : {
      name: object.data.name,
      values: object.data.values.values
    };
  },
  discordID: async username => {
    const response = fetch(`https://www.speedrun.com/user/${username}`);
    var rawHTML = response.text();
    const regex = /\Discord: (.*\d{4})/s;
    var discordIDs = regex.exec(rawHTML);

    return discordIDs !== null ? discordIDs[1] : "";
  }
}

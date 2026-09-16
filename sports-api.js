// Sport Live - TheSportsDB V1 API helper
// Public demo key: 123. This file is safe to load in the browser.
const SPORT_API_BASE = 'https://www.thesportsdb.com/api/v1/json/123';

async function sportsApi(path) {
  const response = await fetch(`${SPORT_API_BASE}/${path}`);
  if (!response.ok) throw new Error(`Sports API error: ${response.status}`);
  return response.json();
}

async function getEventsByDate(date, sport = '') {
  const suffix = sport && sport !== 'All' ? `&s=${encodeURIComponent(sport)}` : '';
  return sportsApi(`eventsday.php?d=${encodeURIComponent(date)}${suffix}`);
}

async function getNextEventsForLeague(leagueId) {
  return sportsApi(`eventsnextleague.php?id=${encodeURIComponent(leagueId)}`);
}

async function searchTeams(teamName) {
  return sportsApi(`searchteams.php?t=${encodeURIComponent(teamName)}`);
}

async function searchLeagues(leagueName) {
  return sportsApi(`search_all_leagues.php?c=${encodeURIComponent(leagueName)}`);
}

function normalizeSportsDbEvent(event) {
  const sport = event.strSport || 'Other';
  const iconMap = {
    Soccer: '⚽', Tennis: '🎾', Basketball: '🏀', Volleyball: '🏐',
    Hockey: '🏒', Baseball: '⚾', Motorsport: '🏎️', Rugby: '🏉',
    Cricket: '🏏', Golf: '⛳', Boxing: '🥊', Cycling: '🚴'
  };
  return {
    id: event.idEvent,
    sport,
    icon: iconMap[sport] || '🏅',
    status: event.strStatus || (event.dateEvent === new Date().toISOString().slice(0, 10) ? 'Today' : 'Scheduled'),
    a: event.strHomeTeam || 'TBA',
    b: event.strAwayTeam || 'TBA',
    sa: event.intHomeScore ?? '-',
    sb: event.intAwayScore ?? '-',
    bottom: [event.strLeague, event.strVenue, event.strTime].filter(Boolean).join(' · ')
  };
}

window.SportLiveAPI = {
  getEventsByDate,
  getNextEventsForLeague,
  searchTeams,
  searchLeagues,
  normalizeSportsDbEvent
};

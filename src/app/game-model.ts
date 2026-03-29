export interface Game {
  id: string;
  sport_key: string;
  commence_time: string;
  homeTeam: string;
  awayTeam: string;
  bookmaker_name: string;
  home_team_price: number;
  away_team_price: number;
  home_team_spread: number;
  home_team_spread_price: number;
  away_team_spread: number;
  away_team_spread_price: number;
  week_id: string;
  createdAt: string;
}
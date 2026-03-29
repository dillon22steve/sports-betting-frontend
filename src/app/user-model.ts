import { UserBet } from "./user-bet-model";

export interface User {
  id: string;
  username: string;
  email: string;
  balance? : number;
  userBets?: UserBet[];
}
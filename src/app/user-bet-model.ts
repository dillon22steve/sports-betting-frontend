export interface UserBet {
  id: string;
  userId: string;
  gameId: string;
  amountBet: number;
  isSpreadBet: boolean;
  isCompleted: boolean;
  isWin: boolean;
  amountWonOrLost: number;
}
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Game } from '../game-model';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user-service';

@Component({
  selector: 'app-bet-slip',
  templateUrl: './betting-slip.html',
  styleUrls: ['./betting-slip.css'],
  imports: [FormsModule, CommonModule]
})
export class BettingSlipComponent {
  @Input() selectedBet: any;
  @Input() bets: Bet[] = [];
  @Input() isBetSlipOpen = false;
  @Input() currentUser: any;
  @Output() closeBetSlip = new EventEmitter<void>();
  @Output() userUpdate = new EventEmitter<any>();

  constructor(private http: HttpClient, private userService: UserService) {}

  wagers: number[] = [];

  close() {
    this.isBetSlipOpen = false;
  }

  calculateToWin(bet: Bet, wager: number): number {
    if (!wager) return 0;

    let result: number;

    // American odds calculation
    if (bet.price > 0) {
      result = (wager * bet.price) / 100;
    } else {
      result = (wager * 100) / Math.abs(bet.price);
    }

    // Round to two decimals
    return Math.round(result * 100) / 100;
  }


  removeBet(index: number) {
    this.bets.splice(index, 1);
    // Auto-close if the last bet is removed
    if (this.bets.length === 0) {
      this.closeBetSlip.emit();
    }
  }

  // Placeholder for the "Place Bet" logic
  placeBet(selectedBet: number) {
    console.log('Bets placed:', selectedBet, " Current User:", this.currentUser.source.value.id);

    const apiEndpoint = 'http://localhost:8080/bets/place';
    const input = document.getElementById("money-input") as HTMLInputElement;
    const betData = {
      userId: this.currentUser.source.value.id,
      gameId: this.bets[selectedBet].game.id,
      teamBeOn: this.bets[selectedBet].team,
      amountBet: input.value,
      isSpreadBet: this.bets[selectedBet].type === 'spread'
    }

    this.http.post(apiEndpoint, betData).subscribe({
      next: (response) => {
        console.log('Bet placed successfully:', response);
        alert('Bet placed successfully!');
        this.bets.splice(selectedBet, 1);
        this.userService.updateBalance(Number(input.value));
        this.closeBetSlip.emit();
      },
      error: (error) => {
        console.error('Error placing bet:', error);
        alert('Failed to place bet. Please try again.');
      }
    });
  }
}



export interface Bet {
  team: string;
  type: 'spread' | 'moneyline';
  spread?: number;
  price: number;
  game: Game;
}
import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameService } from './game-service';
import { Game } from './game-model';
import { ChangeDetectorRef } from '@angular/core';
import { SignupComponent } from './signup/signup';
import { BettingSlipComponent, Bet } from './betting-slip/betting-slip';
import { UserService } from './user-service';
import { Observable } from 'rxjs';
import { UserBet } from './user-bet-model';
import { filter, switchMap } from 'rxjs/operators';
import { UserBetsComponent, ExistingUserBet } from './user-bets/user-bets';
import { UserBetService } from './user-bets-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SignupComponent, BettingSlipComponent, UserBetsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('sports-betting-ap-front-end');

  constructor(
    private gameService: GameService,  
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private userBetsService: UserBetService) {
      this.currentUser$ = this.userService.currentUser$;
    }

  games = signal<Game[]>([]);
  bets: Bet[] = [];
  userBets: ExistingUserBet[] = [];

  leagues: string[] = ['NBA', 'NCAAB', 'NHL', 'MLB', 'NFL', 'NCAAF'];
  selectedLeague: string = '';

  displayCards: boolean = false;


  isModalOpen = false;
  startInLoginMode = false;
  currentUser$: Observable<any>;
  ngOnInit() {
    

  }
  handleLogin(user: any) {
    this.userService.setCurrentUser(user);
  }
  logout() {
    this.userService.logout();
  }
  openModal(isLogin: boolean) {
    console.log("Opening modal. Is login?", isLogin);
    this.startInLoginMode = isLogin;
    this.isModalOpen = true;
  }


  isBetSlipOpen = false;
  openBetSlip() {
    this.isBetSlipOpen = true;
  }


  onLeagueClick(league: string) {
    this.selectedLeague = league;
    this.displayCards = true;
    this.gameService.getGames(league).subscribe(data => {
      const now = new Date();
      const filteredAndSortedData = data
        .filter(game => new Date(game.commence_time) > now)
        .sort((a, b) => {
          return new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime();
        });


      this.games.set(filteredAndSortedData);
      this.cdr.detectChanges(); // 👈 force refresh
    });
  }


  addBet(bet: Bet) {
    this.isBetSlipOpen = true;

    // Optional: prevent duplicates
    const exists = this.bets.find(b => 
      b.team === bet.team && 
      b.type === bet.type &&
      b.spread === bet.spread
    );

    if (!exists) {
      this.bets.push(bet);
    }
  }



  isUserBetsModalOpen = false;
  getUserBets() {
    console.log("Attempting to fetch user bets...");
    const userId = this.userService.currentUserValue?.id;
    if (userId) {
      this.userBetsService.getBets(userId).subscribe(bets => {
        this.userBets = bets;
        this.isUserBetsModalOpen = true;
        this.cdr.markForCheck();
        console.log('Fetched user bets:', bets);
      });
      console.log("API call initiated for user bets with user ID:", userId);
    } else {
      console.warn("No user logged in, cannot fetch bets.");
      console.log("Current user value:", this.userService.currentUserValue);
    }
  }

  closeBets() {
    this.isUserBetsModalOpen = false;
  }

}

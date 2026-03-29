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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SignupComponent, BettingSlipComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('sports-betting-ap-front-end');

  constructor(
    private gameService: GameService,  
    private cdr: ChangeDetectorRef,
    private userService: UserService) {
      this.currentUser$ = this.userService.currentUser$;
    }

  games = signal<Game[]>([]);
  bets: Bet[] = [];
  userBets: UserBet[] = [];

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

  getUserBets() {
    this.userService.currentUser$.pipe(
      filter(user => !!user), // Wait until user is not null
      switchMap(user => this.gameService.getUserBets(`http://localhost:8080/bets?userId=${user.id}`))
    ).subscribe(data => {
      this.userBets = data;
    });
    // console.log("called");
    // const apiUrl = 'http://localhost:8080/bets?userId=' + this.userService.currentUserValue().id;
    // this.gameService.getUserBets(apiUrl).subscribe(data => {
    //   this.userBets = data;
    //   console.log('Fetched user bets:', this.userBets);
    // });
  }

}

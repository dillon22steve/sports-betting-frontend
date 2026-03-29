import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  // 1. Start with null. DO NOT call localStorage here.
  private userSource = new BehaviorSubject<any>(null);
  
  // 2. Expose the observable as usual
  currentUser$ = this.userSource.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  // 4. Update balance and save to storage safely
  updateBalance(amountToSubtract: number) {
    console.log('Updating balance by subtracting:', amountToSubtract);
    const currentUser = this.userSource.value;
    if (currentUser) {
      // Create a copy to maintain immutability
      const updatedUser = { 
        ...currentUser, 
        balance: currentUser.balance - amountToSubtract 
      };

      console.log('Updated user object:', updatedUser);
      
      // Update the stream
      this.userSource.next(updatedUser);
      
      // Save to localStorage only in the browser
      if (isPlatformBrowser(this.platformId)) {
        console.log('Saving updated user to localStorage:', updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }
  }

  // 5. Added: A way to set the user (e.g., after login)
  setCurrentUser(user: any) {
    this.userSource.next(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  get currentUserValue() {
    return this.userSource.value;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.userSource.next(null);
  }
}
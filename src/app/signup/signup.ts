import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../user-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
  imports: [FormsModule, CommonModule]
})


export class SignupComponent implements OnChanges {

  @Input() isLoginMode: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() userLoggedIn = new EventEmitter<any>();
  

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isLoginMode']) {
      console.log('Mode changed to:', changes['isLoginMode'].currentValue);
    }
  }

  close() {
    this.closeModal.emit();
  }

  user = {
    username: '',
    email: '',
    password: ''
  };
  
  confirmPassword = '';


  constructor(private http: HttpClient, private userService: UserService) {}


  onSubmit() {
    if (this.isLoginMode) {
      this.onLoginClick(); // Call your login logic
    } else {
      this.onSignupClick(); // Call your signup logic
    }
  }


  onSignupClick() {
    // 1. Final validation gate
    if (this.user.password !== this.confirmPassword) {
      alert("Passwords must match!");
      return;
    }

    if (!this.user.username || !this.user.email) {
      alert("Please fill in all fields.");
      return;
    }

    // 2. Prepare the payload (The 'user' object is already clean)
    const apiUrl = 'http://localhost:8080/users/register';
    
    this.http.post(apiUrl, this.user).subscribe({
      next: (res) => {
        alert('Registration Successful!'),
        this.userService.setCurrentUser(res);
        this.close();
      }, error: (err) => console.error('Error:', err)
    });
  }


  onLoginClick() {
     if (!this.user.email || !this.user.email) {
      alert("Please fill in all fields.");
      return;
    }

    const loginData = {
      email: this.user.email,
      password: this.user.password
    };

    this.http.post('http://localhost:8080/users/login', loginData).subscribe({
      next: (userResponse) => {
        console.log('Login successful!', userResponse);
        alert('Welcome back!');
        // this.userLoggedIn.emit(userResponse);
        this.userService.setCurrentUser(userResponse);
        this.close();
      },
      error: (err) => {
        console.error('Login failed', err);
        alert(err.error || 'Login failed. Please check your credentials.');
      }
    });
  }

}
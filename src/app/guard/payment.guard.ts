
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '@services/user.service';

@Injectable({
  providedIn: 'root'
})

export class PaymentGuard implements CanActivate {

  isLoggedIn!: boolean;
  constructor(private router: Router, private userService: UserService) {}

  canActivate(): boolean {
    this.userService.isUserLoggedIn().subscribe(data => {
      this.isLoggedIn = data;
      if(!this.isLoggedIn) {        
        this.router.navigate(['/admin']);
      }
    });
    return this.isLoggedIn; 
  }
  
};

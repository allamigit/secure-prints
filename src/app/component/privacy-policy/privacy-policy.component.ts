
import { Component } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './privacy-policy.component.html'
})

export class PrivacyPolicyComponent {

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Scroll to top
      }
    });
  }

}

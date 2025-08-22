import { Component } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactUsService } from '@services/contact-us.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './contact-us.component.html'
})

export class ContactUsComponent {

  constructor(private router: Router, private contactUsService: ContactUsService) {
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Scroll to top
      }
    });
  }

}


import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AppointmentPaymentService } from '@services/appointment-payment.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './payment.component.html'
})

export class PaymentComponent {

  constructor(private router: Router, private appointmentPaymentService: AppointmentPaymentService) { }

}


import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InvoiceService } from '@services/invoice.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './invoice.component.html'
})

export class InvoiceComponent {

  constructor(private router: Router, private invoice: InvoiceService) { }

}

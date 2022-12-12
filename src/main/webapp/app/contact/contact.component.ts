import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactService } from './contact.service';
import { ContactRequest } from './type/contact.request';

@Component({
  selector: 'jhi-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

  success = false
  error = false
  errorMessage = ''

  form = new FormGroup({
    subject: new FormControl("", [Validators.required]),
    text: new FormControl("", [Validators.required]),
    contactMail: new FormControl("", [Validators.required])
  })

  constructor(
    private $contactService: ContactService
  ) { }

  sendRequest(): void {
    this.form.markAllAsTouched()
    if (this.form.valid) {
      this.$contactService.sendRequest(this.form.value as ContactRequest).subscribe({
        next: () => {
          this.success = true
          this.error = false
        },
        error: () => {
          this.error = true
          this.errorMessage = 'Anfrage konnte nicht gesendet werden, bitte versuchen Sie es später noch einmal.'
        }
      })
    }
  }

}

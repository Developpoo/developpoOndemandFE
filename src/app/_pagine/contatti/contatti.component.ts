import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contatti',
  templateUrl: './contatti.component.html',
  styleUrls: ['./contatti.component.scss']
})
export class ContattiComponent {
  // SISTEMA INVIO MAIL TEMPORANEO GIUSTO DI PRESENZA

  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      messaggio: ['', Validators.required]
    });
  }

  inviaEmail() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      const oggettoEmail = `Contatto da ${formData.nome}`;

      // Costruisci il corpo dell'email con i dati del modulo
      const corpoEmail = `Nome: ${formData.nome}\nEmail: ${formData.email}\nMessaggio: ${formData.messaggio}`;

      // Crea un link "mailto" con i dati del messaggio
      const linkEmail = `mailto:info@developpo.com?subject=${encodeURIComponent(oggettoEmail)}&body=${encodeURIComponent(corpoEmail)}`;

      // Apri il client email predefinito dell'utente
      window.open(linkEmail, '_blank');

      // Mostra un alert per confermare l'invio email
      alert('Abbiamo precompilato una mail con il tuo software preferito... invia il tuo messaggio a info@developpo.com');
    }
  }
}

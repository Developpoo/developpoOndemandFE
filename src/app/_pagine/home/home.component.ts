import { Component } from '@angular/core';
import { AuthService } from 'src/app/_servizi/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private auth: AuthService) { }

}

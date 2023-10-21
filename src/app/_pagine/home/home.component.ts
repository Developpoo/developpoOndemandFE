import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/_servizi/auth.service';
import { Auth } from 'src/app/_types/Auth.type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  auth: BehaviorSubject<Auth> = this.authService.leggiObsAuth()


  constructor(private authService: AuthService) { }

}

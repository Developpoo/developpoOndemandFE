import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Card } from 'src/app/_types/Card.type';

@Component({
  selector: 'app-bs-card',
  templateUrl: './bs-card.component.html',
  styleUrls: ['./bs-card.component.scss']

})
export class BsCardComponent {

  @Input('opzioni') card!: Card;

  clickButton(id: number): void {
    console.log("VALORE ID " + id)
  }
}

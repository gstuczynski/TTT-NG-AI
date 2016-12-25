import { Component,Input } from '@angular/core';
import { GameField } from './game.field';




@Component({
  selector: 'game-field',
//  template: '{{field.rate}}',
template: '',
  styleUrls: ['./app.component.css']
})
export class GameFieldComponent{
@Input() field: GameField;

gameField:GameField;

}

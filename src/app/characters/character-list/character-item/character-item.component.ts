import { Component, Input } from '@angular/core';
import { Character } from '../../character.model';

@Component({
  selector: 'app-character-item',
  templateUrl: './character-item.component.html',
  styleUrls: ['./character-item.component.scss']
})
export class CharacterItemComponent {
  @Input() character: Character;
  @Input() index: number;

  constructor(){}

  ngOnInit(){}
}

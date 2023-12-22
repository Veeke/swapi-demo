import { Component, OnInit } from '@angular/core';
import { Character } from '../character.model';
import { Params, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.scss']
})
export class CharacterDetailsComponent implements OnInit{
  character: Character;
  id: number;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ){}

  ngOnInit(){
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      if (this.dataService.getCharacter(this.id)){
        this.character = this.dataService.getCharacter(this.id);
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Character } from '../character.model';
import { Params, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/shared/data.service';
import { AlertService } from 'src/app/shared/alert/alert.service';

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
    private alertService: AlertService,
    private route: ActivatedRoute
  ){}

  ngOnInit(){
    this.route.params.subscribe((params: Params) => {
      if (params['id']){
        this.validateIndex(params['id']);
      }
    });
  }

  validateIndex(idParam: string){
    const r = /\d+/;
    const id = idParam.match(r);
    const newId = id ? +id : null;
    const newCharacter = this.dataService.getCharacter(newId);

    if (newCharacter){
      this.id = newId;
      this.character = newCharacter;
    }
    else{
      this.alertService.add('This character id does not exist.');
    }
  }
}

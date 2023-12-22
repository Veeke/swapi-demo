import { NgModule } from "@angular/core";
import { CharactersComponent } from "./characters.component";
import { CharacterItemComponent } from "./character-list/character-item/character-item.component";
import { CharacterDetailsComponent } from "./character-details/character-details.component";
import { CharacterListComponent } from "./character-list/character-list.component";
import { CharacterStartComponent } from "./character-start/character-start.component";
import { CharactersRoutingModule } from "./characters-routing.module";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    CharactersComponent,
    CharacterStartComponent,
    CharacterListComponent,
    CharacterItemComponent,
    CharacterDetailsComponent
  ],
  imports: [
    RouterModule, 
    CharactersRoutingModule,
    SharedModule
  ]
})
export class CharactersModule{}
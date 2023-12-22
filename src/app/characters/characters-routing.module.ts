import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CharactersComponent } from "./characters.component";
import { CharactersResolverService } from "./characters-resolver.service";
import { CharacterStartComponent } from "./character-start/character-start.component";
import { CharacterDetailsComponent } from "./character-details/character-details.component";

const routes: Routes = [
  { 
    path: '', 
    component: CharactersComponent, 
    resolve: [CharactersResolverService],
    children: [
      { path: '', component: CharacterStartComponent },
      { path: ':id', component: CharacterDetailsComponent }
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CharactersRoutingModule{}
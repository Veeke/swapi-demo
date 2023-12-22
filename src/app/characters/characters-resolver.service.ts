import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { DataService } from "../shared/data.service";
import { Character } from "./character.model";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class CharactersResolverService implements Resolve<Character[]>{
  constructor(private dataService: DataService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const characters = this.dataService.getCharacters();
    if (characters.length === 0){
      return this.dataService.fetchCharacters();
    }
    else {
      return characters;
    }
  }
}
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { DataService } from "../shared/data.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class PlanetsResolverService implements Resolve<string[]>{
  constructor(private dataService: DataService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const planets = this.dataService.getPlanets();
    
    if (planets.length === 0){
      return this.dataService.fetchPlanets();
    }
    else{
      return planets;
    }
  }
}
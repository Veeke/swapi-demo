import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-planet-list',
  templateUrl: './planet-list.component.html',
  styleUrls: ['./planet-list.component.scss']
})
export class PlanetListComponent implements OnInit, OnDestroy{

  planets: string[] = [];
  searchInput: string = '';

  isLoading = false;
  error: string = null;

  subscription: Subscription;

  constructor(private dataService: DataService){}

  ngOnInit(){
    this.isLoading = true;
    const newPlanets = this.dataService.getPlanets();

    if (newPlanets.length !== 0){
      this.planets = newPlanets; 
      this.isLoading = false;
    }
    else{
      this.subscription = this.dataService.planetDataLoaded.subscribe((planets: string[]) => {
        this.planets = planets;
        this.isLoading = false;
      },
      error => {
        this.error = 'An error has occured. Error message: ' + error.message;
      });
    }
  }

  onHandleError(){
    this.error = null;
  }

  ngOnDestroy(){
    if (this.subscription){
      this.subscription.unsubscribe();
    }
  }
}

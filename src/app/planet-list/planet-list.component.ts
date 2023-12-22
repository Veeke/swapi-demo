import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { Subscription } from 'rxjs';
import { AlertService } from '../shared/alert/alert.service';

@Component({
  selector: 'app-planet-list',
  templateUrl: './planet-list.component.html',
  styleUrls: ['./planet-list.component.scss']
})
export class PlanetListComponent implements OnInit, OnDestroy{

  planets: string[] = [];
  searchInput: string = '';

  isLoading = false;

  subscription: Subscription;

  constructor(private dataService: DataService, private alertService: AlertService){}

  ngOnInit(){
    this.isLoading = true;
    const newPlanets = this.dataService.getPlanets();

    if (newPlanets.length !== 0){
      this.initializeData(newPlanets);
    }
    else{
      this.subscription = this.dataService.planetDataLoaded.subscribe((planets: string[]) => {
        this.initializeData(planets);
      },
      error => {
        this.alertService.add('An error has occured. Error message: ' + error.message);
      });
    }
  }

  initializeData(planets: string[]){
    const sortedPlanets = planets.sort();
    this.planets = sortedPlanets;
    this.isLoading = false;
  }

  ngOnDestroy(){
    if (this.subscription){
      this.subscription.unsubscribe();
    }
  }
}

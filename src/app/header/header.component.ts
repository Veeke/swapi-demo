import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { AlertService } from '../shared/alert/alert.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  isLoading: boolean = false;
  
  constructor(
    private dataService: DataService, private alertService: AlertService) {}

  ngOnInit(){
    //Disable buttons while page is loading
    this.dataService.characterDataLoaded.subscribe(data => {
      this.isLoading = false;
    });
    this.dataService.planetDataLoaded.subscribe(data => {
      this.isLoading = false;
    })
  }

  onPageLoading(){
    this.isLoading = true;
  }
  
  onClearData(){
    this.dataService.clearData();
    this.alertService.add("Local storage has been cleared.")
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Character } from '../character.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from 'src/app/shared/data.service';
import { AlertService } from 'src/app/shared/alert/alert.service';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit, OnDestroy{

  characters: Character[] = [];

  subscription: Subscription;
  isLoading = false;
  
  itemCount: number;
  itemsPerPage: number = 10;
  startIndex: number = 0;
  endIndex: number;

  currentPage: number = 1;
  pageCount: number;

  constructor(
    private dataService: DataService, 
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit() {
    this.isLoading = true;
    this.endIndex = this.itemsPerPage;
    const newCharacters = this.dataService.getCharacters();
    
    if (newCharacters.length !== 0){
      this.initializeData(newCharacters);
    }
    else{
      this.subscription = this.dataService.characterDataLoaded.subscribe((characters: Character[]) => {
        this.initializeData(characters);
      },
      error => {
        this.alertService.add('An error has occured. Error message: ' + error.message);
      });
    }

    this.route.queryParams.subscribe((params: Params) => {
      if (params['page']){
        this.validatePage(params['page']);
      }
    });
  }

  initializeData(characters: Character[]){
    this.characters = characters;
    this.itemCount = characters.length;
    this.pageCount = Math.ceil(this.itemCount / this.itemsPerPage);
    this.isLoading = false;
  }

  validatePage(pageParam : string){
    const r = /\d+/;
    const pageNumber = +(pageParam.match(r));

    if (pageNumber && this.canChangePage(pageNumber)){
      this.currentPage = pageNumber;
    } else {
      this.currentPage = 1;
      this.onChangePage(1);
      this.alertService.add('The page is invalid.');
    }

    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    if (this.itemCount){ 
      this.endIndex = Math.min(this.currentPage * this.itemsPerPage, this.itemCount);
    }
  }

  onChangePage(page: number){
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: page,
      },
    });
  }

  canChangePage(page: number): boolean{
    return (page > 0 && page <= this.pageCount);
  }

  ngOnDestroy(): void {
    if (this.subscription){
      this.subscription.unsubscribe();
    }
  }
}

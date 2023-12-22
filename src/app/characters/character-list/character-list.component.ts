import { Component, OnDestroy, OnInit } from '@angular/core';
import { Character } from '../character.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit, OnDestroy{

  characters: Character[] = [];

  subscription: Subscription;
  isLoading = false;
  error: string = null;
  
  itemCount: number;
  itemsPerPage: number = 10;
  startIndex: number = 0;
  endIndex: number;

  currentPage: number = 1;
  pageCount: number;

  constructor(
    private dataService: DataService, 
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
        this.error = 'An error has occured. Error message: ' + error.message;
      });
    }

    this.route.queryParams.subscribe((params: Params) => {
      this.currentPage = +params['page'] ? +params['page'] : 1;
      this.startIndex = (this.currentPage - 1) * this.itemsPerPage;

      // To prevent errors:
      if (!this.canChangePage(this.currentPage)){
        this.currentPage = 1;
        this.onChangePage(1);
      }
      if (this.itemCount){ 
        this.endIndex = Math.min(this.currentPage * this.itemsPerPage, this.itemCount);
      }
    });
  }

  initializeData(characters: Character[]){
    this.characters = characters;
    this.itemCount = characters.length;
    this.pageCount = Math.ceil(this.itemCount / this.itemsPerPage);
    this.isLoading = false;
  }

  onChangePage(page: number){
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: (page === 1) ? null : page,
      },
    });
  }

  canChangePage(page: number): boolean{
    return (page > 0 && page <= this.pageCount);
  }

  onHandleError(){
    this.error = null;
  }

  ngOnDestroy(): void {
    if (this.subscription){
      this.subscription.unsubscribe();
    }
  }
}

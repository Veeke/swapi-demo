import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Character } from '../characters/character.model';
import { Film } from '../characters/film.model';
import { Observable, Subject, expand, map, of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataService {

  private characters: Character[] = [];
  private planets: string[] = [];
  private films: Film[] = [];

  private characterKey: string = "characters";
  private planetKey: string = "planets";

  characterDataLoaded = new Subject<Character[]>();
  planetDataLoaded = new Subject<string[]>();

  private rootURL: string = "https://swapi.dev/api/";

  constructor(private http: HttpClient) {}

  // Biggest bottleneck currently (can take 30-40s to fetch all characters).
  // I don't know how much of the delay is due to the API and how much is my code being inefficient.
  // Currently I'm making recursive calls using the data's "next" property to fetch everything at once.
  // You could probably optimize it by only loading pages as needed or making multiple requests at the same time, 
  // but I wasn't sure how to do that without hard coding page/element counts.

  // The steps are as follows:
  // - If the data already exists in local storage, fetch that data. Else, get the data from the API.
  // - Fetch films first, as they are used in formatting the character data.
  // - Character observable keeps making HTTP requests recursively to the next page while there is one, and brings them all together.
  // - Subscribe to the films$ to make sure the data is present, then subscribe to characters$ to format the incoming data according to the Character interface.
  // - Once everything's done, save the data to local storage and signal that the data has been loaded.

  fetchCharacters(): Observable<Character[]>{

    if (localStorage.getItem(this.characterKey) !== null){
      this.characters = this.loadData(this.characterKey);
      return of(this.characters);
    }
   
    const path = "people/"
    var nextPage = this.rootURL + path;
    const films$ = this.fetchFilms();

    const characters$ = this.getResponse(nextPage).pipe(
      expand(response => {
        if (response['next']){
          nextPage = response['next'];
          return this.getResponse(nextPage);
        }
        this.saveData(this.characters, this.characterKey);
        this.characterDataLoaded.next(this.characters);
        return [];
      })
    );

    films$.subscribe(films => {
      this.films = films;
      characters$.subscribe(data => {
        data['results'].map((character: Character) => {
          const films = this.getFilmDetails(character['films']);
          this.characters.push({
            name: character['name'],
            gender: character['gender'],
            birthYear: character['birth_year'],
            filmArray: films
          });
        })
      })
    });
    return of(this.characters);
  }

  fetchFilms(): Observable<Film[]>{
    const path = "films/"
    const url = this.rootURL + path;

    return this.http.get(url).pipe(map(data => {
      return data['results'].map((film: Film) => {
        return {
          title: film['title'], 
          releaseDate: film['release_date']
        };
      })
    }))
  };

  fetchPlanets(): Observable<string[]>{
    if (localStorage.getItem(this.planetKey) !== null){
      this.planets = this.loadData(this.planetKey);
      return of(this.planets);
    }

    const path = "planets/"
    var nextPage = this.rootURL + path;

    const planets$ = this.getResponse(nextPage).pipe(
      expand(response => {
        if (response['next']){
          nextPage = response['next'];
          return this.getResponse(nextPage);
        }
        this.saveData(this.planets, this.planetKey);
        this.planetDataLoaded.next(this.planets);
        return [];
      })  
    );

    planets$.subscribe(data => {
      data['results'].map((planet: string) => {
        this.planets.push(planet['name'])
      });
    })
    return of(this.planets);
  };

  getResponse(url: string): Observable<Character[]>{
    return this.http.get<Character[]>(url);
  }

  saveData(data: any, key: string){
    localStorage.setItem(key, JSON.stringify(data));
  }

  loadData(key: string){
    const data = JSON.parse(localStorage.getItem(key));
    return data; 
  }

  clearData(){
    localStorage.clear();
  }

  getCharacter(id: number){
    return this.characters[id];
  }

  getCharacters(){
    return this.characters.slice();
  }

  setCharacterData(characters: Character[]){
    this.characters = characters;
    this.characterDataLoaded.next(this.characters.slice());
  }

  getPlanet(id: number){
    return this.planets[id];
  }

  getPlanets(){
    return this.planets.slice();
  }

  setPlanetData(planets: string[]){
    this.planets = planets;
    this.planetDataLoaded.next(this.planets.slice());
  }

  //Use a regex to find the first number in the given urls, then return the corresponding films
  getFilmDetails(filmUrls: string[]): Film[] {
    const films = [];
    const r = /\d+/; 
    for (let i = 0; i < filmUrls.length; i++){
      const index = +(filmUrls[i].match(r)); 
      films.push(this.films[index - 1]);
    }
    return films;
  }
}

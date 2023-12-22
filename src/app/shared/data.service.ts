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

  constructor(private http: HttpClient) {}

  fetchCharacters(): Observable<Character[]>{
    if (localStorage.getItem(this.characterKey) !== null){
      this.characters = this.loadData(this.characterKey);
      return of(this.characters);
    }

    const films$ = this.fetchFilms();
    var nextPage = "https://swapi.dev/api/people/"; 

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

    //Make sure films are loaded first, as I need the data for the characters
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
    return this.http.get("https://swapi.dev/api/films/").pipe(map(data => {
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

    var nextPage = "https://swapi.dev/api/planets/"

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

  getFilmDetails(filmUrls: string[]): Film[] {
    const films = [];
    for (let i = 0; i < filmUrls.length; i++){
      const r = /\d+/;
      const index = +(filmUrls[i].match(r));
      films.push(this.films[index - 1]);
    }
    return films;
  }
}

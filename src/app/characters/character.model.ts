import { Film } from "./film.model";

export interface Character {
  name: string;
  gender: string;
  birthYear: string;
  filmArray: Film[];
}
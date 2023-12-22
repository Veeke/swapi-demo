import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";

const appRoutes: Routes = [
  { path: '', redirectTo: '/characters', pathMatch: "full" },
  { path: 'characters', loadChildren: () => import('./characters/characters.module').then(m => m.CharactersModule)},
  { path: 'planets', loadChildren: () => import('./planet-list/planets.module').then(m => m.PlanetsModule)},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule{}
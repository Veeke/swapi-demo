import { NgModule } from "@angular/core";
import { PlanetListComponent } from "./planet-list.component";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { PlanetsResolverService } from "./planets-resolver-service";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [PlanetListComponent],
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '', 
        component: PlanetListComponent,
        resolve: [PlanetsResolverService]
      }
    ])
  ]
})
export class PlanetsModule{}
import { NgModule } from "@angular/core";
import { CapitalizePipe } from "./capitalize.pipe";
import { FilterPipe } from "./filter.pipe";
import { CommonModule } from "@angular/common";
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  declarations:[
    CapitalizePipe,
    FilterPipe,
    LoadingSpinnerComponent,
    AlertComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CapitalizePipe,
    FilterPipe,
    CommonModule,
    LoadingSpinnerComponent,
    AlertComponent
  ]
})
export class SharedModule{}
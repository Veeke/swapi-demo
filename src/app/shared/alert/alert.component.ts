import { Component, Input} from '@angular/core';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  constructor(public alertService: AlertService) {}

  onClose(){
    this.alertService.clear();
  }
}

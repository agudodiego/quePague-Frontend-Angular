import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-success-alert',
  templateUrl: './success-alert.component.html',
  styleUrls: ['./success-alert.component.css']
})
export class SuccessAlertComponent {

  @Input()
  showSuccess: boolean = false;

  @Input()
  successMsg!: string;

}

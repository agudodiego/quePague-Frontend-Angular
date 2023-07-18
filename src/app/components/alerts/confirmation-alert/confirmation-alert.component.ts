import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-alert',
  templateUrl: './confirmation-alert.component.html',
  styleUrls: ['./confirmation-alert.component.css']
})
export class ConfirmationAlertComponent {

  @Input()
  showConfirmationAlert: boolean = false;

  @Output()
  cancelEvent = new EventEmitter<boolean>();

  @Output()
  confirmDeletionEvent = new EventEmitter<boolean>();

  cancel() {
    this.cancelEvent.emit(false);
  }

  confirmDeletion() {
    this.confirmDeletionEvent.emit(true);
  }

}

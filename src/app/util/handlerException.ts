import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function handlerException(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log('Error del front: ' + error.error.message);
    } else {
      console.log('Error del back: ' + error.error.message);      
    }
    return throwError(() => new Error(error.error.message));
  }
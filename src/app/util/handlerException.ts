import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function handlerException(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Error del front: ' + error.error.message);
    } else {
      console.error('Error del back: ' + error.error.message);      
    //   console.error('Error del back: ' + error.status, error.statusText);      
    }
    return throwError(() => new Error('Se produjo un error en la solicitud HTTP'));
  }
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private router: Router) { }

  handleError(error: HttpErrorResponse, redirectUrl?: string){
    switch (error.status){
      case 401 : // 401 - Unauthorized
        localStorage.clear();
        this.router.navigate(['login']);
        break
      case 400: // 401 - Unauthorized
        localStorage.clear();
        this.router.navigate(['login']);
        break
      // case 404: // 404 - Not Found - URL nicht gefunden
      //   this.router.navigate(['login']);
      //   break
      // case 403: // 403 - Forbidden - keine Berechtigungen
      //   if((new RegExp('/shoppinglist/[1-9]*')).test(redirectUrl!)){
      //     this.router.navigate(['list-overview'])
      //   }
      //   break
    }
  }
}
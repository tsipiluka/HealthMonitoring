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
    }
  }
}
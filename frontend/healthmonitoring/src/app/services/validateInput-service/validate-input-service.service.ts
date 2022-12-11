import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateInputService {

  validateEmail(email: string): boolean{
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)
  }

  validatePassword(password: string): boolean{
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*?[^\w\s])(?=.{8,})/.test(password)
  }
}

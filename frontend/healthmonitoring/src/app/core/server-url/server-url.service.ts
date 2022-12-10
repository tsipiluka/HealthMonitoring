import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerUrlService {

  readonly APIUrl = "http://localhost:8000";

  constructor() { }

  getAPIUrl(): string {
    return this.APIUrl;
  }
}

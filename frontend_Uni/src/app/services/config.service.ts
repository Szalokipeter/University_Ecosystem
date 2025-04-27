import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {

  apiUrl = 'http://52.28.154.228:8000/api';

  constructor() {}
}

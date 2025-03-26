import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {

  apiUrl = 'http://3.127.249.5:8000/api';

  constructor() {}
}

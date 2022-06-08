import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../models/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public config: Config;

  constructor(private http: HttpClient) {
  }

  loadConfig() {
    return this.http
      .get<Config>('./assets/config.json')
      .toPromise()
      .then((config: Config) => {
        this.config = config;
      });
  }
}

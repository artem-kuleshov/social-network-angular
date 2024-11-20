import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IProfile } from '../interfaces/profile.interface';
import { API_URL } from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  http = inject(HttpClient)

  constructor() { }

  getTestAccounts() {
    return this.http.get<IProfile[]>(`${API_URL}/account/test_accounts`)
  }

  getMe() {
    return this.http.get<IProfile>(`${API_URL}/account/me`)
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProfileInterface } from '../interfaces/profile.interface';
import { API_URL } from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  http = inject(HttpClient)

  constructor() { }

  getTestAccounts() {
    return this.http.get<ProfileInterface[]>(`${API_URL}/account/test_accounts`)
  }
}

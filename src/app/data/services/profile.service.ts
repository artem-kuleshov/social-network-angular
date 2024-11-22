import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IProfile } from '../interfaces/profile.interface';
import { API_URL } from '../../app.constants';
import { IPageble } from '../interfaces/pageble.interface';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  http = inject(HttpClient)

  user = signal<IProfile | null>(null)

  getTestAccounts() {
    return this.http.get<IProfile[]>(`${API_URL}/account/test_accounts`)
  }

  getMe() {
    return this.http.get<IProfile>(`${API_URL}/account/me`)
      .pipe(
        tap(res => this.user.set(res))
      )
  }

  getAccount(id: number) {
    return this.http.get<IProfile>(`${API_URL}/account/${id}`)
  }

  getSubscribersShortList(subscribersCount: number = 3) {
    return this.http.get<IPageble<IProfile>>(`${API_URL}/account/subscribers/`, {
      params: {
        page: 1
      }
    })
      .pipe(
        map(res => res.items.slice(0, subscribersCount))
      )
  }

  updateProfile(profile: Partial<IProfile>) {
    return this.http.patch<IProfile>(`${API_URL}/account/me`, profile)
  }

  uploadPhoto(file: File) {
    const formData = new FormData()
    formData.append('image', file)

    return this.http.post<IProfile>(`${API_URL}/account/upload_image`, formData)
  }
}

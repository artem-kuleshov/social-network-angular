import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../app.constants';
import { tap } from 'rxjs';
import { ITokenResponse } from './auth.interface';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient)
  cookieService = inject(CookieService)

  token: string | null = null
  refreshToken: string | null = null

  get isAuth() {
    if (!this.token) {
      this.token = this.cookieService.get('token')
    }
    return !!this.token
  }

  login(username: string, password: string) {

    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    return this.http.post<ITokenResponse>(`${API_URL}/auth/token`, formData)
      .pipe(
        tap(response => {
          this.token = response.access_token
          this.refreshToken = response.refresh_token

          this.cookieService.set('token', this.token)
          this.cookieService.set('refreshToken', this.refreshToken)
        })
      )
  }
}

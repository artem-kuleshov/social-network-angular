import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../app.constants';
import { catchError, tap, throwError } from 'rxjs';
import { ITokenResponse } from './auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient)
  cookieService = inject(CookieService)
  router = inject(Router)

  token: string | null = null
  refreshToken: string | null = null

  get isAuth() {
    if (!this.token) {
      this.token = this.cookieService.get('token')
      this.refreshToken = this.cookieService.get('refreshToken')
    }
    return !!this.token
  }

  login(username: string, password: string) {

    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    return this.http.post<ITokenResponse>(`${API_URL}/auth/token`, formData)
      .pipe(
        tap(res => {
          this.saveTokens(res)
        })
      )
  }

  refreshAuthToken() {
    return this.http.post<ITokenResponse>(`${API_URL}/auth/refresh`, {
      refresh_token: this.refreshToken
    })
      .pipe(
        tap(res => {
          this.saveTokens(res)
        }),
        catchError( error => {
          this.logout()
          return throwError(() => new Error(error))
        })
      )
  }

  logout() {
    this.cookieService.delete('token')
    this.cookieService.delete('refreshToken')

    this.token = null
    this.refreshToken = null

    this.router.navigate(['/login'])
  }

  saveTokens(res: ITokenResponse) {
    this.token = res.access_token
    this.refreshToken = res.refresh_token

    this.cookieService.set('token', this.token)
    this.cookieService.set('refreshToken', this.refreshToken)
  }
}

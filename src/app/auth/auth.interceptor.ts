import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { BehaviorSubject, catchError, filter, finalize, switchMap, tap, throwError } from "rxjs";

let isRefreshing$  = new BehaviorSubject<boolean>(false)

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {

    const authService = inject(AuthService)
    const token = authService.token

    // Нет токена или запрос на auth/refresh
    if (!token || req.url.includes('auth/refresh')) {      
        return next(req)
    }

    // Если сейчас идет обновление токена
    if (isRefreshing$.value) {
        return refreshAndProceed(authService, req, next)
    }

    req = addToken(req, token)

    return next(req)
        .pipe(
            catchError(error => {
                // Если ошибка 401, то надо перенаправлят на страницу входа, делать при этом logout у profileService
                if (error.status === 403) { 
                    return refreshAndProceed(authService, req, next)
                }
                return throwError(() => new Error(error))
            })
        )
}

const refreshAndProceed = (authService: AuthService, req: HttpRequest<any>, next: HttpHandlerFn) => {

    if (!isRefreshing$.value) {
        isRefreshing$.next(true)   
        
        return authService.refreshAuthToken()
            .pipe(
                switchMap(res => {      
                    return next(addToken(req, res.access_token))
                }),
                finalize(() => {
                    isRefreshing$.next(false)
                })
            )
    }    

    return isRefreshing$.pipe(
        filter(isRefreshing => !isRefreshing),
        switchMap(res => {
            return next(addToken(req, authService.token!)) 
        })
    )
}

const addToken = (req: HttpRequest<any>, token: string): HttpRequest<any> => {
    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    })
}
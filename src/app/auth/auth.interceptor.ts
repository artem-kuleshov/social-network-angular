import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { catchError, finalize, switchMap, tap, throwError } from "rxjs";

// В этот массив класть запросы, которые необходимо выполнить после обновления access_token,
// Если isRefreshing = true, запросы не должны отправляться пока токен не обновится
let requestsAfterUpdateToken = []

let isRefreshing = false

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    console.log('authTokenInterceptor start')
    console.log(req)

    const authService = inject(AuthService)
    const token = authService.token

    if (!token || isRefreshing) {        
        console.log('isRefreshing. Тут по идее можно просто вызвать next(req)?')
        return next(req)
    }

    // if (isRefreshing) {
    //     console.log('isRefreshing. Тут по идее можно просто вызвать next(req)?')
    //     return refreshAndProceed(authService, req, next)
    // }

    req = addToken(req, token)

    return next(req)
        .pipe(
            catchError(error => {
                console.log(error)
                if (error.status === 403) { 
                    return refreshAndProceed(authService, req, next)
                }
                return throwError(() => new Error(error))
            })
        )
}

const refreshAndProceed = (authService: AuthService, req: HttpRequest<any>, next: HttpHandlerFn) => {
    
    if (!isRefreshing) {
        isRefreshing = true    

        console.log('refreshAndProceed start')
        console.log(isRefreshing)
        
        isRefreshing = true    
        console.log('refreshAuthToken')
        return authService.refreshAuthToken()
        .pipe(
            tap(res => {
                console.log('auth inteceptor refreshAndProceed tap')
            }),
            switchMap(res => {                    
                console.log('refreshAndProceed switchMap')
                console.log(req)
                req = addToken(req, res.access_token)
                return next(req)
            }),
            finalize(() => {
                isRefreshing = false
            })
        )
    }    

    req = addToken(req, authService.token!)
    return next(req) 
}

const addToken = (req: HttpRequest<any>, token: string): HttpRequest<any> => {
    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    })
}
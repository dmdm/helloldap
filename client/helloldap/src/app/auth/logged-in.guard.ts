import {Injectable} from '@angular/core';
import {Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from "rxjs";


@Injectable()
export class LoggedInGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
            const url: string = state.url;
            return this.checkLogin(url);
    }

    checkLogin(url: string) {
        return this.auth.isLoggedIn.map(
            isLoggedIn => {
                if (isLoggedIn) {
                    return true;
                }
                // Store the attempted URL for redirecting
                this.auth.redirectUrl = url;
                // Navigate to the login page with extras
                this.router.navigate(['/login']);
                return false;
            }
        );
    }
}

import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import * as authUser from './actions';
import * as fromRoot from '../reducers';
import {Headers, Http} from "@angular/http";
import {Observable} from "rxjs";
import {handleHttpError} from "../utils";
import {RcService} from "../rc.service";


@Injectable()
export class AuthService {

    private _redirectUrl: string;
    get redirectUrl(): string {
        if (! this._redirectUrl || this._redirectUrl == 'login') {
            return '';
        }
        return this._redirectUrl;
    };
    set redirectUrl(v: string) { this._redirectUrl = v; }

    get isLoggedIn(): Observable<boolean> {
        return this.store.select(fromRoot.getJwt).map(jwt => jwt != null);
    }

    get isAdmin(): Observable<boolean> {
        return this.store.select(fromRoot.getGroups).map(groups => groups === null ? false : groups.indexOf('wheel') > -1);
    }

    constructor(private rc: RcService, private store: Store<fromRoot.State>, private http: Http) {
    }

    login(username: string, password: string): Observable<boolean> {
        const url = this.rc.urls.login + '?ts=' + new Date().getTime();
        const body = {username, password};
        return this.http.post(url, body)
            .map(resp => {
                const data = resp.json().data;
                const jwtTime = new Date();
                this.store.dispatch(new authUser.LoggedInAction(username, password, data.jwt, jwtTime, data.groups));
                return true;
            })
            .catch(handleHttpError);
    }

    logout() {
        this.store.dispatch(new authUser.LoggedOutAction());
    }

    refreshJwt(): Observable<boolean> {
        const url = this.rc.urls.login + '?ts=' + new Date().getTime();
        return this.store.select(fromRoot.getCredentials).take(1).switchMap(cred => {
            return this.http.post(url, cred)
                .map(resp => {
                    const data = resp.json().data;
                    const jwtTime = new Date();
                    this.store.dispatch(new authUser.LoggedInAction(cred.username, cred.password, data.jwt, jwtTime, data.groups));
                    return true;
                })
                .catch(handleHttpError);
        });
    }

    applyHeaders(headers: Headers) {
        this.store.select(fromRoot.getJwt).subscribe(
            jwt => {
                if (jwt) {
                    headers.set('Authorization', `Bearer ${jwt}`);
                }
            }
        );
    }
}

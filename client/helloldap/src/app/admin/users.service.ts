import {Injectable} from '@angular/core';
import {Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {User} from "./models";
import {RcService} from "../rc.service";
import {handleHttpError} from "../utils";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class UsersService {

    constructor(private rc: RcService, private http: Http, private auth:AuthService) {
    }

    listUsers(): Observable<Array<string>> {
        const url = this.rc.urls.listUsers;
        return this.http.get(url)
            .map(resp => {
                return resp.json().data;
            })
            .catch(handleHttpError);
    }

    listGroups(): Observable<Array<string>> {
        const url = this.rc.urls.listGroups;
        return this.http.get(url)
            .map(resp => {
                return resp.json().data;
            })
            .catch(handleHttpError);
    }
}

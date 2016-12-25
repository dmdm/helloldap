import {Injectable} from '@angular/core';
import {RcService} from "../rc.service";
import {Http} from "@angular/http";
import {AuthService} from "../auth/auth.service";
import {Observable} from "rxjs";
import {handleHttpError} from "../utils";


@Injectable()
export class GroupsService {

    constructor(private rc: RcService, private http: Http, private auth: AuthService) {
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

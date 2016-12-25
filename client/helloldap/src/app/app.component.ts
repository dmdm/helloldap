import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {RcService} from "./rc.service";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromRoot from './reducers';
import {AuthService} from "./auth/auth.service";
import {Router} from "@angular/router";


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    username$: Observable<string>;
    jwtTime$: Observable<string>;
    isLoggedIn$: Observable<boolean>;
    appTitle: string;

    constructor(private rc: RcService, private store: Store<fromRoot.State>, private auth:AuthService, private titleService: Title, private router: Router) {
    }

    ngOnInit() {
        this.titleService.setTitle(this.rc.appTitle);
        this.appTitle = this.rc.appTitle;
        this.username$ = this.store.select(fromRoot.getUsername).map(username => username ? username : 'Nobody');
        this.jwtTime$ = this.store.select(fromRoot.getJwtTime).map(time => time ? time.toISOString() : 'None');
        this.isLoggedIn$ = this.auth.isLoggedIn;
    }

    refreshJwt() {
        this.auth.refreshJwt().subscribe(
            resp => console.debug('JWT refreshed'),
            error => console.error('Failed to refresh JWT:', error)
        );
    }

    logout() {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
}

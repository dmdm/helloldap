import {Injectable} from '@angular/core';
import {BaseRequestOptions, RequestOptions} from '@angular/http';
import * as fromRoot from './reducers';
import {Store} from "@ngrx/store";


@Injectable()
export class DefaultRequestOptions extends BaseRequestOptions {

    constructor(private store: Store<fromRoot.State>) {
        super();

        // Set the default 'Content-Type' header
        this.headers.set('Content-Type', 'application/json');
        // Alas, we cannot call AuthService:applyHeaders(), because AuthService injects Http,
        // and Http depends on us: a cyclic dependency.
        this.store.select(fromRoot.getJwt).subscribe(
            jwt => {
                if (jwt) {
                    this.headers.set('Authorization', `Bearer ${jwt}`);
                }
            }
        );
    }
}


export const requestOptionsProvider = {provide: RequestOptions, useClass: DefaultRequestOptions};

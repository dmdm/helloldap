/* tslint:disable:no-unused-variable */

import {TestBed, inject} from '@angular/core/testing';
import {AuthService} from './auth.service';
import {testBedWithStore} from "../testing/presets";
import * as fixt from "../testing/fixtures";
import {MockBackend} from "@angular/http/testing";
import {Response, ResponseOptions} from "@angular/http";
import {Store} from "@ngrx/store";
import * as fromRoot from '../reducers';


describe('AuthService', () => {
    beforeEach(() => {
        const conf: any = Object.assign({}, testBedWithStore);
        conf.providers = [...conf.providers, AuthService];
        TestBed.configureTestingModule(conf);
    });

    it('should exist', inject([AuthService], (service: AuthService) => {
        expect(service).toBeTruthy();
    }));

    it('should login "ernie" and set AuthUser', inject([AuthService, Store, MockBackend], (auth: AuthService, store:Store<fromRoot.State>, mockBackend: MockBackend) => {
        const mockResp = fixt.userErnie;
        mockBackend.connections.subscribe((connection) => {
            connection.mockRespond(new Response(new ResponseOptions({
                body: JSON.stringify({data: mockResp})
            })));
        });
        // login must return true
        auth.login(fixt.userErnie.username, fixt.userErnie.password).subscribe(
            resp => {
                expect(resp).toBe(true);
            }
        );
        // isLoggedIn must be true
        auth.isLoggedIn.subscribe(v => {
            expect(v).toBe(true);
        });
        // check that store has correct state
        store.select(fromRoot.getAuthUserState).subscribe(
            state => {
                expect(state.username).toBe(fixt.userErnie.username);
                expect(state.password).toBe(fixt.userErnie.password);
                expect(state.jwt).toBe(fixt.jwt);
                expect(state.jwtTime).toBeTruthy();
                expect(state.groups).toEqual(fixt.userErnie.groups);
            }
        )
    }));

    it('should logout and clear AuthUser', inject([AuthService, Store], (auth: AuthService, store:Store<fromRoot.State>) => {
        auth.logout();
        // isLoggedIn must be false
        auth.isLoggedIn.subscribe(v => {
            expect(v).toBe(false);
        });
        // check that store has correct state
        store.select(fromRoot.getAuthUserState).subscribe(
            state => {
                expect(state.username).toBe(null);
                expect(state.password).toBe(null);
                expect(state.jwt).toBe(null);
                expect(state.jwtTime).toBe(null);
                expect(state.groups).toBe(null);
            }
        )
    }));
});

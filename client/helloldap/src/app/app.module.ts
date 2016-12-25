import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {LoginComponent} from './auth/login/login.component';
import {StoreModule} from "@ngrx/store";
import {reducer} from "./reducers";
import {RouterStoreModule} from "@ngrx/router-store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {EffectsModule} from "@ngrx/effects";
import {AuthService} from "./auth/auth.service";
import {LoggedInGuard} from "./auth/logged-in.guard";
import {requestOptionsProvider} from "./default-request-options.service";
import {AppRoutingModule} from "./app-routing.module";
import {RcService} from "./rc.service";
import {UsersService} from "./admin/users.service";
import { FooBarComponent } from './components/foo-bar/foo-bar.component';
import { AdminComponent } from './admin/admin/admin.component';
import {GroupsService} from "./admin/groups.service";
import {AdminGuard} from "./auth/admin.guard";
//import {RcService} from "./rc.service";


@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        LoginComponent,
        FooBarComponent,
        AdminComponent
    ],
    imports: [
        NgbModule.forRoot(),
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,

        /**
         * StoreModule.provideStore is imported once in the root module, accepting a reducer
         * function or object map of reducer functions. If passed an object of
         * reducers, combineReducers will be run creating your application
         * meta-reducer. This returns all providers for an @ngrx/store
         * based application.
         */
        StoreModule.provideStore(reducer),

        /**
         * @ngrx/router-store keeps router state up-to-date in the store and uses
         * the store as the single source of truth for the router's state.
         */
        RouterStoreModule.connectRouter(),

        /**
         * Store devtools instrument the store retaining past versions of state
         * and recalculating new states. This enables powerful time-travel
         * debugging.
         *
         * To use the debugger, install the Redux Devtools extension for either
         * Chrome or Firefox
         *
         * See: https://github.com/zalmoxisus/redux-devtools-extension
         */
        StoreDevtoolsModule.instrumentOnlyWithExtension(),

        /**
         * EffectsModule.run() sets up the effects class to be initialized
         * immediately when the application starts.
         *
         * See: https://github.com/ngrx/effects/blob/master/docs/api.md#run
         */
        // EffectsModule.run(BookEffects),
        // EffectsModule.run(CollectionEffects),

    ],
    providers: [
        requestOptionsProvider,
        RcService,
        AuthService,
        LoggedInGuard,
        AdminGuard,
        UsersService,
        GroupsService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

import {StoreModule} from "@ngrx/store";
import {reducer} from "../reducers";
import {Component, NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule, Http, BaseRequestOptions} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {RcService} from "../rc.service";


@Component({
    template: ''
})
export class EmptyLoginComponent {
}


@Component({
    template: ''
})
export class EmptyDashboardComponent {
}


@NgModule({
    declarations: [EmptyLoginComponent, EmptyDashboardComponent],
    exports:      [EmptyLoginComponent, EmptyDashboardComponent]
})
export class ModuleWithEmptyComponents { }


export const testBedWithStore = {
    declarations: [
    ],
    imports: [
        BrowserModule,
        FormsModule,
        StoreModule.provideStore(reducer),
        HttpModule,
        // RouterStoreModule.connectRouter(),
        // EffectsModule.run(BookEffects),
        // EffectsModule.run(CollectionEffects),

    ],
    providers: [
        RcService,
        {
            provide: Http,
            useFactory: (mockBackend, options) => {
                return new Http(mockBackend, options);
            },
            deps: [MockBackend, BaseRequestOptions]
        },
        MockBackend,
        BaseRequestOptions
    ],
    bootstrap: []
};


export const routesToEmptyComponents = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }, {
        path: 'dashboard',
        component: EmptyDashboardComponent,
    }, {
        path: 'login',
        component: EmptyLoginComponent
    }
];

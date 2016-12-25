/* tslint:disable:no-unused-variable */

import {TestBed, async} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {RouterTestingModule} from "@angular/router/testing";
import {testBedWithStore, ModuleWithEmptyComponents, routesToEmptyComponents} from "./testing/presets";


describe('AppComponent', () => {
    beforeEach(() => {
        const routes = Object.assign({}, routesToEmptyComponents);
        const conf:any = Object.assign({}, testBedWithStore);
        conf.declarations = [...conf.declarations, AppComponent];
        conf.imports = [...conf.imports, ModuleWithEmptyComponents, RouterTestingModule.withRoutes(routes)];
        TestBed.configureTestingModule(conf);
        TestBed.compileComponents();
    });

    it('should create the app', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it(`should have as title 'helloLDAP'`, async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('helloLDAP');
    }));

    it('should render title in a h1 tag', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        let compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('helloLDAP');
    }));
});

import {NgModule}              from '@angular/core';
import {RouterModule, Routes}  from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {LoginComponent} from "./auth/login/login.component";
import {LoggedInGuard} from "./auth/logged-in.guard";
import {AdminGuard} from "./auth/admin.guard";
import {AdminComponent} from "./admin/admin/admin.component";


const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }, {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [LoggedInGuard]
    }, {
        path: 'admin',
        component: AdminComponent,
        canActivate: [LoggedInGuard, AdminGuard]
    }, {
        path: 'login',
        component: LoginComponent
    }
];


@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}

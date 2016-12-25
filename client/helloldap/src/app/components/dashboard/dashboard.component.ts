import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {AuthService} from "../../auth/auth.service";


@Component({
    selector: 'dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    isAdmin:boolean;

    constructor(private auth:AuthService) {
    }

    ngOnInit(): void {
        this.auth.isAdmin.subscribe(v => this.isAdmin = v);
    }
}

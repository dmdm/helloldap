import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Observable} from "rxjs";
import {UsersService} from "../users.service";
import {GroupsService} from "../groups.service";

@Component({
    selector: 'admin',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

    users$: Observable<Array<string>>;
    groups$: Observable<Array<string>>;

    constructor(private users:UsersService, private groups:GroupsService) {
    }

    ngOnInit() {
    }

    loadUsers() {
        this.users$ = this.users.listUsers();
    }

    loadGroups() {
        this.groups$ = this.groups.listGroups();
    }

}

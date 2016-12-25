import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';


@Component({
    selector: 'foo-bar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './foo-bar.component.html',
    styleUrls: ['./foo-bar.component.scss']
})
export class FooBarComponent {

    @Input() appTitle:string;
    @Input() username: string;
    @Input() jwtTime: string;
    @Input() isLoggedIn: boolean;

    @Output() onRefreshJwt = new EventEmitter();
    @Output() onLogout = new EventEmitter();

    constructor() {
    }

    refreshJwt() {
        this.onRefreshJwt.emit(true);
    }

    logout() {
        this.onLogout.emit(true);
    }
}

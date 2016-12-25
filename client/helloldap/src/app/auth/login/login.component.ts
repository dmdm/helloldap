import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    model = {
        username: '',
        password: ''
    };

    error: string;

    constructor(private auth: AuthService, private router: Router) {
    }

    ngOnInit() {
    }

    onSubmit() {
        this.auth.login(this.model.username, this.model.password).subscribe(
            res => {
                this.router.navigate([this.auth.redirectUrl]);
            },
            error => this.error = <any>error
        );
    }
}

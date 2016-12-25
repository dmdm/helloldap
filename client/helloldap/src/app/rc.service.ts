import {Injectable} from '@angular/core';


const baseUrl = 'http://localhost:11223/api/v1';


@Injectable()
export class RcService {

    appTitle = 'helloLDAP';

    urls = {
        login: baseUrl + '/login',
        listUsers: baseUrl + '/admin/user',
        getUser: baseUrl + '/admin/user',
        listGroups: baseUrl + '/admin/group',
        getGroup: baseUrl + '/admin/group',
    };

    constructor() {
    }

}

import {State as AuthUserState} from "../auth/reducers";


export const jwt = 'json.web.token';

/**
 * Users to test login with
 */
export const userAdmin: AuthUserState = {
    username: 'admin',
    password: 'admin',
    jwt: jwt,
    jwtTime: null,
    groups: ['users', 'wheel']
};

export const userErnie: AuthUserState = {
    username: 'ernie',
    password: 'ernie',
    jwt: jwt,
    jwtTime: null,
    groups: ['users', 'sesame-street']
};

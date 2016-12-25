import * as authUser from './actions';


export interface State {
    username:string|null;
    password:string|null;
    jwt:string|null;
    jwtTime:Date|null;
    groups: Array<string>|null;
}


const initialState: State = {
    username: null,
    password: null,
    jwt: null,
    jwtTime: null,
    groups: null
};


export function reducer(state = initialState, action: authUser.Actions): State {
    switch (action.type) {

        case authUser.ActionTypes.LOGGED_IN: {
            return Object.assign({}, state, {
                username: action.username,
                password: action.password,
                jwt: action.jwt,
                jwtTime: action.jwtTime,
                groups: action.groups
            });
        }

        case authUser.ActionTypes.LOGGED_OUT: {
            return initialState;
        }

        default: {
            return state;
        }
    }
}

/**
 * Because the data structure is defined within the reducer it is optimal to
 * locate our selector functions at this level. If store is to be thought of
 * as a database, and reducers the tables, selectors can be considered the
 * queries into said database. Remember to keep your selectors small and
 * focused so they can be combined and composed to fit each particular
 * use-case.
 */

export const getCredentials = (state: State) => { return {username: state.username, password: state.password}; };

export const getUsername = (state: State) => state.username;

export const getJwt = (state: State) => state.jwt;

export const getJwtTime = (state: State) => state.jwtTime;

export const getGroups = (state: State) => state.groups;

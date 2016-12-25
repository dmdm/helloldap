import {Action} from '@ngrx/store';
import {type} from '../utils';


/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const ActionTypes = {
    LOGGED_IN: type('[AuthUser] Logged in'),
    LOGGED_OUT: type('[AuthUser] Logged out'),
};


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class LoggedInAction implements Action {
    type = ActionTypes.LOGGED_IN;

    constructor(public username: string, public password: string, public jwt: string,
                public jwtTime: Date, public groups: Array<string>) {
    }
}


export class LoggedOutAction implements Action {
    type = ActionTypes.LOGGED_OUT;

    constructor() {
    }
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
    = LoggedInAction
    | LoggedOutAction;

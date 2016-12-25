import {Response} from "@angular/http";
import {Observable} from "rxjs";


/**
 * This function coerces a string into a string literal type.
 * Using tagged union types in TypeScript 2.0, this enables
 * powerful typechecking of our reducers.
 *
 * Since every action label passes through this function it
 * is a good place to ensure all of our action labels
 * are unique.
 *
 * Source: https://github.com/ngrx/example-app/blob/master/src/app/util.ts
 */

let typeCache: {[label: string]: boolean} = {};
export function type<T>(label: T | ''): T {
    if (typeCache[<string>label]) {
        throw new Error(`Action type "${label}" is not unique"`);
    }

    typeCache[<string>label] = true;

    return <T>label;
}


export function handleHttpError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
        let body;
        try {
            body = error.json() || '';
        }
        catch (e) {
            body = error;
        }
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
        errMsg = error.message ? error.message : error.toString();
    }
    console.error('HTTP Error: ' + errMsg);
    return Observable.throw(errMsg);
}

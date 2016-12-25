export interface User {
    username: string;
    password: string;
    groups: Array<string>;
}

export interface Group {
    name: string;
}

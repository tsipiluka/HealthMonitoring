export interface IUser {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    birth_date: Date
}

export class User implements IUser {
    constructor(
        public id: number,
        public email: string,
        public first_name: string,
        public last_name: string,
        public birth_date: Date
    ) {}
}
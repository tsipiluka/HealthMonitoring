import { User } from "./user.modal";

export interface IDoctor {
    doctor_id: number,
    user: User
}

export class Doctor implements IDoctor {
    constructor(
        public doctor_id: number,
        public user: User
    ) {}
}
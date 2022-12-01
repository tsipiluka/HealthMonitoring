import { User } from "./user.modal";

export interface IPatient {
    patient_id: number,
    user: User
}

export class Patient implements IPatient {
    constructor(
        public patient_id: number,
        public user: User
    ) {}
}
import { User } from "./user.modal";

export interface IPatient {
    id: number,
    first_name: string,
    last_name: string,
    role: string,
    patient_profile: {patient_id : string}
}

export class Patient implements IPatient {
    constructor(
        public id: number,
        public first_name: string,
        public last_name: string,
        public role: string,
        public patient_profile: {patient_id : string}
    ) {}
}
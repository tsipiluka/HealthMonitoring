export interface IDoctor {
    id: number,
    first_name: string,
    last_name: string,
    role: string,
    doctor_profile: {doctor_id : string}
}

export class Doctor implements IDoctor {
    constructor(
        public id: number,
        public first_name: string,
        public last_name: string,
        public role: string,
        public doctor_profile: {doctor_id : string}
    ) {}
}
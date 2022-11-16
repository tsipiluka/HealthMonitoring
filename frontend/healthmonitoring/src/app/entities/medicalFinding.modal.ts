export interface IMedicalFinding {
    uid: string,
    disease: string,
    medicine: string,
    updated_at: Date
    user: number
}

export class MedicalFinding implements IMedicalFinding {
    constructor(
        public uid: string,
        public disease: string,
        public medicine: string,
        public updated_at: Date,
        public user: number
    ) {}
}
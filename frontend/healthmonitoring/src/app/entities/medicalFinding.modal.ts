export interface IMedicalFinding {
    uid: string,
    disease: string,
    medicine: string
    user: number
}

export class MedicalFinding implements IMedicalFinding {
    constructor(
        public uid: string,
        public disease: string,
        public medicine: string,
        public user: number
    ) {}
}
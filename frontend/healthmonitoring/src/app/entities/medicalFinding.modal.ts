import { Doctor } from "./doctor.modal";
import { Patient } from "./patient.modal";

export interface IMedicalFinding {
    uid: string,
    disease: string,
    medicine: string,
    updated_at: Date,
    patient: Patient,
    diagnosed_by: Doctor,
}

export class MedicalFinding implements IMedicalFinding {
    constructor(
        public uid: string,
        public disease: string,
        public medicine: string,
        public updated_at: Date,
        public user: number,
        public patient: Patient,
        public diagnosed_by: Doctor,
    ) {}
}
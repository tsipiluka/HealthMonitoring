import { Doctor } from "./doctor.modal";
import { Patient } from "./patient.modal";

export interface IMedicalFinding {
    uid: string,
    disease: string,
    comment: string,
    updated_at: Date,
    patient: Patient,
    treator: Doctor,
    file: File
}

export class MedicalFinding implements IMedicalFinding {
    constructor(
        public uid: string,
        public disease: string,
        public comment: string,
        public updated_at: Date,
        public patient: Patient,
        public treator: Doctor,
        public file: File
    ) {}
}
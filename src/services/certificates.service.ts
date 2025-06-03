import {FileDto, UserType} from "./profile.service.ts";
import instance from "../api/instance.ts";

export enum CertificateStatus {
    Created = 'Created',
    InProcess = 'InProcess',
    Finished = 'Finished',
}

export enum CertificateType {
    ForPlaceWhereNeeded = 'ForPlaceWhereNeeded',
    PensionForKazakhstan = 'PensionForKazakhstan',
}

export enum CertificateStaffType {
    ForPlaceOfWork = 'ForPlaceOfWork',
    ForExperience = 'ForExperience',
    ForVisa = 'ForVisa',
    ForWorkBookCopy = 'ForWorkBookCopy',
}

export enum CertificateUserType {
    Student = 'Student',
    Employee = 'Employee',
}

export enum CertificateReceiveType {
    Electronic = 'Electronic',
    Paper = 'Paper',
}

export interface EnumDto {
    value: number;
    name: string | null;
    displayName: string | null;
}

export interface CertificateDto {
    id: string;

    status: CertificateStatus;
    statusEnumDto: EnumDto;

    type: CertificateType;
    typeEnumDto: EnumDto;

    staffType: CertificateStaffType;
    staffTypeEnumDto: EnumDto;

    userType: CertificateUserType;
    userTypeEnumDto: EnumDto;

    certificateFile: FileDto;
    signatureFile: FileDto;

    dateOfForming: string | null;

    receiveType: CertificateReceiveType;
    receiveTypeEnumDto: EnumDto;
}

export interface CertificateCreateDto {
    type: CertificateType;
    staffType: CertificateStaffType;
    userType: CertificateUserType;
    educationEntryId: string | null;
    employeePostId: string | null;
    receiveType: CertificateReceiveType;
}

export const CertificateService = {
    getCertificates: (userType: UserType,
                      ownerId: string ) => instance.get<CertificateDto[]>(`/Certificates/userType/${userType}/entity/${ownerId}`),
    createCertificate: (data: CertificateCreateDto) => instance.post(`/Certificates`, data)
};
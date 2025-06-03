import instance from "../api/instance.ts";

export enum Gender {
    Male = 'Male',
    Female = 'Female',
}

export enum FileExtension {
    NotDefined = 'NotDefined',
    Doc = 'Doc',
    Docx = 'Docx',
    Bmp = 'Bmp',
    Gif = 'Gif',
    Jpeg = 'Jpeg',
    Jpg = 'Jpg',
    Png = 'Png',
    Pdf = 'Pdf',
    Rar = 'Rar',
    Xls = 'Xls',
    Xlsx = 'Xlsx',
    Zip = 'Zip',
    Txt = 'Txt',
    Heic = 'Heic',
    Heif = 'Heif',
    Sig = 'Sig'
}

export enum ContactTypes {
    Phone = 'Phone',
    Email = 'Email',
    SocialMedia = 'SocialMedia',
}

export enum UserType {
    Student = 'Student',
    Employee = 'Employee'
}

export enum EmploymentType {
    MainPlace = 'Основное место работы',
    PartTime = 'Неполный рабочий день',
    InnerPartTime = 'Внутренний неполный рабочий день',
    Freelance = 'Фриланс',
}

interface DepartmentDto {
    id: string,
    name: string,
    parentId: string,
    email: string,
}

export interface FileDto {
    id: string;
    name: string | null;
    extension: FileExtension;
    size: number;
}

interface CountryDto {
    id: string;
    name: string | null;
    code: string | null;
}

interface ContactDto {
    value: string | null;
    type: ContactTypes;
}

export interface BaseDictionaryDto {
    id: string;
    name: string | null;
}

export interface EducationEntryDto {
    id: string;
    faculty: BaseDictionaryDto;
    group: BaseDictionaryDto;
    educationStatus: BaseDictionaryDto;
    educationBase: BaseDictionaryDto;
    educationDirection: BaseDictionaryDto;
    educationProfile: BaseDictionaryDto;
    educationQualification: BaseDictionaryDto;
    educationLevel: BaseDictionaryDto;
    educationForm: BaseDictionaryDto;
    educationYears: BaseDictionaryDto;
    creditBooknumber: string;
    course: number;
    admissionYear: number;
}

export interface ExperienceDto {
    id: string;
    years: number;
    months: number;
    type: string;
}

export interface EmployeePostDto {
    id: string;
    rate: number;
    departments: DepartmentDto[];
    postType: BaseDictionaryDto;
    postName: BaseDictionaryDto;
    dateStart: string;
    dateEnd: string;
    employmentType: EmploymentType;
}

export interface ProfileDto {
    id: string;
    email: string | null;
    lastName: string | null;
    firstName: string | null;
    patronymic: string | null;
    birthDate: string;
    gender: Gender;
    avatar: FileDto;
    citizenship: CountryDto;
    address: string | null;
    contacts: ContactDto[] | null;
    userTypes: UserType[] | null;
}

export interface StudentDto {
    id: string;
    educationEntries: EducationEntryDto[];
}

export interface EmployeeDto {
    id: string;
    experience: ExperienceDto[];
    posts: EmployeePostDto[];
}

export const ProfileService = {
    getProfile: () => instance.get<ProfileDto>('/Profile'),
    getStudentInfo: () => instance.get<StudentDto>('/Profile/student'),
    getEmployeeInfo: () => instance.get<EmployeeDto>('/Profile/employee'),
    updateAvatar: (fileId: string) => instance.put('/Profile/avatar',{ fileId} ),
};
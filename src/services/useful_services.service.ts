import instance from "../api/instance.ts";
import {PagedListMetaData} from "./user.service.ts";
import {FileResultDto} from "./file.service.ts";

export enum UsefulServiceCategory {
    ForAll = "ForAll" ,
    Students = "Students" ,
    Employees = "Employees" ,
}

export interface UsefulServiceDto {
    id: string;
    category: UsefulServiceCategory;
    title: string;
    description: string;
    link: string;
    termsOfDisctribution: string;
    logo: FileResultDto | null;
}

export interface UsefulServiceEditCreateDto {
    category: string; //Тут произошла замена с енама на стринг
    title: string;
    description: string;
    link: string;
    termsOfDisctribution: string;
    logoId: string | null;
}

export interface UsefulServiceDtoPagedListWithMetadata {
    results: UsefulServiceDto[];
    metaData: PagedListMetaData;
}

export const UsefulServicesService = {
    getServices: (params : URLSearchParams) =>
        instance.get<UsefulServiceDtoPagedListWithMetadata>('/UsefulServices', {
            params,
        }),
    createService: ( createDto: UsefulServiceEditCreateDto ) => instance.post('/UsefulServices',  createDto ),
    editService: ( id: string, editDto: UsefulServiceEditCreateDto ) => instance.put(`UsefulServices/${id}`,  editDto ),
    deleteService: ( id: string ) => instance.delete(`UsefulServices/${id}` ),
};


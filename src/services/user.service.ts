import instance from "../api/instance.ts";

export interface ProfileShortDtoPagedListWithMetadata {
    results: ProfileShortDto[];
    metaData: PagedListMetaData;
}

export interface ProfileShortDto {
    id: string;
    email: string;
    lastName: string;
    firstName: string;
    patronymic: string;
    birthDate: string;
}

export interface PagedListMetaData {
    pageCount: number;
    totalItemCount: number;
    pageNumber: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    isFirstPage: boolean;
    isLastPage: boolean;
    firstItemOnPage: number;
    lastItemOnPage: number;
}

export const UserService = {
    getUsers: (email: string = "",
               name: string = "",
               filterLastName: string = "",
               page: number = 1,
               pageSize: number = 20) => instance.get<ProfileShortDtoPagedListWithMetadata>('/User/list', {
                   params: { email, name, filterLastName, page, pageSize } } ),
};
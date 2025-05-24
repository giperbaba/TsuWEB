import instance from "../api/instance.ts";
import {FileResultDto} from "./file.service.ts";
import {PagedListMetaData, UserShortDto} from "./user.service.ts";

export enum EventStatus {
    Draft = 'Draft',
    Actual = 'Actual',
    Finished = 'Finished',
    Archive = 'Archive'
}

export enum EventAuditory {
    All = 'All',
    Students = 'Students',
    Employees = 'Employees',
}

export enum EventFormat {
    Online = 'Online',
    Offline = 'Offline',
}

export enum EventType {
    Open = 'Open',
    Close = 'Close'
}

export interface EventShortDto {
    id: string,
    title: string,
    description: string,
    picture: FileResultDto,
    isTimeFromNeeded: boolean,
    dateTimeFrom: string,
    isTimeToNeeded: boolean,
    dateTimeTo: string,
    type: EventType,
    format: EventFormat,
    auditory: EventAuditory,
    status: EventStatus,
}

export interface EventShortDtoPagedListWithMetadata {
    results: EventShortDto[];
    metaData: PagedListMetaData;
}

export interface EventCreateDto {
    title: string;
    description: string;
    digestText: string;
    pictureId: string;
    isTimeFromNeeded: boolean;
    dateTimeFrom: string;
    isTimeToNeeded: boolean;
    dateTimeTo: string;
    link: string;
    addressName: string;
    latitude: number;
    longitude: number;
    isRegistrationRequired: boolean;
    registrationLastDate: string;
    isDigestNeeded: boolean;
    notificationText: string;
    type: EventType;
    format: EventFormat;
    auditory: EventAuditory;
}

export interface EventEditDto extends EventCreateDto {
    id: string;
}

export enum EventParticipantType {
    Inner= 'Inner',
    External = 'External'
}

export interface EventParticipantDto {
    id: string;
    user: UserShortDto;
    email: string;
    name: string;
    phone: string;
    additionalInfo: string,
    participantType: EventParticipantType,
}

export interface EventDto extends EventShortDto {
    link: string;
    addressName: string;
    latitude: number;
    longitude: number;
    isRegistrationRequired: boolean;
    registrationLastDate: string;
    isDigestNeeded: boolean;
    notificationText: string;
    digestText: string;
    author: UserShortDto
    participants:  EventParticipantDto[]
}

export interface EventEditStatusDto {
    id: string;
    newStatus: EventStatus;
}

export const EventService = {

    /* admin endpoints */

    getEvents: (
        status?: string,
        eventType?: string,
        name?: string,
        format?: string,
        eventDate?: string,
        timezoneOffset: number = 420,
        page: number = 1,
        pageSize: number = 20
    ) => instance.get<EventShortDtoPagedListWithMetadata>('/Events', {
        params: {
            status,
            eventType,
            name,
            format,
            eventDate,
            timezoneOffset,
            page,
            pageSize
        }
    }),

    createEvent: (data: EventCreateDto) => instance.post('/Events', data),
    editEvent: (data: EventEditDto) => instance.put('/Events', data),
    deleteEvent: (id: string) => instance.delete('/Events', {
        params: { id }
    }),
    getEventById: (id: string) => instance.get<EventDto>(`/Events/${id}`),
    editEventStatus: (data: EventEditStatusDto) => instance.put('/Events/status', data),
};
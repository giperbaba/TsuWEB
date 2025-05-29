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
    pictureId: string | null;
    isTimeFromNeeded: boolean;
    dateTimeFrom: Date | null;
    isTimeToNeeded: boolean;
    dateTimeTo: Date | null;
    link: string;
    addressName: string;
    latitude: number | null;
    longitude: number | null;
    isRegistrationRequired: boolean;
    registrationLastDate: Date | null;
    isDigestNeeded: boolean;
    notificationText: string;
    type: EventType | undefined;
    format: EventFormat | undefined;
    auditory: EventAuditory | undefined;
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

export interface IsUserParticipant {
    isParticipating: boolean;
}

export interface EventInnerRegisterDto {
    eventId: string;
}

export interface EventExternalRegisterDto extends EventInnerRegisterDto {
    name: string;
    email: string;
    phone: string;
    additionalInfo: string;
}

export const EventService = {
    getEventsPublic: (
        name?: string,
        eventDate?: string,
        timezoneOffset: number = 420,
        page: number = 1,
        pageSize: number = 20
    ) => instance.get<EventShortDtoPagedListWithMetadata>('/Events/public', {
        params: {
            name,
            eventDate,
            timezoneOffset,
            page,
            pageSize
        }
    }),
    getEventsPublicWithAuth: (
        name?: string,
        eventDate?: string,
        timezoneOffset: number = 420,
        page: number = 1,
        pageSize: number = 20
    ) => instance.get<EventShortDtoPagedListWithMetadata>('/Events/public/auth', {
        params: {
            name,
            eventDate,
            timezoneOffset,
            page,
            pageSize
        }
    }),
    getEventByIdPublic: (id: string) => instance.get<EventDto>(`/Events/public/${id}`),
    checkIsUserParticipant: (id: string) => instance.get<IsUserParticipant>(`/Events/is_participant/${id}`), //event id
    registerInner: (data: EventInnerRegisterDto) => instance.post('/Events/register/inner', data),
    registerExternal: (data: EventExternalRegisterDto) => instance.post('/Events/register/external', data),

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
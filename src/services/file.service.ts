import instance from "../api/instance.ts";
import {FileExtension} from "./profile.service.ts";

export interface FileResultDto {
    id: string,
    name: string,
    extension: FileExtension,
    size: number,
}

export const FileService = {
    getAvatar: (id: string) => instance.get(`Files/${id}`, { responseType: "blob" }),
    upload: (formData: FormData) => instance.post<FileResultDto>('/Files', formData)
};
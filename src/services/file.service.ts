import {instance} from "../api/instance.ts";

export const FileService = {
    getAvatar: (id: string) => instance.get(`Files/${id}`)
};
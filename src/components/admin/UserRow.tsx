import {ProfileShortDto} from "../../services/user.service.ts";

export const UserRow = ({user}: { user: ProfileShortDto }) => (
    <tr>
        <td>{user.id}</td>
        <td>{user.email}</td>
        <td>{user.lastName}</td>
        <td>{user.firstName}</td>
        <td>{user.patronymic}</td>
        <td>{user.birthDate}</td>
    </tr>
);
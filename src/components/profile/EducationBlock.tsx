import {useEffect, useState} from "react";
import {EducationEntryDto, ProfileService} from "../../services/profile.service.ts";
import {EducationCard} from "./EducationCard.tsx";

export const EducationBlock=  () => {
    const [entries, setEntries] = useState<EducationEntryDto[]>([]);

    useEffect(() => {
        ProfileService.getStudentInfo().then((response) => {
            setEntries(response.data.educationEntries);
        });
    }, []);

    return (
        <div>
            {entries.map((entry) => (
                <EducationCard key={entry.id} entry={entry} />
            ))}
        </div>
    );
}
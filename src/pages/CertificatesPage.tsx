import styles from "./styles/CertificatesPage.module.css"
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {CertificateTabs} from "../components/profile/CertificateTabs.tsx";
import {useProfile} from "../context/ProfileContext.tsx";
import {EducationEntryDto, EmployeeDto, ProfileService, UserType} from "../services/profile.service.ts";
import {useEffect, useState} from "react";

export const CertificatesPage = () => {
    const {t} = useTranslation('common');
    const { profile } = useProfile();

    const [entries, setEntries] = useState<EducationEntryDto[]>([]);
    const [employee, setEmployee] = useState<EmployeeDto>();

    useEffect(() => {
        if (profile?.userTypes?.includes(UserType.Student)) {
            ProfileService.getStudentInfo().then((response) => {
                setEntries(response.data.educationEntries);
            });
        }
        if (profile?.userTypes?.includes(UserType.Employee)) {
            ProfileService.getEmployeeInfo().then((response) => {
                setEmployee(response.data)
                console.log(response.data);
                console.log(employee)
            })
        }

    }, []);

    return(
        <div className={styles.certificate_page}>
            <h1 className={styles.title}>{t("certificates.certificates")}</h1>

            <div className={styles.breadcrumb}>
                <Link to="/profile" className={styles.breadcrumb_link}>
                    {t("common.main")}
                </Link>
                <span className={styles.breadcrumb_separator}> / </span>
                <Link to="/certificates" className={styles.breadcrumb_active}>
                    {t("certificates.certificates")}
                </Link>
            </div>

            <h2 className={`${styles.title_name}`}>
                {t("certificates.order_certificate")}
            </h2>

            { profile  ?
                <CertificateTabs type={profile.userTypes} educationEntries={entries ? entries : undefined} employee={employee ? employee : undefined} /> : <></> }
        </div>
    )
}
import {useEffect, useState} from "react";
import styles from "./styles/CertificateTabs.module.css";
import {EducationEntryDto, EmployeeDto, FileDto, UserType} from "../../services/profile.service.ts";
import {useTranslation} from "react-i18next";
import {
    CertificateCreateDto,
    CertificateDto,
    CertificateReceiveType,
    CertificateService,
    CertificateStaffType,
    CertificateType,
} from "../../services/certificates.service.ts";
import {useRequest} from "../../hooks/useRequest.ts";
import {useProfile} from "../../context/ProfileContext.tsx";
import {FileService} from "../../services/file.service.ts";
import {StudentCertificateTab} from "./StudentCertificateTab.tsx";
import {EmployeeCertificateTab} from "./EmployeeCertificateTab.tsx";

interface Props {
    type: UserType[];
    educationEntries?: EducationEntryDto[];
    employee?: EmployeeDto;
}

export const CertificateTabs = ({ type, educationEntries = [], employee }: Props) => {
    const { t } = useTranslation("common");
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    const [certificateType, setCertificateType] = useState<CertificateType>();
    const [certificateStaffType, setCertificateStaffType] = useState<CertificateStaffType>();
    const [certificateView, setCertificateView] = useState<CertificateReceiveType>();

    const [certificates, setCertificates] = useState<CertificateDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [certificatesLoading, setCertificatesLoading] = useState(true);

    const { request } = useRequest();
    const { profile } = useProfile();

    const employeePosts = employee?.posts ? employee.posts : [];

    const isStudentOnly = profile?.userTypes?.length === 1 && profile.userTypes[0] === UserType.Student;
    const isEmployeeOnly = profile?.userTypes?.length === 1 && profile.userTypes[0] === UserType.Employee;

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 700);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const [currentUserType, setCurrentUserType] = useState<UserType>(() => {
        if (isStudentOnly) return UserType.Student;
        if (isEmployeeOnly) return UserType.Employee;
        return profile?.userTypes?.includes(UserType.Student) ? UserType.Student : UserType.Employee;
    });

    const isBoth = (profile?.userTypes?.length || 0) > 1;

    const fetchCertificates = async () => {
        setCertificatesLoading(true);
        try {
            let ownerId: string | null = null;
            const effectiveType = isBoth ? currentUserType : type[0];

            if (effectiveType === UserType.Student) {
                if (!educationEntries?.length || !educationEntries[activeTabIndex]?.id) {
                    return;
                }
                ownerId = educationEntries[activeTabIndex].id;
            }
            else if (effectiveType === UserType.Employee) {
                if (!employeePosts.length || !employeePosts[activeTabIndex]?.id) {
                    return;
                }
                ownerId = employeePosts[activeTabIndex]?.id || employeePosts[0]?.id;
            }

            if (ownerId) {
                const data = await CertificateService.getCertificates(effectiveType, ownerId);
                setCertificates(data.data);
            } else {
                setCertificates([]);
            }
        } catch (err) {
            console.error("Failed to fetch certificates:", err);
            setCertificates([]);
        } finally {
            setCertificatesLoading(false);
        }
    };


    useEffect(() => {
        if (profile?.id) {
            fetchCertificates();
        }
    }, [type, activeTabIndex, employee, educationEntries, profile, currentUserType]);

    const handleOrderCertificate = async () => {
        if (currentUserType === UserType.Employee && (!employeePosts.length || !employeePosts[activeTabIndex]?.id)) {
            console.error("No employee post selected");
            return;
        }

        setIsLoading(true);
        try {
            const effectiveType = isBoth ? currentUserType : type[0];

            const data: CertificateCreateDto = {
                type: certificateType ? certificateType : null,
                staffType: certificateStaffType ? certificateStaffType : null,
                userType: effectiveType,
                educationEntryId: effectiveType === UserType.Student
                    ? educationEntries[activeTabIndex]?.id
                    : null,
                employeePostId: effectiveType === UserType.Employee && employeePosts.length > 0
                    ? employeePosts[activeTabIndex].id
                    : null,
                receiveType: certificateView ? certificateView : CertificateReceiveType.Electronic
            };

            await request( CertificateService.createCertificate(data),
                {successMessage: t("certificates.success"),
                errorMessage: t("certificates.error")}
            )

            await fetchCertificates();

        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.certificate_page}>
            {isBoth && (
                <>
                    {isMobile ? (
                        <div className={styles.input_wrapper_full}>
                            <label className={styles.label_choose}>{t("certificates.user_type")}</label>
                            <select
                                className={styles.item_input_choose}
                                value={currentUserType}
                                onChange={(e) => setCurrentUserType(e.target.value as UserType)}
                            >
                                <option value={UserType.Student}>{t("certificates.student")}</option>
                                <option value={UserType.Employee}>{t("certificates.employee")}</option>
                            </select>
                        </div>
                    ) : (
                        <div className={styles.switch_user_type_tabs}>
                            <button
                                className={`${styles.tab} ${currentUserType === UserType.Student ? styles.active : ""}`}
                                onClick={() => setCurrentUserType(UserType.Student)}
                            >
                                {t("certificates.student")}
                            </button>
                            <button
                                className={`${styles.tab} ${currentUserType === UserType.Employee ? styles.active : ""}`}
                                onClick={() => setCurrentUserType(UserType.Employee)}
                            >
                                {t("certificates.employee")}
                            </button>
                        </div>
                    )}
                </>
            )}

            <div className={styles.main_section}>


                {(isStudentOnly || (isBoth && currentUserType === UserType.Student)) && (
                    <StudentCertificateTab
                        educationEntries={educationEntries}
                        certificates={certificates}
                        certificatesLoading={certificatesLoading}
                        activeTabIndex={activeTabIndex}
                        setActiveTabIndex={setActiveTabIndex}
                        handleOrderCertificate={handleOrderCertificate}
                        certificateType={certificateType}
                        setCertificateType={setCertificateType}
                        certificateView={certificateView}
                        setCertificateView={setCertificateView}
                        isLoading={isLoading}
                    />
                )}

                {(isEmployeeOnly || (isBoth && currentUserType === UserType.Employee)) && employee && (
                    <EmployeeCertificateTab
                        employee={employee}
                        certificates={certificates}
                        certificatesLoading={certificatesLoading}
                        activeTabIndex={activeTabIndex}
                        setActiveTabIndex={setActiveTabIndex}
                        handleOrderCertificate={handleOrderCertificate}
                        certificateType={certificateStaffType}
                        setCertificateType={setCertificateStaffType}
                        certificateView={certificateView}
                        setCertificateView={setCertificateView}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
};

export const downloadFile = async (file: FileDto) => {
    if (!file?.id) return;

    try {
        const response = await FileService.getFile(file.id);

        const blob = new Blob([response.data], {type: response.headers['content-type'] || 'text/plain'});
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;

        const ext = file.extension?.toLowerCase() || 'txt';
        const fileName = `${file.name ?? 'file'}.${ext}`;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Ошибка при скачивании файла", error);
    }
};


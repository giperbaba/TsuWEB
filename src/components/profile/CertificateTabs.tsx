import {useEffect, useState} from "react";
import styles from "./styles/CertificateTabs.module.css";
import {EducationEntryDto, EmployeeDto, EmploymentType, FileDto, UserType} from "../../services/profile.service.ts";
import {useTranslation} from "react-i18next";
import {
    CertificateCreateDto,
    CertificateDto,
    CertificateReceiveType,
    CertificateService,
    CertificateStaffType,
    CertificateStatus,
    CertificateType,
    CertificateUserType
} from "../../services/certificates.service.ts";
import {useRequest} from "../../hooks/useRequest.ts";
import {useProfile} from "../../context/ProfileContext.tsx";
import {formatDate, formatTime} from "../admin/EventCard.tsx";
import CertificateSave from "../../assets/icons/CertificateSave.tsx";
import SignatureSave from "../../assets/icons/SignatureSave.tsx";
import {FileService} from "../../services/file.service.ts";

interface Props {
    type: UserType[];
    educationEntries?: EducationEntryDto[];
    employee?: EmployeeDto;
}

export const CertificateTabs = ({ type, educationEntries = [], employee }: Props) => {
    const { t } = useTranslation("common");
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    const [certificateType, setCertificateType] = useState<CertificateType>();
    const [certificateView, setCertificateView] = useState<CertificateReceiveType>();

    const [certificates, setCertificates] = useState<CertificateDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [certificatesLoading, setCertificatesLoading] = useState(true);

    const { request } = useRequest();
    const { profile } = useProfile();

    const employeePosts = employee?.posts ? employee.posts : [];
    //const currentEducationEntry = educationEntries[activeTabIndex];
    //const currentEmployee = employee?.posts[activeTabIndex]

    const isStudentOnly = profile?.userTypes?.length === 1 && profile.userTypes[0] === UserType.Student;
    const isEmployeeOnly = profile?.userTypes?.length === 1 && profile.userTypes[0] === UserType.Employee;
    //const isBoth = (profile?.userTypes?.length || 0) > 1;

    console.log(employeePosts)

    const fetchCertificates = async () => {
        setCertificatesLoading(true);
        try {
            let ownerId: string | null = null;

            if (type.length == 1 && type[0] === UserType.Student) {
                if (!educationEntries?.length) {
                    console.log("Education entries not loaded yet");
                    return;
                }
                ownerId = educationEntries[activeTabIndex]?.id;
            }
            else if (type.length == 1 && type[0] === UserType.Employee) {
                if (!employeePosts.length) {
                    console.log("Employee posts not loaded yet");
                    return;
                }
                ownerId = employeePosts[activeTabIndex]?.id || employeePosts[0]?.id;
                console.log(ownerId)
            }

            console.log("Current ownerId:", ownerId);

            if (ownerId) {
                const data = await CertificateService.getCertificates(type.length == 1?  type[0] : UserType.Student, ownerId); //TODO: внимание тут не должно быть type.length == 1?  type[0] : UserType.Student,
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
        const loadData = async () => {
            if (!profile?.id) return;

            // Для студентов
            if (type.includes(UserType.Student) && educationEntries?.length) {
                await fetchCertificates();
            }
            // Для сотрудников
            else if (type.includes(UserType.Employee) && employeePosts.length) {
                await fetchCertificates();
            }
        };

        loadData();
    }, [type, activeTabIndex, employee, educationEntries, profile]);

    const handleOrderCertificate = async () => {

        setIsLoading(true);

        try {
            const data: CertificateCreateDto = {
                type: certificateType ? certificateType : CertificateType.ForPlaceWhereNeeded,
                staffType: CertificateStaffType.ForPlaceOfWork,
                userType: type.length == 1 && type[0] === UserType.Student ? CertificateUserType.Student : CertificateUserType.Employee,
                educationEntryId: type.length == 1 && type[0] === UserType.Student
                    ? educationEntries[activeTabIndex]?.id
                    : null,
                employeePostId: type.length == 1 && type[0] === UserType.Employee && employeePosts.length > 0
                    ? employeePosts[0].id //TODO: изменить индекс
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
        <div className={styles.main_section}>
            { isStudentOnly &&
                    <>
                        <div className={styles.tabs}>
                            {educationEntries.map((entry, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTabIndex(index)}
                                    className={`${styles.tab} ${activeTabIndex === index ? styles.active : ""}`}
                                >
                                    <p>{entry.faculty.name}</p>
                                    <p>{t("certificates.education_level")}: {entry.educationLevel.name}</p>
                                    <p>{t("certificates.status")}: {entry.educationStatus.name}</p>
                                </button>
                            ))}
                        </div>

                        {educationEntries[activeTabIndex] && (
                            <div className={styles.content}>

                                <div className={styles.section_row}>

                                    <div className={styles.section_item_block}>
                                        <h2 className={styles.section_name_text}>{t("certificates.education_level")}</h2>
                                        <span
                                            className={styles.section_base_text}>{educationEntries[activeTabIndex].educationLevel.name}</span>
                                    </div>

                                    <div className={styles.section_item_block}>
                                        <h2 className={styles.section_name_text}>{t("certificates.status")}</h2>
                                        <span
                                            className={styles.section_base_text}>{educationEntries[activeTabIndex].educationStatus.name}</span>
                                    </div>

                                </div>

                                <div className={styles.section_item_block}>
                                    <div className={styles.section_name_text}>{t("education.faculty")}</div>
                                    <div className={styles.section_base_text}>{educationEntries[activeTabIndex].faculty.name}</div>
                                </div>

                                <div className={styles.section_row}>

                                    <div className={styles.section_item_block}>
                                        <div className={styles.section_name_text}>{t("education.direction")}</div>
                                        <div
                                            className={styles.section_base_text}>{educationEntries[activeTabIndex].educationDirection.name}</div>
                                    </div>

                                    <div className={styles.section_item_block}>
                                        <div className={styles.section_name_text}>{t("education.group")}</div>
                                        <div
                                            className={styles.section_base_text}>{educationEntries[activeTabIndex].creditBooknumber}</div>
                                    </div>
                                </div>


                            </div>
                        )}

                        <div>
                            <p className={styles.order_text}>{t("certificates.order_certificate")}</p>
                            <div className={styles.order_row}>

                                <div className={styles.input_wrapper}>
                                    <label className={styles.label_choose}>{t("certificates.type")}</label>
                                    <select className={styles.item_input_choose} value={certificateType}
                                            onChange={(e) => setCertificateType(e.target.value as CertificateType)}>
                                        <option value={undefined}></option>
                                        <option value={CertificateType.ForPlaceWhereNeeded}>По месту требования</option>
                                        <option value={CertificateType.PensionForKazakhstan}>Для пенсионных выплат граждан Казахстана</option>
                                    </select>
                                </div>

                                <div className={styles.input_wrapper}>
                                    <label className={styles.label_choose}>{t("certificates.view")}</label>
                                    <select className={styles.item_input_choose} value={certificateView}
                                            onChange={(e) => setCertificateView(e.target.value as CertificateReceiveType)}>
                                        <option value={undefined}></option>
                                        <option value={CertificateReceiveType.Paper}>В бумажном виде</option>
                                        <option value={CertificateReceiveType.Electronic}>Электронная</option>
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    className={styles.order_button}
                                    onClick={handleOrderCertificate}
                                >
                                    {t("certificates.order")}
                                </button>

                            </div>
                            {isLoading ? t("common.loading") : ''}
                        </div>

                        {certificatesLoading ? (
                            <p style={{ padding: '16px'}}>{t("common.loading")}</p>
                        ) : (
                            <div className={styles.certificates_container}>

                                {certificates.map((certificate) => (
                                    <div key={certificate.id} className={styles.item_certificate}>
                                        <div className={styles.certificate_main_part}>
                                            <div className={styles.certificate_title}>
                                                Справка
                                                от {certificate.dateOfForming ? `${formatDate(certificate.dateOfForming)} ${formatTime(certificate.dateOfForming)}` : ""}
                                            </div>
                                            <div className={styles.section_name_text}>
                                                {t("certificates.type")}: {certificate.type == CertificateType.ForPlaceWhereNeeded ?
                                                "По месту требования" : "Для  пенсионных выплат граждан Казахстана"}
                                            </div>
                                            <div className={styles.section_name_text}>
                                                {t("certificates.view")}: {certificate.receiveTypeEnumDto?.displayName || certificate.receiveType}
                                            </div>
                                        </div>

                                        <div className={styles.buttons_container}>
                                            {certificate.status == CertificateStatus.Finished && certificate.receiveType == CertificateReceiveType.Electronic ?
                                                <>
                                                    <button
                                                        className={styles.save_signature_button}
                                                        onClick={() => downloadFile(certificate.signatureFile)}>
                                                        <SignatureSave/> {t("certificates.signature")}
                                                    </button>
                                                    <button
                                                        className={styles.save_certificate_button}
                                                        onClick={() => downloadFile(certificate.certificateFile)}>
                                                        <CertificateSave/> {t("certificates.save_certificate")}
                                                    </button>
                                                </> : <></>
                                            }

                                            <p className={`${styles.certificate_status} ${styles[certificate.status.toLowerCase()]}`}>
                                                {certificate.status == CertificateStatus.Finished ? "Готово" : certificate.status == CertificateStatus.InProcess ? "В работе" : "Заказано"}
                                            </p>
                                        </div>


                                    </div>
                                ))}
                            </div>
                        )}
                    </>}
            {isEmployeeOnly &&
                <>
                    <div className={styles.tabs}>
                        {employeePosts.map((employee, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTabIndex(index)}
                                className={`${styles.tab} ${activeTabIndex === index ? styles.active : ""}`}
                            >
                                <p>{employee.postName.name}</p>
                                <p>{employee.employmentType == EmploymentType.MainPlace ? "Основное место работы" :
                                    employee.employmentType == EmploymentType.Freelance ? "Фриланс" :
                                        employee.employmentType == EmploymentType.InnerPartTime ? "Внутренняя неполная занятость" :
                                            "Неполная занятость"}</p>
                            </button>
                        ))}
                    </div>

                    {employeePosts[activeTabIndex] && (
                        <div className={styles.content}>
                            <div className={styles.section_row}>
                                <div className={styles.section_item_block}>
                                    <h2 className={styles.section_name_text}>{t("employee.job_title")}</h2>
                                    <span
                                        className={styles.section_base_text}>{employeePosts[activeTabIndex].employmentType == EmploymentType.MainPlace ? "Основное место работы" :
                                        employeePosts[activeTabIndex].employmentType == EmploymentType.Freelance ? "Фриланс" :
                                            employeePosts[activeTabIndex].employmentType == EmploymentType.InnerPartTime ? "Внутренняя неполная занятость" :
                                                "Неполная занятость"} </span>
                                </div>

                                <div className={styles.section_item_block}>
                                    <h2 className={styles.section_name_text}>{t("employee.rate")}</h2>
                                    <span
                                        className={styles.section_base_text}>{employeePosts[activeTabIndex].rate}</span>
                                </div>
                            </div>

                            <div className={styles.section_item_block}>
                                <div className={styles.section_name_text}>{t('employee.place')}</div>
                                <div className={styles.section_base_text}>{employeePosts[activeTabIndex].departments.map((department) => (
                                    <div>{department.name}</div>))}</div>
                            </div>

                            <div className={styles.section_row}>
                                <div className={styles.section_item_block}>
                                    <div className={styles.section_name_text}>{t('employee.type')}</div>
                                    <div
                                        className={styles.section_base_text}>{employeePosts[activeTabIndex].postType.name}</div>
                                </div>

                                <div className={styles.section_item_block}>
                                    <div className={styles.section_name_text}>{t('employee.view')}</div>
                                    <div className={styles.section_base_text}>
                                        {employeePosts[activeTabIndex].employmentType == EmploymentType.MainPlace ? "Основное место работы" :
                                            employeePosts[activeTabIndex].employmentType == EmploymentType.Freelance ? "Фриланс" :
                                                employeePosts[activeTabIndex].employmentType == EmploymentType.InnerPartTime ? "Внутренняя неполная занятость" :
                                                    "Неполная занятость"}
                                    </div>
                                </div>


                            </div>
                        </div>
                    )}

                    <div>
                        <p className={styles.order_text}>{t("certificates.order_certificate")}</p>
                        <div className={styles.order_row}>

                            <div className={styles.input_wrapper}>
                                <label className={styles.label_choose}>{t("certificates.type")}</label>
                                <select className={styles.item_input_choose} value={certificateType}
                                        onChange={(e) => setCertificateType(e.target.value as CertificateType)}>
                                    <option value={undefined}></option>
                                    <option value={CertificateType.ForPlaceWhereNeeded}>По месту требования</option>
                                    <option value={CertificateType.PensionForKazakhstan}>Для пенсионных выплат граждан
                                        Казахстана
                                    </option>
                                </select>
                            </div>

                            <div className={styles.input_wrapper}>
                                <label className={styles.label_choose}>{t("certificates.view")}</label>
                                <select className={styles.item_input_choose} value={certificateView}
                                        onChange={(e) => setCertificateView(e.target.value as CertificateReceiveType)}>
                                    <option value={undefined}></option>
                                    <option value={CertificateReceiveType.Paper}>В бумажном виде</option>
                                    <option value={CertificateReceiveType.Electronic}>Электронная</option>
                                </select>
                            </div>

                            <button
                                type="button"
                                className={styles.order_button}
                                onClick={handleOrderCertificate}
                            >
                                {t("certificates.order")}
                            </button>

                        </div>
                        {isLoading ? t("common.loading") : ''}
                    </div>

                    {certificatesLoading ? (
                        <p style={{padding: '16px'}}>{t("common.loading")}</p>
                    ) : (
                        <div className={styles.certificates_container}>

                            {certificates.map((certificate) => (
                                <div key={certificate.id} className={styles.item_certificate}>
                                    <div className={styles.certificate_main_part}>
                                        <div className={styles.certificate_title}>
                                            Справка
                                            от {certificate.dateOfForming ? `${formatDate(certificate.dateOfForming)} ${formatTime(certificate.dateOfForming)}` : ""}
                                        </div>
                                        <div className={styles.section_name_text}>
                                            {t("certificates.type")}: {certificate.type == CertificateType.ForPlaceWhereNeeded ?
                                            "По месту требования" : "Для  пенсионных выплат граждан Казахстана"}
                                        </div>
                                        <div className={styles.section_name_text}>
                                            {t("certificates.view")}: {certificate.receiveTypeEnumDto?.displayName || certificate.receiveType}
                                        </div>
                                    </div>

                                    <div className={styles.buttons_container}>
                                        {certificate.status == CertificateStatus.Finished && certificate.receiveType == CertificateReceiveType.Electronic ?
                                            <>
                                                <button
                                                    className={styles.save_signature_button}
                                                    onClick={() => downloadFile(certificate.signatureFile)}>
                                                    <SignatureSave/> {t("certificates.signature")}
                                                </button>
                                                <button
                                                    className={styles.save_certificate_button}
                                                    onClick={() => downloadFile(certificate.certificateFile)}>
                                                    <CertificateSave/> {t("certificates.save_certificate")}
                                                </button>
                                            </> : <></>
                                        }

                                        <p className={`${styles.certificate_status} ${styles[certificate.status.toLowerCase()]}`}>
                                            {certificate.status == CertificateStatus.Finished ? "Готово" : certificate.status == CertificateStatus.InProcess ? "В работе" : "Заказано"}
                                        </p>
                                    </div>


                                </div>
                            ))}
                        </div>
                    )}

                </>}


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


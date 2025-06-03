import {
    CertificateDto,
    CertificateReceiveType,
    CertificateStaffType,
    CertificateStatus
} from "../../services/certificates.service.ts";
import {useTranslation} from "react-i18next";
import styles from "./styles/CertificateTabs.module.css";
import {EmployeeDto, EmploymentType} from "../../services/profile.service.ts";
import {formatDate, formatTime} from "../admin/EventCard.tsx";
import SignatureSave from "../../assets/icons/SignatureSave.tsx";
import CertificateSave from "../../assets/icons/CertificateSave.tsx";
import {downloadFile} from "./CertificateTabs.tsx";


interface EmployeeTabProps {
    employee: EmployeeDto;
    certificates: CertificateDto[];
    certificatesLoading: boolean;
    activeTabIndex: number;
    setActiveTabIndex: (index: number) => void;
    handleOrderCertificate: () => void;
    certificateType?: CertificateStaffType;
    setCertificateType: (type: CertificateStaffType) => void;
    certificateView?: CertificateReceiveType;
    setCertificateView: (view: CertificateReceiveType) => void;
    isLoading: boolean;
}

export const EmployeeCertificateTab = ({
                                           employee,
                                           certificates,
                                           certificatesLoading,
                                           activeTabIndex,
                                           setActiveTabIndex,
                                           handleOrderCertificate,
                                           certificateType,
                                           setCertificateType,
                                           certificateView,
                                           setCertificateView,
                                           isLoading,
                                       }: EmployeeTabProps) => {
    const { t } = useTranslation("common");
    const employeePosts = employee?.posts || [];

    return (
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
                                onChange={(e) => setCertificateType(e.target.value as CertificateStaffType)}>
                            <option value={undefined}></option>
                            <option value={CertificateStaffType.ForPlaceOfWork}>Для места работы</option>
                            <option value={CertificateStaffType.ForVisa}>Для визы</option>
                            <option value={CertificateStaffType.ForExperience}>Для опыта</option>
                            <option value={CertificateStaffType.ForWorkBookCopy}>Для копии трудовой книжки</option>
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
                                    {t("certificates.type")}: {certificate.staffType == CertificateStaffType.ForExperience ?
                                    "Для опыта" : certificate.staffType == CertificateStaffType.ForVisa ? "Для визы" :
                                        certificate.staffType == CertificateStaffType.ForWorkBookCopy ? "Для копии трудовой книжки" :
                                "Для места работы"}
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

        </>
    );
};
import {EducationEntryDto} from "../../services/profile.service.ts";
import {
    CertificateDto,
    CertificateReceiveType,
    CertificateStatus,
    CertificateType
} from "../../services/certificates.service.ts";
import {useTranslation} from "react-i18next";
import styles from "./styles/CertificateTabs.module.css";
import {formatDate, formatTime} from "../admin/EventCard.tsx";
import SignatureSave from "../../assets/icons/SignatureSave.tsx";
import CertificateSave from "../../assets/icons/CertificateSave.tsx";
import {downloadFile} from "./CertificateTabs.tsx";

interface StudentTabProps {
    educationEntries: EducationEntryDto[];
    certificates: CertificateDto[];
    certificatesLoading: boolean;
    activeTabIndex: number;
    setActiveTabIndex: (index: number) => void;
    handleOrderCertificate: () => void;
    certificateType?: CertificateType;
    setCertificateType: (type: CertificateType) => void;
    certificateView?: CertificateReceiveType;
    setCertificateView: (view: CertificateReceiveType) => void;
    isLoading: boolean;
}

export const StudentCertificateTab = ({
                                          educationEntries,
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
                                      }: StudentTabProps) => {
    const { t } = useTranslation("common");

    return (
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
        </>
    );
};
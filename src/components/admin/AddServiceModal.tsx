import styles from './styles/AddServiceModal.module.css';
import CloseModal from "../../assets/icons/CloseModal.tsx";
import {useTranslation} from "react-i18next";
import {ItemInput} from "../common/ui/input/ItemInput.tsx";
import {useEffect, useState} from "react";
import {
    UsefulServiceCategory, UsefulServiceDto,
    UsefulServiceEditCreateDto,
    UsefulServicesService
} from "../../services/useful_services.service.ts";
import {useRequest} from "../../hooks/useRequest.ts";
import ImageUpload from "./ImageUpload.tsx";
import {useNotification} from "../../context/NotificationContext.tsx";

export const AddServiceModal = ({ isOpen, onClose, onSuccess, serviceToEdit}: { isOpen: boolean, onClose: () => void, onSuccess: () => void, serviceToEdit?: UsefulServiceDto | null;}) => {
    const { t } = useTranslation('common');
    const { request } = useRequest();
    const { notify } = useNotification();

    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [category, setCategory] = useState("ForAll");
    const [description, setDescription] = useState("");
    const [termsOfDisctribution, setTermsOfDisctribution] = useState("");
    const [logoId, setLogoId] = useState<string | null>(null);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (title.length <= 0) {
            notify('warning', t("services.title_validation"));
            return;
        }

        const dto: UsefulServiceEditCreateDto = {
            category,
            title,
            description,
            link,
            termsOfDisctribution,
            logoId,
        };

        const requestFn = serviceToEdit
            ? UsefulServicesService.editService(serviceToEdit.id, dto)
            : UsefulServicesService.createService(dto);

        await request(
            requestFn,
            {
                successMessage: t("services.success"),
                onSuccess: () => {
                    onClose();
                    onSuccess();
                }
            }
        );
    };


    useEffect(() => {
        if (serviceToEdit) {
            setTitle(serviceToEdit.title);
            setLink(serviceToEdit.link || "");
            setCategory(serviceToEdit.category);
            setDescription(serviceToEdit.description || "");
            setTermsOfDisctribution(serviceToEdit.termsOfDisctribution || "");
            setLogoId(serviceToEdit.logo?.id|| null);
        } else {
            setTitle("");
            setLink("");
            setCategory("ForAll");
            setDescription("");
            setTermsOfDisctribution("");
            setLogoId(null);
        }
    }, [serviceToEdit, isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.modal_overlay}>
            <div className={styles.modal}>
                <CloseModal onClick={onClose} className={styles.close_button}/>

                <p className={styles.modal_title}>{t("services.adding")}</p>

                <form onSubmit={handleSubmit} className={styles.modal_form}>
                    <ItemInput
                        label={t("services.name")}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <ItemInput
                        label={t("services.link")}
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />

                    <div className={styles.input_wrapper}>
                        <label className={styles.label_choose}>{t("services.type")}</label>
                        <select className={styles.item_input_choose} value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value={UsefulServiceCategory.ForAll}>Общий</option>
                            <option value={UsefulServiceCategory.Students}>Для студентов</option>
                            <option value={UsefulServiceCategory.Employees}>Для сотрудников</option>
                        </select>
                    </div>

                    <ItemInput
                        label={t("services.description")}
                        type="textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <ItemInput
                        label={t("services.condition")}
                        type="textarea"
                        value={termsOfDisctribution}
                        onChange={(e) => setTermsOfDisctribution(e.target.value)}
                    />
                    <ImageUpload onUpload={setLogoId} />

                    <div className={styles.buttons_container}>
                        <button className={styles.button_primary} type="submit">{t("common.save")}</button>
                        <button className={styles.button_outlined} type="submit">{t("common.cancel")}</button>
                    </div>

                </form>
            </div>
        </div>
    );
};

//TODO: В редактировании сразу должна быть картинка уже быть вставлена + select категорий можно выбирать несколько
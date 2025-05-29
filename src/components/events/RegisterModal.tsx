import {useState} from "react";
import {ItemInput} from "../common/ui/input/ItemInput.tsx";
import {useTranslation} from "react-i18next";
import styles from "../admin/styles/AddServiceModal.module.css";
import CloseModal from "../../assets/icons/CloseModal.tsx";
import {EventExternalRegisterDto, EventService} from "../../services/event.service.ts";
import {useRequest} from "../../hooks/useRequest.ts";
import {useNotification} from "../../context/NotificationContext.tsx";

export const RegisterModal = ({ isOpen, onClose, onSuccess, eventId}: {isOpen: boolean, onClose: () => void, onSuccess: () => void, eventId: string}) => {
    const { t } = useTranslation('common');
    const { request } = useRequest();
    const { notify } = useNotification();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [addInfo, setAddInfo] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (name.length <= 0) {
            notify('warning', t("services.title_validation"));
            return;
        }


        const dto:  EventExternalRegisterDto = {
            eventId: eventId,
            name: name,
            phone: phone,
            email: email,
            additionalInfo: addInfo
        };

        await request(
            EventService.registerExternal(dto),
            {
                successMessage: t("events.success_register"),
                errorMessage: t("events.failed_register"),
                onSuccess: () => {
                    onClose();
                    onSuccess();
                    setName('')
                    setPhone('')
                    setEmail('')
                    setAddInfo('')
                }
            }
        );
    };

    return(
        <div className={styles.modal_overlay}>
            <div className={styles.modal}>
                <CloseModal onClick={onClose} className={styles.close_button}/>

                <p className={styles.modal_title}>{t("events.register_modal_title")}</p>

                <form onSubmit={handleSubmit} className={styles.modal_form}>
                    <ItemInput label={t("events.FIO")} value={name} onChange={(e) => setName(e.target.value)} type="text"/>
                    <ItemInput label={t("profile.phone")} value={phone} onChange={(e) => setPhone(e.target.value)}
                               type="phone"/>
                    <ItemInput label={t("profile.email")} value={email} onChange={(e) => setEmail(e.target.value)} type="text"/>
                    <ItemInput label={t("profile.add_info")} value={addInfo} onChange={(e) => setAddInfo(e.target.value)} type="textarea"/>

                    <div className={styles.buttons_container}>
                        <button className={styles.button_primary} type="submit">{t("common.save")}</button>
                        <button className={styles.button_outlined} onClick={onClose}>{t("common.cancel")}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
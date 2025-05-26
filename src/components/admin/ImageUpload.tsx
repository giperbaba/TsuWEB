import {useEffect, useState} from "react";
import styles from "./styles/ImageUpload.module.css";
import Picture from "../../assets/icons/Picture.tsx";
import {FileResultDto, FileService} from "../../services/file.service";
import SvgImageUpload from "../../assets/icons/ImageUpload.tsx";
import {useTranslation} from "react-i18next";
import CloseCircle from "../../assets/icons/CloseCircle.tsx";

interface Props {
    onUpload: (id: string | null) => void;
    initialImageUrl?: string | null;
    initialFileName?: string | null;
}

export default function ImageUpload({ onUpload, initialFileName }: Props) {
    const [fileName, setFileName] = useState<string | null>(initialFileName || null);
    const { t } = useTranslation('common');

    useEffect(() => {if (initialFileName) setFileName(initialFileName)}, [initialFileName]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await FileService.upload(formData);
            const data: FileResultDto = response.data;

            console.log(data);

            setFileName(file.name);
            onUpload(data.id);
        } catch (err) {
            console.error("Ошибка загрузки файла", err);
        }
    };

    const removeImage = () => {
        setFileName(null);
        onUpload(null);
    };

    return (
        <div className={styles.input_wrapper}>
            <label className={styles.label_choose}>Изображение</label>

            {!fileName ? (
                <label className={styles.upload_box}>
                    <input
                        type="file"
                        className={styles.item_input_choose}
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    <span className={styles.upload_prompt}>
                        <SvgImageUpload />
                        {t("services.image")}
                    </span>
                </label>
            ) : (
                <div className={styles.uploaded_box}>
                    <Picture />
                    <span>{fileName}</span>
                    <CloseCircle onClick={removeImage}></CloseCircle>
                </div>
            )}
        </div>
    );
}

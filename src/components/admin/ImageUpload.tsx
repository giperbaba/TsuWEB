import { useState } from "react";
import styles from "./styles/ImageUpload.module.css";
import Picture from "../../assets/icons/Picture.tsx";
import {FileResultDto, FileService} from "../../services/file.service";
import SvgImageUpload from "../../assets/icons/ImageUpload.tsx";
import {useTranslation} from "react-i18next";

interface Props {
    onUpload: (id: string) => void;
}

export default function ImageUpload({ onUpload }: Props) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const { t } = useTranslation('common');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await FileService.upload(formData);
            const data: FileResultDto = response.data;
            console.log(data);

            setImageFile(file);
            onUpload(data.id);
        }
        catch (err) {
            console.error("Ошибка загрузки файла", err);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        onUpload("");
    };

    return (
        <div className={styles.input_wrapper}>
            <label className={styles.label_choose}>Изображение</label>

            {!imageFile ? (
                <label className={styles.upload_box}>
                    <input
                        type="file"
                        className={styles.item_input_choose}
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    <span className={styles.upload_prompt}>
            <SvgImageUpload></SvgImageUpload>
                        {t("services.image")}
          </span>
                </label>
            ) : (
                <div className={styles.uploaded_box}>
                    <Picture />
                    <span>{imageFile.name}</span>
                    <button className={styles.remove_btn} onClick={removeImage}>
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
}

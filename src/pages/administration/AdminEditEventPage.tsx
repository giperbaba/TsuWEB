import {useTranslation} from "react-i18next";
import {useRequest} from "../../hooks/useRequest.ts";
import styles from "./styles/AdminAddEventPage.module.css";
import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {
    EventAuditory,
    EventEditDto,
    EventFormat,
    EventService,
    EventType
} from "../../services/event.service.ts";
import {useNotification} from "../../context/NotificationContext.tsx";
import {ItemInput} from "../../components/common/ui/input/ItemInput.tsx";
import ItemEditor from "../../components/admin/ItemEditor.tsx";
import {DateTimePicker} from "../../components/admin/DateTimePicker.tsx";
import {ItemSwitch} from "../../components/common/ui/switch/ItemSwitch.tsx";
import ImageUpload from "../../components/admin/ImageUpload.tsx";
import {fetchFileById} from "./AdminItemUserPage.tsx";
import {AddressInput} from "../../components/admin/AddressInput.tsx";

export const AdminEditEventPage = () => {
    const { t } = useTranslation('common');
    const { request } = useRequest();
    const navigate = useNavigate();
    const { notify } = useNotification();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [register, setRegister] = useState(false);
    const [address, setAddress] = useState('');

    const [type, setType] = useState<EventType | undefined>();
    const [format, setFormat] = useState<EventFormat | undefined>();
    const [audience, setAudience] = useState<EventAuditory | undefined>();

    const [longitude, setLng] = useState<number>();
    const [latitude, setLatitude] = useState<number>();

    const [link, setLink] = useState('');
    const [notificationText, setNotificationText] = useState('');
    const [isDigest, setIsDigest] = useState(false);
    const [digest, setDigest] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [withStartTime, setWithStartTime] = useState(true);
    const [withEndTime, setWithEndTime] = useState(false);
    const [endDateRegister, setEndDateRegister] = useState<Date | null>(null);

    const [logoId, setLogoId] = useState<string | null>(null);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [logoName, setLogoName] = useState<string | null>(null);
    const [havePhoto, setHavePhoto] = useState<boolean>(false);

    const handlePhoto = (id: string | null) => {
        setLogoId(id);
        setHavePhoto(!!id);
    };

    const handleAddressChange = (selected: any) => {
        setAddress(selected.value);

        if (selected?.data?.geo_lat && selected?.data?.geo_lon) {
            setLatitude(selected.data.geo_lat);
            setLng(selected.data.geo_lon);
        } else {
            setLatitude(undefined);
            setLng(undefined);
        }

        if (!selected || selected === '') {
            setLatitude(undefined);
            setLng(undefined);
        }
    };

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const data = await request(EventService.getEventById(id));

                console.log(data)

                if (data) {
                    setName(data.data.title);
                    setDescription(data.data.description);
                    setDigest(data.data.digestText ?? '');
                    setLogoId(data.data.picture?.id ?? null);
                    setHavePhoto(!!data.data.picture);
                    setWithStartTime(data.data.isTimeFromNeeded);
                    setStartDate(data.data.dateTimeFrom ? new Date(data.data.dateTimeFrom) : null);
                    setWithEndTime(data.data.isTimeToNeeded);
                    setEndDate(data.data.dateTimeTo ? new Date(data.data.dateTimeTo) : null);
                    setLink(data.data.link ?? '');
                    setAddress(data.data.addressName ?? '');
                    setLatitude(data.data.latitude ?? undefined);
                    setLng(data.data.longitude ?? undefined);
                    setRegister(data.data.isRegistrationRequired);
                    setEndDateRegister(data.data.registrationLastDate ? new Date(data.data.registrationLastDate) : null);
                    setIsDigest(data.data.isDigestNeeded);
                    setNotificationText(data.data.notificationText ?? '');
                    setType(data.data.type);
                    setFormat(data.data.format);
                    setAudience(data.data.auditory);

                    const loadImage = async () => {
                        if (data.data.picture.id) {
                            try {
                                const url = await fetchFileById(data.data.picture.id);
                                setLogoUrl(url);
                                setLogoName(data.data.picture.name);
                                setHavePhoto(true);
                            } catch (err) {
                                console.error("Ошибка при получении логотипа события", err);
                            }
                        }
                    };

                    try {
                        loadImage();
                    }
                    catch (error) {
                        setLogoUrl(null)
                    }
                }
            }
            catch (err) {
                console.error("Ошибка загрузки данных события", err);
            } finally {
                setLoading(false);
            }

        })();


    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            notify("warning", t("services.title_validation"));
            return;
        }

        if (!startDate) {
            notify("warning", t("events.required_date"))
            return;
        }

        if ( (format == EventFormat.Online && !link)) {
            notify("warning", t("events.required_link"));
            return;
        }

        if (format == EventFormat.Offline && (address == "") && (!latitude) && (!longitude)) {
            notify("warning", t("events.required_address"))
            return;
        }

        if (startDate && endDate && (startDate > endDate)) {
            notify("warning", t("events.uncorrected_date"))
            return;
        }

        if (startDate && endDateRegister && (endDateRegister > startDate)) {
            notify("warning", t("events.uncorrected_register_date"))
            return;
        }

        if (longitude && (address == "") || latitude && (address == "")) {
            notify("warning", t("events.required_address"))
            return;
        }

        const finalLogo = havePhoto ? logoId : null;

        const dto: EventEditDto = {
            id: id!,
            title: name,
            description,
            digestText: digest,
            pictureId: finalLogo,
            isTimeFromNeeded: withStartTime,
            dateTimeFrom: startDate,
            isTimeToNeeded: withEndTime,
            dateTimeTo: endDate,
            link: format == EventFormat.Online ? link : '',
            addressName: format == EventFormat.Offline ? address : '',
            latitude: format == EventFormat.Offline ? latitude ?? null : null,
            longitude: format == EventFormat.Offline ? longitude ?? null : null,
            isRegistrationRequired: register,
            registrationLastDate: endDateRegister
                ? endDateRegister
                : null,
            isDigestNeeded: isDigest,
            notificationText,
            type,
            format,
            auditory: audience
        };

        await request(
            EventService.editEvent(dto),
            {
                successMessage: t("events.success"),
                onSuccess: () => navigate("/admin/events")
            }
        );
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className={styles.admin_events_page}>
            <h1 className={styles.title}>{t("administration.administration")}</h1>
            <div className={styles.breadcrumb}>
                <Link to="/profile" className={styles.breadcrumb_link}>
                    {t("common.main")}
                </Link>
                <span className={styles.breadcrumb_separator}> / </span>
                <Link to="/admin" className={styles.breadcrumb_link}>
                    {t("administration.administration")}
                </Link>
                <span className={styles.breadcrumb_separator}> / </span>
                <Link to="/admin/events" className={styles.breadcrumb_link}>
                    {t("administration.events")}
                </Link>
                <span className={styles.breadcrumb_separator}> / </span>
                <Link to="/admin/events/editing" className={styles.breadcrumb_active}>
                    {t("events.edit_event")}
                </Link>
            </div>

            <h2 className={`${styles.title_name}`}>
                {t("events.edit_event")}
            </h2>

            <div className={styles.section}>
                <ItemInput label={t("events.name")} value={name}
                           onChange={(e) => setName(e.target.value)}></ItemInput>

                <p className={styles.base_text_for_adding}>{t("events.describe")}</p>
                <ItemEditor value={description} onChange={setDescription}/>

                <div className={styles.row_container}>
                    <DateTimePicker
                        label={t("events.start_time")}
                        date={startDate}
                        onDateChange={setStartDate}
                        withTime={withStartTime}
                        onToggleTime={() => setWithStartTime(!withStartTime)}
                        required={true}
                    />
                    <DateTimePicker
                        label={t("events.end_time")}
                        date={endDate}
                        onDateChange={setEndDate}
                        withTime={withEndTime}
                        onToggleTime={() => setWithEndTime(!withEndTime)}
                    />
                </div>

                <div className={styles.row_container}>
                    <div className={styles.input_wrapper}>
                        <label className={styles.label_choose}>{t("events.type")}</label>
                        <select className={styles.item_input_choose} value={type ?? ''}
                                onChange={(e) => setType(e.target.value ? EventType[e.target.value as keyof typeof EventType] : undefined)}>
                            <option value={undefined}></option>
                            <option value={EventType.Open}>Открытое</option>
                            <option value={EventType.Close}>Закрытое</option>
                        </select>
                    </div>

                    <div className={styles.input_wrapper}>
                        <label className={styles.label_choose}>{t("events.audience")}</label>
                        <select className={styles.item_input_choose} value={audience ?? ''}
                                onChange={(e) => setAudience(e.target.value ? EventAuditory[e.target.value as keyof typeof EventAuditory] : undefined)}>
                            <option value={undefined}></option>
                            <option value={EventAuditory.All}>Все</option>
                            <option value={EventAuditory.Students}>Студенты</option>
                            <option value={EventAuditory.Employees}>Преподаватели</option>
                        </select>
                    </div>
                </div>

                <div className={styles.near_container}>
                    <p className={styles.base_text_for_adding}>{t("events.register")}</p>
                    <ItemSwitch checked={register} onChange={() => setRegister(!register)}/>
                </div>

                {register ? <div className={styles.input_wrapper_full}>
                    <label className={styles.label_choose}>{t("events.date_end_register")}</label>
                    <input className={styles.item_input_choose}
                           value={endDateRegister ? endDateRegister.toISOString().slice(0, 10) : ''} type="date"
                           onChange={(e) => setEndDateRegister(new Date(e.target.value))}>

                    </input>
                </div> : <></>}

                <div className={styles.input_wrapper_full}>
                    <label className={styles.label_choose}>{t("events.format")}</label>
                    <select className={styles.item_input_choose} value={format ?? ''}
                            onChange={(e) => setFormat(e.target.value ? EventFormat[e.target.value as keyof typeof EventFormat] : undefined)}>
                        <option value={EventFormat.Online}>Онлайн</option>
                        <option value={EventFormat.Offline}>Офлайн</option>
                    </select>
                </div>

                {format == EventFormat.Online ? <div className={styles.hidden_container}>
                    <ItemInput label={t("events.link")} value={link}
                               onChange={(e) => setLink(e.target.value)}></ItemInput>

                </div> : <div className={styles.hidden_container}>
                    <p className={styles.text_info}>{t("events.address_info")}</p>

                    <AddressInput
                        label={t("events.address")}
                        value={address}
                        onChange={setAddress}
                        onSelect={handleAddressChange}
                    />

                    <div className={styles.row_container}>
                        <div className={styles.input_wrapper}>
                            <label className={styles.label_choose}>{t("events.longitude")}</label>
                            <input className={styles.item_input_choose} value={longitude} type="number"
                                   onChange={(e) => setLng(Number(e.target.value))}/>
                        </div>

                        <div className={styles.input_wrapper}>
                            <label className={styles.label_choose}>{t("events.latitude")}</label>
                            <input className={styles.item_input_choose} value={latitude} type="number"
                                   onChange={(e) => setLatitude(Number(e.target.value))}>

                            </input>
                        </div>
                    </div>
                </div>
                }

                <div className={styles.near_container}>
                    <p className={styles.base_text_for_adding}>{t("events.digest")}</p>
                    <ItemSwitch checked={isDigest} onChange={() => setIsDigest(!isDigest)}/>
                </div>
                {isDigest ? <ItemEditor value={digest} onChange={setDigest}/> : <></>}


                <p className={styles.base_text_for_adding}>{t("events.notification")}</p>
                <ItemEditor value={notificationText} onChange={setNotificationText}/>

                <p className={styles.base_text_for_adding}>{t("events.files")}</p>
                <ImageUpload
                    onUpload={handlePhoto}
                    initialImageUrl={logoUrl}
                    initialFileName={logoName}
                />

                <div className={styles.buttons_container}>
                    <button className={styles.button_primary} type="submit"
                            onClick={handleSubmit}>{t("common.save")}</button>
                    <button className={styles.button_outlined}
                            onClick={() => navigate('/admin/events')}>{t("common.cancel")}</button>
                </div>


            </div>
        </div>
    );
};
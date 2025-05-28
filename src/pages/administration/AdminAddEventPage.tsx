import {useTranslation} from "react-i18next";
import {useRequest} from "../../hooks/useRequest.ts";
import styles from "./styles/AdminAddEventPage.module.css";
import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {ItemInput} from "../../components/common/ui/input/ItemInput.tsx";
import {ItemSwitch} from "../../components/common/ui/switch/ItemSwitch.tsx";
import {EventAuditory, EventCreateDto, EventFormat, EventService, EventType} from "../../services/event.service.ts";
import ItemEditor from "../../components/admin/ItemEditor.tsx";
import ImageUpload from "../../components/admin/ImageUpload.tsx";
import {DateTimePicker} from "../../components/admin/DateTimePicker.tsx";
import {useNotification} from "../../context/NotificationContext.tsx";
import {AddressInput} from "../../components/admin/AddressInput.tsx";

export const AdminAddEventPage = () => {
    const { t } = useTranslation('common');
    const { request } = useRequest();
    const navigate = useNavigate();
    const { notify } = useNotification();

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [register, setRegister] = useState<boolean>(false);
    const [address, setAddress] = useState<string>('');

    const [type, setType] = useState<EventType | undefined>(undefined);
    const [format, setFormat] = useState<EventFormat | undefined>(EventFormat.Online);
    const [audience, setAudience] = useState<EventAuditory | undefined>(undefined);

    const [longitude, setLng] = useState<number>();
    const [latitude, setLatitude] = useState<number>();

    const [link, setLink] = useState<string>('');
    const [notification, setNotification] = useState<string>('');
    const [isDigest, setIsDigest] = useState<boolean>(false);
    const [digest, setDigest] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [withStartTime, setWithStartTime] = useState(true);
    const [withEndTime, setWithEndTime] = useState(false);
    const [endDateRegister, setEndDateRegister] = useState<Date | null>(null);

    const [logoId, setLogoId] = useState<string | null>(null);
    const [, setHavePhoto] = useState<boolean>(false);

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

    const handlePhoto = (id: string | null) => {
        setLogoId(id);
        if (id == null) {
            setHavePhoto(false)
        }
        else {
            setHavePhoto(true);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (name.length <= 0) {
            notify('warning', t("services.title_validation"));
            return;
        }

        const finalLogo = logoId ? logoId : null;
        const finalLatitude = latitude ? latitude : null;
        const finalLongitude = longitude ? longitude : null;

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

        const dto: EventCreateDto = {
            title: name,
            description: description,
            digestText: digest,
            pictureId: finalLogo,
            isTimeFromNeeded: withStartTime,
            dateTimeFrom: startDate,
            isTimeToNeeded: withEndTime,
            dateTimeTo: endDate,
            link: link,
            addressName: address,
            latitude: finalLatitude,
            longitude: finalLongitude,
            isRegistrationRequired: register,
            registrationLastDate: endDateRegister
                ? endDateRegister
                : null,
            isDigestNeeded: isDigest,
            notificationText: notification,
            type: type,
            format: format,
            auditory: audience
        };
        console.log(dto)


        //if (serviceToEdit?.id) if (serviceToEdit.logo?.id) setHavePhoto(true)


        await request(
            EventService.createEvent(dto),
            {
                successMessage: t("events.success"),
                onSuccess: () => {
                    navigate("/admin/events");
                }
            }
        );
    };

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
                <Link to="/admin/events/creating" className={styles.breadcrumb_active}>
                    {t("events.creating")}
                </Link>
            </div>

            <h2 className={`${styles.title_name}`}>
                {t("events.creating")}
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
                <ItemEditor value={notification} onChange={setNotification}/>

                <p className={styles.base_text_for_adding}>{t("events.files")}</p>
                <ImageUpload
                    onUpload={handlePhoto}
                />

                <div className={styles.buttons_container}>
                    <button className={styles.button_primary} type="submit" onClick={handleSubmit}>{t("common.save")}</button>
                    <button className={styles.button_outlined} onClick={() => navigate('/admin/events')}>{t("common.cancel")}</button>
                </div>

            </div>
        </div>
    )
}
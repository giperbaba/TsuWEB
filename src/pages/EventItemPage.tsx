import {useTranslation} from "react-i18next";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    EventDto, EventFormat, EventInnerRegisterDto,
    EventService
} from "../services/event.service.ts";
import {fetchFileById} from "./administration/AdminItemUserPage.tsx";
import styles from "../pages/administration/styles/AdminEventsPage.module.css"
import defaultAvatar from "../assets/jpg/default_avatar.jpg";

import {formatDate} from "../components/admin/EventCard.tsx";
import MapView from "../components/admin/MapView.tsx";
import {useRequest} from "../hooks/useRequest.ts";
import {RegisterModal} from "../components/events/RegisterModal.tsx";

export const EventItemPage = () => {
    const { t } = useTranslation('common');
    const { eventId } = useParams<{ eventId: string }>();
    const [event, setEvent] = useState<EventDto | null>(null);
    const [pictureUrl, setPictureUrl] = useState<string | undefined>();

    const [isParticipant, setIsParticipant] = useState(false);
    const [isAuth, setIsAuth] = useState(true);
    const [isRegisterWindowOpen, setIsRegisterWindowOpen] = useState(false);

    const { request } = useRequest();

    const fetchEvent = async () => {
        try {
            if (!eventId) {
                console.error("User ID is missing");
                return;
            }

            const { data } = await EventService.getEventByIdPublic(eventId);
            setEvent(data);

            if (!data.picture?.id) {
                setPictureUrl(defaultAvatar);
                return;
            }

            const url = await fetchFileById(data.picture.id);
            setPictureUrl(url);

            await checkParticipation(eventId);

            return () => {
                if (url) URL.revokeObjectURL(url);
            };
        } catch (error) {
            console.error("Ошибка загрузки профиля:", error);
            setPictureUrl(defaultAvatar);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, [eventId, isParticipant]);

    const checkParticipation = async (eventId: string) => {
        try {
            const { data } = await EventService.checkIsUserParticipant(eventId);
            setIsParticipant(data.isParticipating);
        } catch (error: any) {
            if (error.response?.status === 401) {
                setIsAuth(false);
            }
        }
    }

    const registerAsInnerParticipant = async (eventId: string) => {
        if (!eventId) return;

        const dto: EventInnerRegisterDto = { eventId };
        await request(EventService.registerInner(dto), {
            successMessage: t("events.success_register"),
            errorMessage: t("events.failed_register"),
            onSuccess: () => setIsParticipant(true),
        });
    };

    const handleParticipateClick = async () => {
        if (!eventId) return;

        if (isAuth) {
            await registerAsInnerParticipant(eventId);
        } else {
            setIsRegisterWindowOpen(true);
        }
    };

    return(
        <div className={styles.admin_events_page}>

            <h1 className={styles.title}>{t("events.events")}</h1>

            <div className={styles.breadcrumb}>
                <Link to="/events" className={styles.breadcrumb_link}>
                    {t("common.main")}
                </Link>
                <span className={styles.breadcrumb_separator}> / </span>
                <p className={styles.breadcrumb_active}>
                    {event?.title}
                </p>
            </div>

            <div className={styles.item_page_container}>
                <div className={styles.header_item_event}>
                    <h2 className={styles.item_event_title}>{event?.title}</h2>

                    {event && new Date(event.registrationLastDate).getTime() > Date.now() && (
                        isParticipant ? (
                            <button
                                type="button"
                                className={styles.already_participant_button}
                                disabled
                            >
                                {t("events.participate")}
                            </button>
                        ) : (
                            <button
                                type="button"
                                className={styles.participant_button}
                                onClick={handleParticipateClick}
                            >
                                {t("events.will_participate")}
                            </button>
                        )
                    )}

                </div>

                {event && !isAuth ?
                    <RegisterModal
                        isOpen={isRegisterWindowOpen}
                        onClose={() => {
                            setIsRegisterWindowOpen(false);
                        }}
                        onSuccess={() => {
                            setIsRegisterWindowOpen(false);
                            fetchEvent();
                            setIsParticipant(true)
                        }}
                        eventId={event.id}
                    />
                    : <></>
                }


                <div className={styles.section}>
                    <p>{t("events.desc")}</p>
                    <div dangerouslySetInnerHTML={{__html: event?.description || ""}}/>
                    <label>
                        <img src={pictureUrl} alt="avatar" className={styles.image_item_event}/>
                    </label>

                    {event?.format == EventFormat.Online ? // online register required
                        <>
                            {event?.isRegistrationRequired  ?
                                <>
                                    <div className={styles.section_item_block}>
                                        <div
                                            className={styles.section_name_text}>{t("events.date_end_register")}</div>
                                        <div
                                            className={styles.section_base_text}>{formatDate(event.registrationLastDate)}</div>
                                    </div>

                                    {event?.dateTimeTo ?
                                        <div className={styles.section_item_block}>
                                            <div className={styles.section_name_text}>{t("events.date")}</div>
                                            <div
                                                className={styles.section_base_text}>{event.dateTimeTo ? formatDate(event.dateTimeFrom) +
                                                " - " + formatDate(event.dateTimeTo) : formatDate(event.dateTimeFrom)}</div>
                                        </div> : <></>
                                    }

                                    <div className={styles.section_row}>
                                        {event?.format ?
                                            <div className={styles.section_item_block}>
                                                <div className={styles.section_name_text}>{t("events.format")}</div>
                                                <div
                                                    className={styles.section_base_text}>{event.format == EventFormat.Online ?
                                                    "Онлайн" : "Офлайн"}</div>
                                            </div> : <></>}

                                        {event?.link ?
                                            <div className={styles.section_item_block}>
                                                <div className={styles.section_name_text}>{t("events.link")}</div>
                                                <div className={styles.section_base_text}>{event.link}</div>
                                            </div>
                                            : <></>}
                                    </div>
                                </>
                                : // online register not required
                                <>
                                    {event?.dateTimeTo ?
                                        <div className={styles.section_item_block}>
                                            <div className={styles.section_name_text}>{t("events.date")}</div>
                                            <div
                                                className={styles.section_base_text}>{event.dateTimeTo ? formatDate(event.dateTimeFrom) +
                                                " - " + formatDate(event.dateTimeTo) : formatDate(event.dateTimeFrom)}</div>
                                        </div> : <></>
                                    }

                                    <div className={styles.section_row}>
                                        {event?.format ?
                                            <div className={styles.section_item_block}>
                                                <div className={styles.section_name_text}>{t("events.format")}</div>
                                                <div
                                                    className={styles.section_base_text}>{event.format == EventFormat.Online ?
                                                    "Онлайн" : "Офлайн"}</div>
                                            </div> : <></>}

                                        {event?.link ?
                                            <div className={styles.section_item_block}>
                                                <div className={styles.section_name_text}>{t("events.link")}</div>
                                                <div className={styles.section_base_text}>{event.link}</div>
                                            </div>
                                            : <></>}
                                    </div>
                                </>
                            }


                        </> : //offline register required
                        <>
                            {event?.isRegistrationRequired ?
                                <div className={styles.content}>
                                    <div className={styles.section_row}>
                                        <div className={styles.section_item_block}>
                                            <div
                                                className={styles.section_name_text}>{t("events.date_end_register")}</div>
                                            <div
                                                className={styles.section_base_text}>{formatDate(event.registrationLastDate)}</div>
                                        </div>
                                    </div>

                                    <div className={styles.section_row}>
                                        {event?.dateTimeTo ?
                                            <div className={styles.section_item_block}>
                                                <div className={styles.section_name_text}>{t("events.date")}</div>
                                                <div
                                                    className={styles.section_base_text}>{event.dateTimeTo ? formatDate(event.dateTimeFrom) +
                                                    " - " + formatDate(event.dateTimeTo) : formatDate(event.dateTimeFrom)}</div>
                                            </div> : <></>}

                                        {event?.format ?
                                            <div className={styles.section_item_block}>
                                                <div className={styles.section_name_text}>{t("events.format")}</div>
                                                <div className={styles.section_base_text}>Оффлайн</div>
                                            </div>
                                            : null}
                                    </div>

                                    <div className={styles.main_part}>
                                        <div className={styles.left_part}>

                                            {event?.addressName ? <div className={styles.section_item_block}>
                                                <div className={styles.section_name_text}>{t("profile.address")}</div>
                                                <div
                                                    className={styles.section_base_text}>{event.addressName}</div>
                                            </div> : <></>}
                                        </div>

                                        <div className={styles.map_container}>
                                            {event ? <MapView
                                                addressName={event.addressName}
                                                latitude={event.latitude}
                                                longitude={event.longitude}
                                            /> : <></>}
                                        </div>
                                    </div>
                                </div>

                                :
                                // offline register not required
                                <div className={styles.content}>
                                    <div className={styles.section_row}>
                                        {event?.dateTimeTo ?
                                            <div className={styles.section_item_block}>
                                                <div className={styles.section_name_text}>{t("events.date")}</div>
                                                <div
                                                    className={styles.section_base_text}>{event.dateTimeTo ? formatDate(event.dateTimeFrom) +
                                                    " - " + formatDate(event.dateTimeTo) : formatDate(event.dateTimeFrom)}</div>
                                            </div> : <></>}

                                        {event?.format ?
                                            <div className={styles.section_item_block}>
                                                <div className={styles.section_name_text}>{t("events.format")}</div>
                                                <div className={styles.section_base_text}>Оффлайн</div>
                                            </div>
                                            : null}
                                    </div>

                                    <div className={styles.main_part}>
                                        <div className={styles.left_part}>

                                            {event?.addressName ? <div className={styles.section_item_block}>
                                                <div className={styles.section_name_text}>{t("profile.address")}</div>
                                                <div
                                                    className={styles.section_base_text}>{event.addressName}</div>
                                            </div> : <></>}
                                        </div>

                                        <div className={styles.map_container}>
                                            {event ? <MapView
                                                addressName={event.addressName}
                                                latitude={event.latitude}
                                                longitude={event.longitude}
                                            /> : <></>}
                                        </div>
                                    </div>
                                </div>
                            }

                        </>}


                </div>
            </div>
        </div>
    )
}
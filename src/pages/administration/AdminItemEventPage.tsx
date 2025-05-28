import {useTranslation} from "react-i18next";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    EventAuditory,
    EventDto,
    EventEditStatusDto, EventFormat, EventParticipantType,
    EventService,
    EventStatus,
    EventType
} from "../../services/event.service.ts";
import defaultAvatar from "../../assets/jpg/default_avatar.jpg";
import {fetchFileById} from "./AdminItemUserPage.tsx";
import styles from "./styles/AdminEventsPage.module.css";
import StatusDropdown from "../../components/admin/StatusDropdown.tsx";
import EditService from "../../assets/icons/EditService.tsx";
import DeleteService from "../../assets/icons/DeleteService.tsx";
import {useRequest} from "../../hooks/useRequest.ts";
import {formatDate} from "../../components/admin/EventCard.tsx";
import MapView from "../../components/admin/MapView.tsx";
import {useNotification} from "../../context/NotificationContext.tsx";


export const AdminItemEventPage = () => {
    const { t } = useTranslation('common');
    const { request } = useRequest();
    const { notify } = useNotification();
    const navigate = useNavigate();
    const { eventId } = useParams<{ eventId: string }>();
    const [event, setEvent] = useState<EventDto | null>(null);
    const [pictureUrl, setPictureUrl] = useState<string | undefined>();

    const defaultTab = "inside"
    const [activeTab, setActiveTab] = useState<"inside" | "outside" | null>(defaultTab);

    const [participantAvatars, setParticipantAvatars] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchParticipantAvatars = async () => {
            if (!event?.participants) return;

            const avatarMap: Record<string, string> = {};

            await Promise.all(event.participants.map(async (p) => {
                if (p.user && p.user?.avatar?.id) {
                    try {
                        const url = await fetchFileById(p.user.avatar.id);
                        avatarMap[p.id] = url;
                    } catch (e) {
                        avatarMap[p.id] = defaultAvatar;
                    }
                } else {
                    avatarMap[p.id] = defaultAvatar;
                }
            }));

            setParticipantAvatars(avatarMap);
        };

        fetchParticipantAvatars();
    }, [event]);

    const handleDeleteEvent = async (eventId: string) => {
        try {
            await request(
                EventService.deleteEvent(eventId),
            );
            navigate("admin/events")

        } catch (e) {
            console.error(e);
        }
    };

    const handleEditEvent = (eventId: string) => {
        navigate(`/admin/events/editing/${eventId}`);
    };

    const handleEditStatus = async (newStatus: EventStatus) => {
        try {
            if (event?.id) {
                const dto : EventEditStatusDto = {
                    id: event.id,
                    newStatus: newStatus
                }
                await request(
                    EventService.editEventStatus(
                        dto,
                    ),
                    {
                        onSuccess: () => notify("success", t("events.success_edit_status")),
                        errorMessage: t("events.error_edit_status")
                    }

                )
                setEvent(prev => prev ? {...prev, status: newStatus} : null);
            }
        } catch (e) {
            console.error(e);
        }
    }
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                if (!eventId) {
                    console.error("User ID is missing");
                    return;
                }

                const { data } = await EventService.getEventById(eventId);
                console.log(data);
                setEvent(data);

                if (!data.picture?.id) {
                    setPictureUrl(defaultAvatar);
                    return;
                }

                const url = await fetchFileById(data.picture.id);
                setPictureUrl(url);

                return () => {
                    if (url) URL.revokeObjectURL(url);
                };
            } catch (error) {
                console.error("Ошибка загрузки профиля:", error);
                setPictureUrl(defaultAvatar);
            }
        };

        fetchEvent();
    }, [eventId]);


    return(
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
                <Link to="/admin/events" className={styles.breadcrumb_active}>
                    {t("administration.events")}
                </Link>
            </div>

            <div className={styles.item_page_container}>
                <div className={styles.header_item_event}>
                    <h2 className={styles.item_event_title}>{event?.title}</h2>
                    <div className={styles.row_container}>
                        <StatusDropdown
                            value={event?.status || EventStatus.Draft}
                            onChange={(newStatus) => handleEditStatus(newStatus)}></StatusDropdown>
                        <div className={styles.event_buttons}>
                            <EditService
                                onClick={() => event ? handleEditEvent(event?.id) : undefined}
                                style={{cursor: "pointer"}}
                            />

                            <DeleteService onClick={() => event ? handleDeleteEvent(event?.id) : undefined}
                                           style={{cursor: "pointer"}}></DeleteService>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <p>{t("events.desc")}</p>
                    <div dangerouslySetInnerHTML={{__html: event?.description || ""}}/>
                    <label>
                        <img src={pictureUrl} alt="avatar" className={styles.image_item_event}/>
                    </label>

                    {event?.format == EventFormat.Online ?
                        <>
                            <div className={styles.section_row}>
                                {event?.type ? <div className={styles.section_item_block}>
                                    <div className={styles.section_name_text}>{t("events.type")}</div>
                                    <div
                                        className={styles.section_base_text}>{event.type == EventType.Open ? "Открытое" : event.type == EventType.Close ? "Закрытое" : "Неизвестно"}</div>
                                </div> : <></>}

                                {event?.auditory ? <div className={styles.section_item_block}>
                                    <div className={styles.section_name_text}>{t("events.audience")}</div>
                                    <div
                                        className={styles.section_base_text}>{event.auditory == EventAuditory.All ?
                                        "Общий" : event.auditory == EventAuditory.Students ? "Студенты" : "Преподаватели"}</div>
                                </div> : <></>}
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
                                        <div
                                            className={styles.section_base_text}>{event.format == EventFormat.Online ?
                                            "Онлайн" : "Офлайн"}</div>
                                    </div> : <></>}
                            </div>

                            {event?.link ?
                                <div className={styles.section_item_block}>
                                    <div className={styles.section_name_text}>{t("events.link")}</div>
                                    <div className={styles.section_base_text}>{event.link}</div>
                                </div>
                                : <></>}

                            {event?.isDigestNeeded ? <div className={styles.section_item_block}>
                                    <div className={styles.section_name_text}>{t("events.digest_text")}</div>
                                    <div dangerouslySetInnerHTML={{__html: event?.digestText || styles.section_base_text}}/>
                                </div>
                                : event ? <div className={styles.section_item_block}>
                                    <div className={styles.section_name_text}>{t("events.digest")}</div>
                                    <div className={styles.section_base_text}>Нет</div>
                                </div> : <></>}

                            {event?.author ? <div className={styles.section_item_block}>
                                <div className={styles.section_name_text}>{t("events.created_by")}</div>
                                <div
                                    className={styles.section_base_text}>{event.author.firstName} {event.author.lastName} {event.author.patronymic}</div>
                            </div> : <></>}

                            {event?.isRegistrationRequired ?
                                <div className={styles.section_row}>
                                    <div className={styles.section_item_block}>
                                        <div className={styles.section_name_text}>{t("events.need_register")}</div>
                                        <div
                                            className={styles.section_base_text}>{event.isRegistrationRequired ? "Да" : "Нет"}</div>
                                    </div>

                                    <div className={styles.section_item_block}>
                                        <div className={styles.section_name_text}>{t("events.date_end_register")}</div>
                                        <div
                                            className={styles.section_base_text}>{formatDate(event.registrationLastDate)}</div>
                                    </div>
                                </div> : <></>
                            }

                            <div className={styles.members_section}>
                                <div className={styles.tabs}>
                                    {event?.participants && (
                                        <button
                                            onClick={() => setActiveTab("inside")}
                                            className={activeTab === "inside" ? styles.active : ""}
                                        >
                                            {t("events.inside_participant")}
                                        </button>
                                    )}
                                    {(
                                        <button
                                            onClick={() => setActiveTab("outside")}
                                            className={activeTab === "outside" ? styles.active : ""}
                                        >
                                            {t("events.outside_participant")}
                                        </button>
                                    )}
                                </div>

                                <div className={styles.content}>
                                    {activeTab === "inside" && (
                                        <>
                                            {event?.participants
                                                .filter(p => p.participantType === EventParticipantType.Inner).length === 0 ? (
                                                <div className={styles.participant_name}>
                                                    {t("events.no_inner_participants")}
                                                </div>
                                            ) : (
                                                event?.participants
                                                    .filter(p => p.participantType === EventParticipantType.Inner)
                                                    .map(participant => (
                                                        <div key={participant.id} className={styles.participant_card}>
                                                            <img
                                                                src={participantAvatars[participant.id] || defaultAvatar}
                                                                alt="participant"
                                                                className={styles.participant_menu_avatar}
                                                            />
                                                            <div className={styles.participant_column}>
                                                                <div className={styles.participant_name}>
                                                                    {participant.user.firstName} {participant.user.lastName} {participant.user.patronymic}
                                                                </div>
                                                                <div className={styles.section_name_text}>
                                                                    {participant.user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                            )}
                                        </>
                                    )}

                                    {activeTab === "outside" && (
                                        <>
                                            {(() => {
                                                const externalParticipants = event?.participants?.filter(
                                                    p => p.participantType === EventParticipantType.External
                                                ) || [];

                                                if (externalParticipants.length === 0) {
                                                    return (
                                                        <div className={styles.participant_name}>
                                                            {t("events.no_external_participants")}
                                                        </div>
                                                    );
                                                }

                                                return externalParticipants.map(participant => (
                                                    <div key={participant.id} className={styles.participant_card}>
                                                        <div className={styles.participant_column}>
                                                            {participant.name ? (
                                                                <>
                                                                    <div className={styles.participant_name}>
                                                                        {participant.name}
                                                                    </div>
                                                                    <div className={styles.section_name_text}>
                                                                        {participant.email}
                                                                    </div>
                                                                    <div className={styles.section_name_text}>
                                                                        {participant.phone}
                                                                    </div>
                                                                    <div className={styles.section_name_text}>
                                                                        {t("profile.add_info")}
                                                                    </div>
                                                                    <div className={styles.section_base_text}>
                                                                        {participant.additionalInfo}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className={styles.participant_name}>
                                                                    {t("events.no_external_participants")}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ));
                                            })()}
                                        </>
                                    )}
                                </div>
                            </div>
                        </> : //offline
                        <>
                            {event?.isRegistrationRequired ?
                                <div className={styles.section_row}>
                                    <div className={styles.section_item_block}>
                                        <div className={styles.section_name_text}>{t("events.need_register")}</div>
                                        <div
                                            className={styles.section_base_text}>{event.isRegistrationRequired ? "Да" : "Нет"}</div>
                                    </div>

                                    <div className={styles.section_item_block}>
                                        <div className={styles.section_name_text}>{t("events.date_end_register")}</div>
                                        <div
                                            className={styles.section_base_text}>{formatDate(event.registrationLastDate)}</div>
                                    </div>
                                </div> : <></>
                            }

                            <div className={styles.main_part}>
                                <div className={styles.left_part}>

                                    <div className={styles.section_row}>
                                        {event?.type ? <div className={styles.section_item_block}>
                                            <div className={styles.section_name_text}>{t("events.type")}</div>
                                            <div
                                                className={styles.section_base_text}>{event.type == EventType.Open ? "Открытое" : event.type == EventType.Close ? "Закрытое" : "Неизвестно"}</div>
                                        </div> : <></>}

                                        {event?.auditory ? <div className={styles.section_item_block}>
                                            <div className={styles.section_name_text}>{t("events.audience")}</div>
                                            <div
                                                className={styles.section_base_text}>{event.auditory == EventAuditory.All ?
                                                "Общий" : event.auditory == EventAuditory.Students ? "Студенты" : "Преподаватели"}</div>
                                        </div> : <></>}
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

                                    {event?.addressName ? <div className={styles.section_item_block}>
                                        <div className={styles.section_name_text}>{t("profile.address")}</div>
                                        <div
                                            className={styles.section_base_text}>{event.addressName}</div>
                                    </div> : <></>}

                                    <div className={styles.section_row}>
                                        {event?.longitude ? <div className={styles.section_item_block}>
                                            <div className={styles.section_name_text}>{t("events.longitude")}</div>
                                            <div
                                                className={styles.section_base_text}>{event.longitude}</div>
                                        </div> : <></>}

                                        {event?.latitude ? <div className={styles.section_item_block}>
                                            <div className={styles.section_name_text}>{t("events.latitude")}</div>
                                            <div
                                                className={styles.section_base_text}>{event.latitude}</div>
                                        </div> : <></>}
                                    </div>
                                </div>

                                <div className={styles.map_container}>
                                    {event ? <MapView
                                        addressName={event.addressName}
                                        latitude={event.latitude}
                                        longitude={event.longitude}
                                    /> : <></>}
                                </div>
                            </div>


                            {event?.isDigestNeeded ?
                                <div className={styles.participant_column}>
                                    <div className={styles.section_item_block}>
                                        <div className={styles.section_name_text}>{t("events.digest")}</div>
                                        <div className={styles.section_base_text}>Да</div>
                                    </div>
                                    <div className={styles.section_item_block}>
                                        <div className={styles.section_name_text}>{t("events.digest_text")}</div>
                                        <div
                                            dangerouslySetInnerHTML={{__html: event?.digestText || styles.section_base_text}}/>
                                        <div style={{border: `1px solid #EFEFEF`}}></div>
                                    </div>
                                </div>
                                : event ? <div className={styles.section_item_block}>
                                    <div className={styles.section_name_text}>{t("events.digest")}</div>
                                    <div className={styles.section_base_text}>Нет</div>
                                </div> : <></>}

                            {event?.author ? <div className={styles.section_item_block}>
                                <div className={styles.section_name_text}>{t("events.created_by")}</div>
                                <div
                                    className={styles.section_base_text}>{event.author.firstName} {event.author.lastName} {event.author.patronymic}</div>
                            </div> : <></>}
                        </>}


                </div>
            </div>
        </div>
    )
}
import {useTranslation} from "react-i18next";
import {useRequest} from "../../hooks/useRequest.ts";
import React, {useEffect, useState} from "react";
import {PagedListMetaData} from "../../services/user.service.ts";
import styles from "./styles/AdminEventsPage.module.css";
import {data, Link} from "react-router-dom";
import AddService from "../../assets/icons/AddService.tsx";
import {Pagination} from "@mui/material";
import {EventFormat, EventService, EventShortDto, EventStatus, EventType} from "../../services/event.service.ts";
import {EventCard} from "../../components/admin/EventCard.tsx";
import {ItemInput} from "../../components/common/ui/input/ItemInput.tsx";
import SvgFilter from "../../assets/icons/Filter.tsx";

export const AdminEventsPage = () => {
    const { t } = useTranslation('common');
    const { request } = useRequest();

    const [events, setEvents] = useState<EventShortDto[]>([]);
    const [metadata, setMetadata] = useState<PagedListMetaData | null>(null);

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;

    const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);

    const [eventToEdit, setEventToEdit] = useState<EventShortDto | null>(null);

    const [isOpen, setIsOpen] = useState(false);

    const [name, setName] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [format, setFormat] = useState<string>('');
    const [date, setDate] = useState<string>('');

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await request(
                EventService.getEvents(
                    status,
                    type,
                    name,
                    format,
                    date,
                    420,
                    currentPage,
                    pageSize
                ),
                {
                    errorMessage: "Failed to load events, access denied",
                }
            );

            setEvents(response.data.results);
            setMetadata(response.data.metaData);
            setCurrentPage(response.data.metaData.pageNumber);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [currentPage]);

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const handleDeleteEvent = async (eventId: string) => {
        try {
            await request(
               EventService.deleteEvent(eventId),
                {
                    errorMessage: "Не удалось удалить мероприятие",
                }
            );
            setEvents(prev => prev.filter(event => event.id !== eventId));

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleEditEvent = (event: EventShortDto) => {
        setEventToEdit(event);
        setIsAddingModalOpen(true);
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
                <Link to="/admin/usefulservices" className={styles.breadcrumb_active}>
                    {t("administration.events")}
                </Link>
            </div>

            <h2 className={`${styles.title_name}`}>
                {t("administration.events")}
            </h2>

            <button
                className={styles.add_event_button}
                onClick={() => setIsAddingModalOpen(true)}
            >
                {t("events.add")} <AddService/>
            </button>


            <div className={styles.section}>
                <div className={styles.row_container}>
                    <p className={styles.base_text}>{t("events.search_bar")}</p>
                    <button className={styles.filter_button} onClick={() => {
                        setIsOpen(!isOpen)
                    }}>{t("events.filters")}<SvgFilter/></button>

                </div>
                <div className={styles.row_container}>
                    <ItemInput label={t("events.name")} value={name}
                               onChange={(e) => setName(e.target.value)}></ItemInput>
                    <button
                        type="button"
                        className={styles.search_button}
                        onClick={fetchEvents}
                    >
                        {t("administration.search")}
                    </button>
                </div>

                {isOpen ? <div className={styles.hidden_section}>
                    <div className={styles.row_container}>
                        <div className={styles.input_wrapper}>
                            <label className={styles.label_choose}>{t("events.status")}</label>
                            <select className={styles.item_input_choose} value={status}
                                    onChange={(e) => setStatus(e.target.value)}>
                                <option value={undefined}></option>
                                <option value={EventStatus.Actual}>Активное</option>
                                <option value={EventStatus.Finished}>Завершилось</option>
                                <option value={EventStatus.Draft}>Черновик</option>
                                <option value={EventStatus.Archive}>Архив</option>
                            </select>
                        </div>

                        <div className={styles.input_wrapper}>
                            <label className={styles.label_choose}>{t("events.type")}</label>
                            <select className={styles.item_input_choose} value={type}
                                    onChange={(e) => setType(e.target.value)}>
                                <option value={undefined}></option>
                                <option value={EventType.Open}>Открытое</option>
                                <option value={EventType.Close}>Закрытое</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.row_container}>
                        <div className={styles.input_wrapper}>
                            <label className={styles.label_choose}>{t("events.format")}</label>
                            <select className={styles.item_input_choose} value={format}
                                    onChange={(e) => setFormat(e.target.value)}>
                                <option value={undefined}></option>
                                <option value={EventFormat.Online}>Онлайн</option>
                                <option value={EventFormat.Offline}>Офлайн</option>
                            </select>
                        </div>

                        <div className={styles.input_wrapper}>
                            <label className={styles.label_choose}>{t("events.search_date")}</label>
                            <input className={styles.item_input_choose} value={date} type="date"
                                    onChange={(e) => setDate(e.target.value)}>

                            </input>
                        </div>

                    </div>
                </div> : <></>}


            </div>


            <div className={styles.events_container}>
                {loading ? (
                    <p>{t("common.loading")}</p>
                ) : events.length === 0 ? (
                    <p style={{padding: 16}}>{t("administration.no_events")}</p>
                ) : events.map((event) => (
                    <EventCard event={event} onDelete={handleDeleteEvent} onEdit={handleEditEvent}></EventCard>
                ))}
            </div>

            <div className={styles.pagination_container}>
                <Pagination
                    count={metadata?.pageCount || 1}
                    page={currentPage}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    )
}
import styles from "./administration/styles/AdminEventsPage.module.css"
import {useTranslation} from "react-i18next";
import {useRequest} from "../hooks/useRequest.ts";
import {Link, useSearchParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {EventAuditory, EventService, EventShortDto} from "../services/event.service.ts";
import {PagedListMetaData} from "../services/user.service.ts";
import {ItemInput} from "../components/common/ui/input/ItemInput.tsx";
import {Pagination} from "@mui/material";
import {EventPublicCard} from "../components/events/EventPublicCard.tsx";
import {useProfile} from "../context/ProfileContext.tsx";
import {UserType} from "../services/profile.service.ts";

export const EventsPage = () => {
    const { t } = useTranslation('common');
    const { request } = useRequest();
    const { profile } = useProfile();

    const [allEvents, setAllEvents] = useState<EventShortDto[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<EventShortDto[]>([]);
    const [metadata, setMetadata] = useState<PagedListMetaData | null>(null);
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const pageSize = 15;

    const [searchParams, setSearchParams] = useSearchParams();
    const getParam = (key: string) => searchParams.get(key) || '';

    const [name, setName] = useState<string>(() => getParam("name"));
    const [date, setDate] = useState<string>(() => getParam("date"));
    const [currentPage, setCurrentPage] = useState<number>(() =>
        parseInt(searchParams.get("page") || "1")
    );

    const [isAuth, setIsAuth] = useState(false);

    const filterEvents = (events: EventShortDto[]) => {
        if (!isAuth) {
            return events.filter(event => event.auditory === EventAuditory.All);
        }

        if (!profile?.userTypes) {
            return events.filter(event => event.auditory === EventAuditory.All);
        }

        return events.filter(event => {
            if (event.auditory === EventAuditory.All) {
                return true;
            }

            if (profile.userTypes) {
                return profile.userTypes.some(userType => {
                    if (userType === UserType.Student) {
                        return event.auditory === EventAuditory.Students;
                    }
                    if (userType === UserType.Employee) {
                        return event.auditory === EventAuditory.Employees;
                    }
                    return false;
                });
            }
        });
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const fetchFn = async () => {
                try {
                    const response = await request(
                        EventService.getEventsPublicWithAuth(
                            name,
                            date,
                            420,
                            currentPage,
                            pageSize
                        ),
                        {
                            errorMessage: t("common.not_logged_in")
                        }
                    );
                    setIsAuth(true);
                    return response;
                }
                catch (error: any) {
                    if (error.response?.status === 401) {
                        setIsAuth(false);
                        return await request(
                            EventService.getEventsPublic(
                                name,
                                date,
                                420,
                                currentPage,
                                pageSize
                            )
                        );
                    } else {
                        throw error;
                    }
                }
            };

            const response = await fetchFn();
            setAllEvents(response.data.results);
            setMetadata(response.data.metaData);
            setCurrentPage(response.data.metaData.pageNumber);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setFilteredEvents(filterEvents(allEvents));
    }, [allEvents, profile, isAuth]);

    useEffect(() => {
        updateSearchParams();
        fetchEvents();
    }, [name, date, currentPage]);

    useEffect(() => {
        if (profile !== undefined) {
            setProfileLoading(false);
        }
    }, [profile]);

    const updateSearchParams = () => {
        const params: any = {
            name,
            date,
            page: currentPage,
        };

        Object.keys(params).forEach(
            key => (params[key] === '' || params[key] == null) && delete params[key]
        );

        setSearchParams(params);
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    if (profileLoading) {
        return <p>{t("common.loading")}</p>;
    }

    return (
        <div className={styles.admin_events_page}>
            <h1 className={styles.title}>{t("events.events")}</h1>

            <div className={styles.breadcrumb}>
                <Link to="/events" className={styles.breadcrumb_link}>
                    {t("common.main")}
                </Link>
                <span className={styles.breadcrumb_separator}> / </span>
                <Link to="/events" className={styles.breadcrumb_active}>
                    {t("administration.events")}
                </Link>
            </div>

            <div className={styles.section}>
                <p className={styles.base_text}>{t("events.search")}</p>

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

                <div className={styles.input_wrapper}>
                    <label className={styles.label_choose}>{t("events.search_date")}</label>
                    <input className={styles.item_input_choose} value={date} type="date"
                           onChange={(e) => setDate(e.target.value)}>
                    </input>
                </div>
            </div>

            <div className={styles.events_grid}>
                {loading ? (
                    <p>{t("common.loading")}</p>
                ) : filteredEvents.length === 0 ? (
                    <p style={{padding: 16}}>{t("administration.no_events")}</p>
                ) : filteredEvents.map((event) => (
                    <EventPublicCard
                        key={event.id}
                        event={event}
                        isFilter={date.length > 0 || name.length > 0}
                    />
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
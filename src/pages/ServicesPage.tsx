import styles from "./administration/styles/AdminUsersPage.module.css"
import {useTranslation} from "react-i18next";
import {UsefulServiceCategory, UsefulServiceDto, UsefulServicesService} from "../services/useful_services.service.ts";
import {useRequest} from "../hooks/useRequest.ts";
import React, {useEffect, useState} from "react";
import {PagedListMetaData} from "../services/user.service.ts";
import {Link} from "react-router-dom";
import {Pagination} from "@mui/material";
import {ServicePublicCard} from "../components/services/ServicePublicCard.tsx";
import {useProfile} from "../context/ProfileContext.tsx";
import {UserType} from "../services/profile.service.ts";

export const ServicesPage = () => {
    const { t } = useTranslation('common');
    const { request } = useRequest();
    const { profile } = useProfile();

    const [allServices, setAllServices] = useState<UsefulServiceDto[]>([]);
    const [filteredServices, setFilteredServices] = useState<UsefulServiceDto[]>([]);
    const [metadata, setMetadata] = useState<PagedListMetaData | null>(null);
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;

    const filterServices = (services: UsefulServiceDto[]) => {
        if (!profile?.userTypes) {
            return services.filter(service => service.category === UsefulServiceCategory.ForAll);
        }

        return services.filter(service => {
            if (service.category === UsefulServiceCategory.ForAll) {
                return true;
            }

            if (profile?.userTypes) {
                return profile.userTypes.some(userType => {
                    if (userType === UserType.Student) {
                        return service.category === UsefulServiceCategory.Students;
                    }
                    if (userType === UserType.Employee) {
                        return service.category === UsefulServiceCategory.Employees;
                    }
                    return false;
                });

            }
        });
    };

    const fetchServices = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();

            Object.values(UsefulServiceCategory).forEach(category =>
                params.append('categories', category)
            );

            params.append('page', currentPage.toString());
            params.append('pageSize', pageSize.toString());

            const response = await request(
                UsefulServicesService.getServices(
                    params
                ),
                {
                    errorMessage: "Failed to load services, access denied",
                }
            );

            setAllServices(response.data.results);
            setMetadata(response.data.metaData);
            setCurrentPage(response.data.metaData.pageNumber);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setFilteredServices(filterServices(allServices));
    }, [allServices, profile]);

    useEffect(() => {
        fetchServices();
    }, [currentPage]);

    useEffect(() => {
        if (profile !== undefined) {
            setProfileLoading(false);
        }
    }, [profile]);

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    if (profileLoading) {
        return <p>{t("common.loading")}</p>;
    }

    return (
        <div className={styles.useful_services_page}>
            <h1 className={styles.title}>{t("administration.services")}</h1>

            <div className={styles.breadcrumb}>
                <Link to="/profile" className={styles.breadcrumb_link}>
                    {t("common.main")}
                </Link>

                <span className={styles.breadcrumb_separator}> / </span>
                <Link to="/usefulservices" className={styles.breadcrumb_active}>
                    {t("administration.services")}
                </Link>
            </div>

            <div className={styles.public_services_container}>
                {loading ? (
                    <p>{t("common.loading")}</p>
                ) : filteredServices.length === 0 ? (
                    <p>{t("administration.no_users")}</p>
                ) : filteredServices.map((service) => (
                    <ServicePublicCard key={service.id} service={service}/>
                ))}
            </div>

            <div className={styles.pagination_container} style={{paddingTop: '16px'}}>
                <Pagination
                    count={metadata?.pageCount || 1}
                    page={currentPage}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    )
}
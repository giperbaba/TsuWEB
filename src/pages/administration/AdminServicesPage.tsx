import styles from "./styles/AdminUsersPage.module.css"
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import AddService from "../../assets/icons/AddService.tsx";
import {Pagination} from "@mui/material";
import React, {useEffect, useState} from "react";
import {PagedListMetaData} from "../../services/user.service.ts";
import {
    UsefulServiceCategory,
    UsefulServiceDto,
    UsefulServicesService
} from "../../services/useful_services.service.ts";
import {ServiceCard} from "../../components/admin/ServiceCard.tsx";
import {useRequest} from "../../hooks/useRequest.ts";
import {AddServiceModal} from "../../components/admin/AddServiceModal.tsx";

const categories = [UsefulServiceCategory.ForAll, UsefulServiceCategory.Students, UsefulServiceCategory.Employees]

export const AdminServicesPage = () => {
    const { t } = useTranslation('common');
    const { request } = useRequest();

    const [services, setServices] = useState<UsefulServiceDto[]>([]);
    const [metadata, setMetadata] = useState<PagedListMetaData | null>(null);

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;

    const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);

    const [serviceToEdit, setServiceToEdit] = useState<UsefulServiceDto | null>(null);


    const fetchServices = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();

            categories.forEach(category =>
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

            setServices(response.data.results);
            setMetadata(response.data.metaData);
            setCurrentPage(response.data.metaData.pageNumber);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [currentPage]);

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const handleEditService = (service: UsefulServiceDto) => {
        setServiceToEdit(service);
        setIsAddingModalOpen(true);
    };


    const handleDeleteService = async (serviceId: string) => {
        try {
            await request(
                UsefulServicesService.deleteService(serviceId),
                {
                    errorMessage: "Не удалось удалить сервис",
                }
            );
            setServices(prev => prev.filter(service => service.id !== serviceId));

            // Если нужно, можно перезапросить список:
            // await fetchServices();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.useful_services_page}>
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
                    {t("administration.services")}
                </Link>
            </div>

            <h2 className={`${styles.title_name}`}>
                {t("administration.services")}
            </h2>

            <button
                className={styles.add_service_button}
                onClick={() => setIsAddingModalOpen(true)}
            >
                {t("services.add")} <AddService/>
            </button>

            <AddServiceModal
                isOpen={isAddingModalOpen}
                onClose={() => {
                    setIsAddingModalOpen(false);
                    setServiceToEdit(null);
                }}
                onSuccess={fetchServices}
                serviceToEdit={serviceToEdit}
            />


            <div className={styles.users_container}>
                {loading ? (
                    <p>{t("common.loading")}</p>
                ) : services.length === 0 ? (
                    <p>{t("administration.no_users")}</p>
                ) : services.map((service) => (
                    <ServiceCard key={service.id}  service={service} onDelete={handleDeleteService} onEdit={handleEditService}/>
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
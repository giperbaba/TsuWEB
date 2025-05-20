import styles from "./styles/AdminUsersPage.module.css"
import { useTranslation } from "react-i18next";
import {Link} from "react-router-dom";
import PaginationLeft from "../../assets/icons/PaginationLeft.tsx";
import PaginationRight from "../../assets/icons/PaginationRight.tsx";
import SearchList from "../../assets/icons/SearchList.tsx";
import SearchCards from "../../assets/icons/SearchCards.tsx";
import { useRequest } from "../../hooks/useRequest.ts";
import { PagedListMetaData, ProfileShortDto, UserService } from "../../services/user.service.ts";
import React, { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import {UserCardList} from "./UserCardList.tsx";
import {UserCard} from "./UserCard.tsx";

export const AdminUsersPage = () => {
    const { t } = useTranslation('common');
    const { request } = useRequest();

    const [users, setUsers] = useState<ProfileShortDto[]>([]);
    const [metadata, setMetadata] = useState<PagedListMetaData | null>(null);
    const [loading, setLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;

    const [alphabetExpanded, setAlphabetExpanded] = useState(false);
    const cyrillicLetters = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЭЮЯ".split("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await request(
                UserService.getUsers(
                    searchQuery,
                    searchQuery,
                    selectedLetter || "",
                    currentPage,
                    pageSize
                ),
                {
                    errorMessage: "Failed to load users, access denied",
                }
            );
            setUsers(response.data.results);
            setMetadata(response.data.metaData);
            setCurrentPage(response.data.metaData.pageNumber);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [searchQuery, selectedLetter, currentPage]);

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        //fetchUsers();
    };

    const handleLetterClick = (letter: string) => {
        setSelectedLetter(letter === selectedLetter ? null : letter);
        setSearchQuery("");
        setCurrentPage(1);
        setAlphabetExpanded(false);
    };

    const toggleAlphabet = () => {
        setAlphabetExpanded(!alphabetExpanded);
        if (alphabetExpanded) {
            setSelectedLetter(null);
        }
    };

    return (
        <div className={styles.admin_users_page}>
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
                <Link to="/admin/users" className={styles.breadcrumb_active_red}>
                    {t("administration.users")}
                </Link>
            </div>

            <form className={styles.search_row} onSubmit={handleSearch}>
                <input
                    className={styles.search_input}
                    type="text"
                    placeholder={t("administration.placeholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className={styles.search_button}>
                    {t("administration.search")}
                </button>
            </form>

            <div className={styles.search}>
                <div className={styles.search_row}>
                    <PaginationLeft />
                    <div className={styles.alphabet_container}>
                        {alphabetExpanded ? (
                            <div className={styles.alphabet_expanded}>
                                {cyrillicLetters.map((letter) => (
                                    <span
                                        key={letter}
                                        className={`${styles.alphabet_letter} ${selectedLetter === letter ? styles.active_letter : ''}`}
                                        onClick={() => handleLetterClick(letter)}
                                    >
                                        {letter}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className={styles.alphabet_toggle} onClick={toggleAlphabet}>
                                {selectedLetter ? selectedLetter : 'А - Я'}
                            </p>
                        )}
                    </div>
                    <PaginationRight />
                </div>

                <div className={styles.view_toggle}>
                    <SearchList
                        onClick={() => setViewMode('list')}
                        active={viewMode === 'list'}
                        style={{cursor: 'pointer'}}
                    />
                    <SearchCards
                        onClick={() => setViewMode('cards')}
                        active={viewMode === 'cards'}
                        style={{cursor: 'pointer'}}
                    />
                </div>
            </div>

            <div className={styles.users_container}>
                {loading ? (
                    <p>{t("common.loading")}</p>
                ) : users.length === 0 ? (
                    <p>{t("administration.no_users")}</p>
                ) : viewMode === 'list' ? (
                    users.map((user) => (
                        <Link to={`/admin/users/${user.id}`} key={user.id} className={styles.user_link}>
                            <UserCardList user={user} />
                        </Link>
                    ))
                ) : (
                    <div className={styles.card_grid}>
                        {users.map((user) => (
                            <Link to={`/admin/users/${user.id}`} key={user.id} className={styles.user_link}>
                                <UserCard user={user} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.pagination_container}>
                <Pagination
                    count={metadata?.pageCount || 1}
                    page={currentPage}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    );
};
import styles from "./Pagination.module.css"
import {PagedListMetaData} from "../../../../services/user.service.ts";
import PaginationLeft from "../../../../assets/icons/PaginationLeft.tsx";
import PaginationRight from "../../../../assets/icons/PaginationRight.tsx";

interface PaginationProps {
    metadata: PagedListMetaData;
    onPageChange: (page: number) => void;
    maxVisiblePages?: number;
}

export const Pagination = ({
                               metadata,
                               onPageChange,
                               maxVisiblePages = 5,
                           }: PaginationProps) => {
    const { pageNumber, pageCount, hasPreviousPage, hasNextPage } = metadata;

    if (pageCount <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        let startPage = Math.max(1, pageNumber - Math.floor(maxVisiblePages / 2));
        let endPage = startPage + maxVisiblePages - 1;

        if (endPage > pageCount) {
            endPage = pageCount;
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push("...");
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            if (i > 0 && i <= pageCount) {
                pages.push(i);
            }
        }

        if (endPage < pageCount) {
            if (endPage < pageCount - 1) {
                pages.push("...");
            }
            pages.push(pageCount);
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className={styles.pagination}>
            <button
                onClick={() => onPageChange(pageNumber - 1)}
                disabled={!hasPreviousPage}
                className={`${styles.arrowButton} ${!hasPreviousPage ? styles.disabled : ''}`}
                aria-label="Previous page"
            >
                <PaginationLeft className={styles.arrowIcon} />
            </button>

            {pages.map((page, index) =>
                    page === "..." ? (
                        <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            ...
          </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={`${styles.pageButton} ${
                                pageNumber === page ? styles.active : ""
                            }`}
                            aria-current={pageNumber === page ? "page" : undefined}
                        >
                            {page}
                        </button>
                    )
            )}

            <button
                onClick={() => onPageChange(pageNumber + 1)}
                disabled={!hasNextPage}
                className={`${styles.arrowButton} ${!hasNextPage ? styles.disabled : ''}`}
                aria-label="Next page"
            >
                <PaginationRight className={styles.arrowIcon} />
            </button>

            <div className={styles.pageInfo}>
                Showing {metadata.firstItemOnPage} to {metadata.lastItemOnPage} of{' '}
                {metadata.totalItemCount} items
            </div>
        </div>
    );
};
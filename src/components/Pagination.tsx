"use client";

import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";

interface PaginationProps {
    page: number;
    count: number;
}

const Pagination = ({ page, count }: PaginationProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
    const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count;
    const totalPages = Math.ceil(count / ITEM_PER_PAGE);

    const changePage = useCallback(
        (newPage: number) => {
            const params = new URLSearchParams(searchParams);
            params.set("page", newPage.toString());
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [pathname, router, searchParams]
    );

    // Prefetch adjacent pages for better performance
    const prefetchPage = useCallback(
        (pageNum: number) => {
            if (pageNum >= 1 && pageNum <= totalPages) {
                const params = new URLSearchParams(searchParams);
                params.set("page", pageNum.toString());
                router.prefetch(`${pathname}?${params.toString()}`);
            }
        },
        [pathname, router, searchParams, totalPages]
    );

    // Prefetch on mount for adjacent pages
    useEffect(() => {
        if (hasPrev) prefetchPage(page - 1);
        if (hasNext) prefetchPage(page + 1);
    }, [hasPrev, hasNext, page, prefetchPage]);

    return (
        <div className="p-4 flex items-center justify-between text-gray-500">
            <button
                disabled={!hasPrev}
                className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => changePage(page - 1)}
            >
                Prev
            </button>
            <div className="flex items-center gap-2 text-sm">
                {Array.from({ length: totalPages }, (_, index) => {
                    const pageIndex = index + 1;
                    return (
                        <button
                            key={pageIndex}
                            className={`px-2 rounded-sm ${
                                page === pageIndex ? "bg-lamaSky" : ""
                            }`}
                            onClick={() => changePage(pageIndex)}
                            onMouseEnter={() => prefetchPage(pageIndex)} // Prefetch on hover
                        >
                            {pageIndex}
                        </button>
                    );
                })}
            </div>
            <button
                disabled={!hasNext}
                className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => changePage(page + 1)}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;

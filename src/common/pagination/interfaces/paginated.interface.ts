export interface Paginated<T>{   //can be used for any entity
    data: T[];
    meta:{
        itemsPerPage: number;
        totalItems: number;
        currentPage: number;
        totalPages: number;
    };
    links:{
        first: string;
        last: string;
        current: string;
        next: string;
        previous: string;
    };
}
export interface PageResponse<T> {
    content: T[];
    last: boolean;
    totalPages: number;
    totalElements: number;
    number: number;
}
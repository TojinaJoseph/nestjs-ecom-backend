import { Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
    constructor(
        @Inject(REQUEST)
        private readonly request: Request
    ) { }
    public async paginateQuery<T extends ObjectLiteral>(paginateQuery: PaginationQueryDto, repository: Repository<T>, filters?: { category?: string; minPrice?: number; maxPrice?: number }): Promise<Paginated<T>> {
        let finalResponse: Paginated<T>;
        let results;
        let page = paginateQuery.page ? paginateQuery.page : 1
        let take = paginateQuery.limit ? paginateQuery.limit : 10
        let totalItems;

        try {
            //for additional query parameters

            if (filters && Object.keys(filters).length > 0) {
                // Use QueryBuilder if filters are provided
                const qb = repository.createQueryBuilder("entity");
                if (filters.category) {
                    qb.andWhere("entity.category = :category", { category: filters.category });
                }

                // Object.entries(filters).forEach(([key, value], index) => {
                //   const paramName = `filter${index}`;
                //   qb.andWhere(`entity.${key} = :${paramName}`, { [paramName]: value });
                // });

                // Filter by price range (if minPrice and maxPrice are provided)
                if (filters.minPrice) {
                    qb.andWhere("entity.price >= :minPrice", { minPrice: filters.minPrice });
                }

                if (filters.maxPrice) {
                    qb.andWhere("entity.price <= :maxPrice", { maxPrice: filters.maxPrice });
                }

                qb.skip((page - 1) * take).take(take);

                [results, totalItems] = await qb.getManyAndCount();
            } else {
                results = await repository.find({
                    skip: (page - 1) * take,
                    take
                });
                totalItems = await repository.count();
            }
            //create request urls
            const baseURL = this.request.protocol + '://' + this.request.headers.host + '/';
            const newUrl = new URL(this.request.url, baseURL)

            //calculating page numbers


            const totalPages = paginateQuery.limit ? Math.ceil(totalItems / paginateQuery.limit) : 0;
            const nextPage = paginateQuery.page && (paginateQuery.page === totalPages ? paginateQuery.page : paginateQuery.page + 1);
            const previousPage = paginateQuery.page && (paginateQuery.page === 1 ? paginateQuery.page : paginateQuery.page - 1);
            finalResponse = {
                data: results,
                meta: {
                    itemsPerPage: paginateQuery.limit ? paginateQuery.limit : 0,
                    totalItems: totalItems,
                    currentPage: paginateQuery.page ? paginateQuery.page : 0,
                    totalPages: totalPages
                },
                links: {
                    first: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=1`,
                    last: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=${totalPages}`,
                    current: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=${paginateQuery.page}`,
                    next: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=${nextPage}`,
                    previous: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=${previousPage}`,
                }
            }

        } catch (error) {
            throw new RequestTimeoutException('Unable to process your request,please try again later', {
                description: 'Error connecting to database'
            })
        }
        return finalResponse;
    }
}

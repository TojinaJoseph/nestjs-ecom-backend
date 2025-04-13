import { Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
    constructor(
        @Inject(REQUEST)
        private readonly request:Request
    ){}
    public async paginateQuery<T extends ObjectLiteral>(paginateQuery: PaginationQueryDto,repository: Repository<T>): Promise<Paginated<T>>{
        let finalResponse:Paginated<T>;
        let results;
               let page=paginateQuery.page?paginateQuery.page:1 
               let take=paginateQuery.limit?paginateQuery.limit:10
       
               try {
                   results=await repository.find({
                       skip:(page-1)*take,
                       take
                   });

                //create request urls
              const baseURL=this.request.protocol + '://' + this.request.headers.host + '/';
              const newUrl=new URL(this.request.url,baseURL)
               console.log(newUrl)

               //calculating page numbers

               const totalItems=await repository.count();
               const totalPages=paginateQuery.limit?Math.ceil(totalItems/paginateQuery.limit):0;
               const nextPage=paginateQuery.page&&(paginateQuery.page===totalPages?paginateQuery.page:paginateQuery.page+1);
               const previousPage=paginateQuery.page&&(paginateQuery.page===1?paginateQuery.page:paginateQuery.page-1);
               finalResponse={
                data:results,
                meta:{
                     itemsPerPage: paginateQuery.limit?paginateQuery.limit:0,
                     totalItems: totalItems,
                     currentPage: paginateQuery.page?paginateQuery.page:0,
                     totalPages:totalPages
                },
                links:{
                    first: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=1`,
                    last: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=${totalPages}`,
                    current: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=${paginateQuery.page}`,
                    next: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=${nextPage}`,
                    previous: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=${previousPage}`,     
                }
               } 

               } catch (error) {
                   throw new RequestTimeoutException('Unable to process your request,please try again later',{
                       description:'Error connecting to database'
                   }) 
               }
               return finalResponse;
    }
}

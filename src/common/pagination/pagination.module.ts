import { Module } from '@nestjs/common';
import { PaginationProvider } from './providers/pagination.provider.ts';

@Module({
  providers: [PaginationProvider],
  exports:[PaginationProvider]
})
export class PaginationModule {}

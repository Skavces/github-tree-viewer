import { Module } from '@nestjs/common';
import { TreeController } from './tree.controller';
import { TreeService } from './tree.service';
import { GitHubModule } from '../github/github.module';

@Module({
  imports: [GitHubModule],
  controllers: [TreeController],
  providers: [TreeService],
})
export class TreeModule {}

import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TreeService } from './tree.service';
import { treeQuerySchema } from './dto/tree-query.dto';

@Controller('api/tree')
export class TreeController {
  constructor(private readonly treeService: TreeService) {}

  @Get()
  async getTree(
    @Query('repo') repo: string,
    @Query('branch') branch?: string,
  ) {
    const result = treeQuerySchema.safeParse({ repo, branch });

    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message).join(', ');
      throw new HttpException(messages, HttpStatus.BAD_REQUEST);
    }

    return this.treeService.getTree(result.data.repo, result.data.branch);
  }
}

import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '@app/auth';

@ApiTags('TicketingComment')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('tickets/:ticketId/comments')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Add a comment to ticket.' })
  async create(
    @Param('ticketId') ticketId: string,
    @Body() dto: CreateCommentDto,
    @Req() req,
  ) {
    return this.service.addComment(ticketId, dto, req.user.userId);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Get all comments of a ticket.' })
  async findAll(@Param('ticketId') ticketId: string) {
    return this.service.getComments(ticketId);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Update a comment.' })
  async update(
    @Param('ticketId') ticketId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
    @Req() req,
  ) {
    return this.service.updateComment(id, dto, req.user.userId);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Delete a comment.' })
  async remove(
    @Param('ticketId') ticketId: string,
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    return this.service.deleteComment(id, req.user.userId);
  }
}

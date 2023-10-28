import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateResetTokenDto } from './dto/create-reset-token.dto';
import { ResetToken, ResetTokenDocument } from './schemas/reset-token.schema';

@Injectable()
export class ResetTokensService {
  constructor(
    @InjectModel(ResetToken.name)
    private resetTokenModel: Model<ResetTokenDocument>,
  ) {}

  async create(
    createResetTokenDto: CreateResetTokenDto,
  ): Promise<ResetTokenDocument> {
    const createdToken = new this.resetTokenModel({
      user: createResetTokenDto.userId,
      token: createResetTokenDto.token,
    });
    return createdToken.save();
  }

  async removeAllUserTokens(userId: string) {
    return this.resetTokenModel.deleteMany({ user: userId }).exec();
  }

  async findOneByUserId(userId: string): Promise<ResetTokenDocument> {
    return this.resetTokenModel.findOne({ user: userId }).exec();
  }
}

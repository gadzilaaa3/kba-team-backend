import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './schemas/token.schema';
import { Model } from 'mongoose';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>,
  ) {}

  async create(createTokenDto: CreateTokenDto): Promise<TokenDocument> {
    const createdToken = new this.tokenModel({
      user: createTokenDto.userId,
      refreshToken: createTokenDto.refreshToken,
      expiresIn: createTokenDto.expiresIn,
    });
    return createdToken.save();
  }

  async update(
    id: string,
    updateTokenDto: UpdateTokenDto,
  ): Promise<TokenDocument> {
    return this.tokenModel
      .findByIdAndUpdate(id, updateTokenDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<TokenDocument> {
    return this.tokenModel.findByIdAndDelete(id).exec();
  }

  async removeAllUserToken(userId: string) {
    return this.tokenModel.deleteMany({ user: userId }).exec();
  }

  async findOneByToken(
    refreshToken: string,
    userId?: string,
  ): Promise<TokenDocument> {
    if (!userId) {
      return this.tokenModel.findOne({ refreshToken });
    }
    return this.tokenModel.findOne({ refreshToken, user: userId });
  }

  async findAllByUserId(userId: string): Promise<TokenDocument[]> {
    return this.tokenModel.find({ user: userId });
  }
}

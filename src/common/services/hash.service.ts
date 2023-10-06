import * as bcrypt from 'bcrypt';

export class HashService {
  private static saltRounds = 15;

  static async hashData(data: string) {
    const salt = await bcrypt.genSalt(HashService.saltRounds);
    return bcrypt.hash(data, salt);
  }
}

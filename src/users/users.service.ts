import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './User';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      userId: '1',
      username: 'pawi',
      password: 'pawi'
    }
  ];

  async findOne(username: string): Promise<User> {
    try {
      return this.users.find(user => user.username === username);
    } catch (e) {
      console.error(e)
    }
  }

  async create(userData: any): Promise<any> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const userId = Date.now().toString();

      this.users.push({
        userId: userId,
        username: userData.username,
        password: hashedPassword,
      });
      return true;
    }catch (e) {
      console.error(e)
    }
  }
}

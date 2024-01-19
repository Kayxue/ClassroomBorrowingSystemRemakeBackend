import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    public constructor(private userService: UserService) { }

    public async validateUser(username: string, password: string) {
        const user = await this.userService.getUser(username);
        if (!user) return null;
        const correct = await bcrypt.compare(password, user.password);
        if(user && correct){
            delete user.password;
            return user;
        }
        return null;
    }
}

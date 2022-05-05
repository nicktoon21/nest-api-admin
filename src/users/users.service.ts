import { Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }
  async create({ email, name, password, role, isEnable }: CreateUserDto) {
    const passwordCrypto = hashSync(password, 10);

    let user = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });
    if (user) return "Already exist a user with this email!";
    else
      user = await this.prisma.users.create({
        data: {
          name,
          email,
          password: passwordCrypto,
          role,
          isEnable,
        },
      })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };

  async findAll() {
    let users = await this.prisma.users.findMany({
      where: {
        isEnable: {
          equals: true,
        },
      },
    });

    return users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  };

  async findOne(id: number) {
    let user = await this.prisma.users.findFirst({
      where: {
        id
      }
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEnable: user.isEnable,
    }
  };

  async update(id: number, { name, email, role, isEnable }: UpdateUserDto) {
    let user = await this.prisma.users.findFirst({
      where: {
        id: {
          not: id
        },
        email
      },
    });

    if (user) return 'Email already in use';
    else
      user = await this.prisma.users.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          role,
          isEnable
        }
      });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEnable: user.isEnable,
    };
  };

  async remove(id: number) {
    let user = await this.prisma.users.findFirst({
      where: {
        id,
        isEnable: {
          equals: false,
        }
      }
    })
    if (user) return "User is disabled";
    else
      user = await this.prisma.users.update({
        where: {
          id
        },
        data: {
          isEnable: false,
        }
      });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEnable: user.isEnable,
    }
  };
}

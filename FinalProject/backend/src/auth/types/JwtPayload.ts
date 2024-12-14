import { Role } from './Role';

type JwtPayload = {
  sub: number;
  username: string;
  role: Role;
};

export { JwtPayload };

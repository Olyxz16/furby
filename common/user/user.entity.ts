import { UserRole } from '../auth/role.entity';

export interface User {
  id: number;
  mail: string;
  password: string;       // Bcrypt Hash
  role: UserRole;
  discordUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

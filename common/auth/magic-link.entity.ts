export interface MagicLink {
  id: number;
  userId: number;         // FK -> User.id
  link: string;
  createdAt: Date;
  expiresAt: Date;
}

// 10 minutes from now
export function setExpiry(date: Date = new Date()): Date {
  date.setMinutes(date.getMinutes() + 10);
  return date;
}

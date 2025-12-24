export interface Session {
  id: number;
  userId: number;         // FK -> User.id
  token: string;          // Session Token
  createdAt: Date;
  expiresAt: Date;
}

export function setExpiry(date: Date = new Date()) {
  date.setDate(date.getDate() + 7);
  return date;
}

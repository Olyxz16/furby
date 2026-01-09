export interface CreateSessionDto {
  userId: number;
  token: string;
}

export interface GetSessionByTokenDto {
  token: string;
}

export interface DeleteSessionByTokenDto {
  token: string;
}

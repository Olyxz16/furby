export interface CreateMagicLinkDto {
  userId: number;
  link: string;
}

export interface GetMagicLinkByLinkDto {
  link: string;
}

export interface DeleteMagicLinkByLinkDto {
  link: string;
}

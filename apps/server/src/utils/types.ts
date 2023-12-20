export type TokenData = {
  userId?: string;
  adminRestaurantId?: string; // id of the restaurant associated with token used for login
};

export type TokenPayload = {
  time: string;
  data: TokenData;
};

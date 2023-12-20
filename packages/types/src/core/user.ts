export interface IUserPublic {
  id: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  colorHex?: string;
}

export interface IUserPrivate extends IUserPublic {
  token?: string;
}

export function convertUserPrivateToPublic(user: IUserPrivate): IUserPublic {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    colorHex: user.colorHex,
  };
}

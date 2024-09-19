import { atom } from 'recoil';

export interface IUser {
  id: string;
  name: string;
  email: string;
}

export const userAtom = atom<IUser | null>({
  key: 'userAtom',
  default: null,
});
import { v4 as uuidv4 } from 'uuid';

export const generateTemporaryId = () => {
  return 'local-' + uuidv4();
};

export const isTemporaryId = (id: string) => {
  return id.startsWith('local-');
};

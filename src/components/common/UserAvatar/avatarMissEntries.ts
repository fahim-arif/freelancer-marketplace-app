const ttl = 1000 * 60 * 5; //5min
const makeKey = (userId: string) => `avatarMissEntry_${userId}`;

export const isAvatarMissing = (userId: string) => {
  const key = makeKey(userId);
  const entry: string | null = localStorage.getItem(key);
  if (!entry) {
    return false;
  }

  const expirationTime = parseInt(entry);
  if (new Date().getTime() > expirationTime) {
    localStorage.removeItem(key);
    return false;
  } else {
    return true;
  }
};

export const setMissingAvatar = (userId: string) => {
  const expirationTime = new Date().getTime() + ttl;
  localStorage.setItem(makeKey(userId), expirationTime.toString());
};

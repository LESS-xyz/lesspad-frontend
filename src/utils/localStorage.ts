export const setToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromStorage = (key: string) => {
  const result = localStorage.getItem(key);
  if (result === null) return result;
  return JSON.parse(localStorage.getItem(key) || '');
};

export const storageCache = async (props) => {
  try {
    const { key = 'storageCache', method = () => {}, delay = 0 } = props;
    console.log('LocalStorage storageCache:', props);
    const now = Date.now();
    const expirationTimeKey = `${key}:expirationTime`;
    const expirationTime = getFromStorage(expirationTimeKey);
    let result;
    if (!expirationTime || now >= expirationTime) {
      setToStorage(expirationTimeKey, now + delay);
      result = await method;
      setToStorage(key, result);
      console.log('LocalStorage expired:', expirationTime);
    } else {
      result = getFromStorage(key);
      console.log('LocalStorage not expired:', expirationTime);
    }
    return result;
  } catch (e) {
    console.error('LocalStorage storageCache:', e);
    return null;
  }
};

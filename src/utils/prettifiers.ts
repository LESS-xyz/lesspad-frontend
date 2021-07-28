export const addHttps = (url: string) => {
  let newUrl = url;
  // eslint-disable-next-line no-useless-escape
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    newUrl = `https://${url}`;
  }
  return newUrl;
};

export const addHttps = (url: string) => {
  let newUrl = url;
  // eslint-disable-next-line no-useless-escape
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    newUrl = `https://${url}`;
  }
  return newUrl;
};

export const prettyNumber = (number: string) => {
  const result = number ? Number(number).toFixed(3) : '0';
  const resultIsNan = Number.isNaN(result) ? '0' : result;
  return parseFloat(resultIsNan.toString());
};

// todo: add filter new lines and other
// This will match a single non-ASCII character: [^\x00-\x7F]
export const detectNonLatinLetters = (string: string) => {
  const result = string.match(/[^a-z0-9 !$%^&*()_+|~\-=`{}[\]:";'<>?,./\\@#№]/gi);
  return result;
};

export const filterEmojis = (string: string) => {
  const result = string.replace(/[\u1000-\uFFFF]+/gi, '');
  return result;
};

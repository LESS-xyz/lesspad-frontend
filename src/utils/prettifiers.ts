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
  // const resultFiltered = result === NaN ? '0' : result;
  return parseFloat(result.toString());
};

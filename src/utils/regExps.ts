export const numberRegexp = (str: string) => {
  return str.replace(/[^\d.,]/g, '').replace(/,/g, '.');
};
export const numberIntegerRegexp = (str: string) => {
  return str.replace(/[^\d+$]/g, '');
};
export const addressesRegexp = (str: string) => {
  return str.replace(/[!@#$%^&*()`;.?[\]'":{}|\-\\<>/_+=~ ]/g, '').replace(/ /g, '');
};

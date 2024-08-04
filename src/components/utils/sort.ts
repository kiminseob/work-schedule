export const sortDateAscend = (list: string[]) => {
  return list.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
};

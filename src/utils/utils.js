export function updateStartEndAtIndex(arrayInput, pos, page) {
  const array = [...arrayInput];

  const index = array.findIndex((t) => t.pos === pos);
  if (!pos) {
    return false;
  }
  const oldPage = array[index].page || 0;
  const isGreaterThanBefore = page > oldPage;
  array[index].page = page;

  for (let i = index + 1; i < array.length; i++) {
    const prevPage = array[i - 1].page;
    const nextPage = array[i].page;
    const max = Math.max(prevPage, nextPage);
    array[i].page = isGreaterThanBefore ? max + 1 : max - 1;
  }
  return array;
}

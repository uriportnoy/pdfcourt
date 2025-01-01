export function updateStartEndAtIndex(itemsMapper, id, page) {
  const array = Object.values(itemsMapper);
  if (!id) {
    return false;
  }
  const index = array.findIndex((t) => t.id === id);

  const oldPage = array[index].page || 0;
  const isGreaterThanBefore = page > oldPage;
  array[index].page = page;

  for (let i = index + 1; i < array.length; i++) {
    const prevPage = array[i - 1].page;
    const nextPage = array[i].page;
    const max = Math.max(prevPage, nextPage);
    array[i].page = isGreaterThanBefore ? max + 2 : max - 1;
  }
  return array;
}

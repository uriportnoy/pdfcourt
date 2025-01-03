import { add, getAll, update } from "./crud";

const COLLECTION_NAME = "cases";

export async function getAllCases() {
  const dbCases = await getAll(COLLECTION_NAME);
  return dbCases.sort((a, b) => {
    const dateA = parseDate(a.caseNumber);
    const dateB = parseDate(b.caseNumber);
    return dateA - dateB;
  });
}

const parseDate = (str) => {
  let match;
  if ((match = str.match(/^(\d+)-(\d+)-(\d+)$/))) {
    const [_, number, month, year] = match;
    return new Date(`20${year}-${month.padStart(2, "0")}-01`);
  } else if ((match = str.match(/^(\d+)\/(\d+)$/))) {
    const [_, number, year] = match;
    return new Date(`20${year}-01-01`);
  }
  return null; // Invalid format
};

export async function updateCase(updatedData) {
  if (!updatedData.id) {
    throw new Error("Case ID is required for updating a case.");
  }
  return await update(COLLECTION_NAME, updatedData.id, updatedData);
}

export async function addCase(newCase) {
  return await add(COLLECTION_NAME, newCase);
}

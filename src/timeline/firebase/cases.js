import { add, getAll, update } from "./crud";

const COLLECTION_NAME = "cases";

export async function getAllCases() {
  return await getAll(COLLECTION_NAME);
}

export async function updateCase(updatedData) {
  if (!updatedData.id) {
    throw new Error("Case ID is required for updating a case.");
  }
  return await update(COLLECTION_NAME, updatedData.id, updatedData);
}

export async function addCase(newCase) {
  return await add(COLLECTION_NAME, newCase);
}

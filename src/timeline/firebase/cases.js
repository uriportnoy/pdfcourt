import localCases from "../common/cases.json";
import { add, getAll, update } from "./crud";
import { collection, getFirestore, writeBatch, doc } from "firebase/firestore";

const db = getFirestore();
const COLLECTION_NAME = "cases";

export async function storeLocalCases() {
  const batch = writeBatch(db); // Initialize a batch
  const casesCollection = collection(db, COLLECTION_NAME); // Reference to the `cases` collection

  try {
    localCases.forEach((caseData) => {
      const caseDocRef = doc(casesCollection, caseData.id); // Use `id` as document ID
      batch.set(caseDocRef, caseData); // Add the case to the batch
    });

    await batch.commit(); // Commit the batch
    console.log("All cases have been stored successfully.");
  } catch (error) {
    console.error("Error storing cases:", error);
  }
}

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

import {
  collection,
  doc,
  getDocs,
  getFirestore,
  writeBatch,
} from "firebase/firestore";

export const updateDocuments = async (collectionName, cbData, test = true) => {
  const db = getFirestore();

  if (!collectionName || !cbData) {
    console.error(" ======= EXAMPLE ====== ");
    console.error(`updateDocuments("cases", (data) => {
  const newObj = {};
  newObj.id = data.id;
  newObj.type = data.type;
  newObj.isMyCase = data.relation !== "סרגוסי נ' פורטנוי",
      newObj.appealAccepted = false;
  newObj.description = data.description || "";
  newObj.court = data.court
  return newObj;
}, true)`);
    return;
  }
  const snapshot = await getDocs(collection(db, collectionName));
  const batch = writeBatch(db);

  snapshot.forEach((docSnap) => {
    const newData = cbData(docSnap.data());
    if (!test) {
      batch.update(doc(db, collectionName, docSnap.id), newData);
    }
    console.log("old data", docSnap.data());
    console.log(`applying changes ${collectionName} to`, docSnap.id, newData);
  });
  if (!test) {
    await batch.commit();
  }
  console.log("Documents updated successfully!");
};

// EXAMPLE
// updateDocuments("cases", (data) => {
//   const newObj = {};
//   newObj.id = data.id;
//   newObj.type = data.type;
//   newObj.isMyCase = data.relation !== "סרגוסי נ' פורטנוי",
//       newObj.appealAccepted = false;
//   newObj.description = data.description || "";
//   newObj.court = data.court
//   return newObj;
// }, true)

window.updateDocuments = updateDocuments;

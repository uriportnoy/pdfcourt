const STORAGE_KEY = "court-storage";
const INCLUDES_KEY = "court-includes";

export function getFromStorage(key = STORAGE_KEY) {
  const items = localStorage.getItem(key) || "{}";
  return JSON.parse(items);
}

export function saveInStorage(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function saveMe() {
  localStorage.setItem(
    "court-includes",
    JSON.stringify({
      affidavit: true,
      lawyerSignature: true,
      table: false,
      pages: true,
      lastPageOnly: false,
    }),
  );
}
export function cleanStorage() {
  localStorage.setItem(STORAGE_KEY, "{}");
}

export function saveAllInStorage({ items, includes }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  localStorage.setItem(INCLUDES_KEY, JSON.stringify(includes));
}

window.updateManualStorage = (key, cb) => {
  const storageData = getFromStorage(key);
  const storageArray = Object.values(storageData);

  const result = storageArray.reduce(cb, {});

  localStorage.setItem(key, JSON.stringify(result));
};

window.getData = () => getFromStorage();

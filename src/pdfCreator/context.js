import React, { createContext, useEffect, useState } from "react";
import {
  getFromStorage,
  saveAllInStorage,
  saveInStorage,
} from "./utils/storage";
import { useImmer } from "use-immer";
import { downloadPdfDocument } from "./pdf/generator";

const AppContext = createContext({});

export const Context = ({ children }) => {
  const [items, setItems] = useImmer(() => getFromStorage() || {});
  const [affidavitData, setAffidavitData] = useImmer({
    description: "",
    comment: "",
    dayOffset: 0,
    isRemoted: true,
  });
  const [includes, setIncludes] = useImmer({
    pages: true,
    table: true,
    affidavit: false,
    lawyerSignature: false,
    ...getFromStorage("court-includes"),
  });

  useEffect(() => {
    console.log(items);
  }, [items]);

  const printAffidavit = includes.affidavit;
  const printPages = includes.pages || includes.table;
  const isButtonDisabled =
    (printAffidavit && !affidavitData.lawyer) ||
    (!printAffidavit && !printPages) ||
    (printPages && items.length === 0);

  const itemsList = Object.values(items);
  const onDownload = () => {
    downloadPdfDocument(itemsList, context);
    saveAllInStorage({
      items,
      includes,
    });
  };
  const context = {
    items: itemsList,
    itemsMapper: items,
    setItems,
    affidavitData,
    setAffidavitData,
    isButtonDisabled,
    includes,
    setIncludes,
    printPages,
    printAffidavit,
    download: onDownload,
  };

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};

export const useContext = () => {
  return React.useContext(AppContext);
};

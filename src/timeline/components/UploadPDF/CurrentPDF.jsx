import { deleteObject, getStorage, ref } from "firebase/storage";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import styled from "styled-components";

const deleteFile = async (url) => {
  try {
    const storage = getStorage();
    const fileRef = ref(storage, url);
    return await deleteObject(fileRef);
  } catch (err) {
    console.log(err);
    return null;
  }
};
const CurrentFile = ({ url, label, cb }) => {
  const [isInProgress, setIsInProgress] = useState(false);
  const [text, setText] = useState(label || "");

  return (
    <Wrapper>
      <InputText
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        onBlur={(e) => {
          label !== e.target.value &&
            cb({
              action: "update",
              label: e.target.value,
              url,
            });
        }}
      />
      <textarea disabled defaultValue={url} />
      {isInProgress && <>Deleting...</>}
      <Button
        label={"Delete"}
        onClick={() => {
          setIsInProgress(true);
          deleteFile(url)
            .then(() => {
              cb({
                url,
                action: "delete",
              });
            })
            .finally(() => {
              setIsInProgress(false);
            });
        }}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  textarea {
    width: 100%;
    min-width: 150px;
  }
`;

export default CurrentFile;

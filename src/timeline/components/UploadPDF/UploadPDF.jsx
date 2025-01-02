import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";
import { useState } from "react";
import styled from "styled-components";
import { useImmer } from "use-immer";

function getFileNameAndExtension(fileName) {
  const regex = /^(.*)\.([^.]+)$/;
  const match = fileName.match(regex);
  if (match) {
    return {
      name: match[1].replaceAll(" ", "_"),
      ext: match[2],
    };
  }
  return null;
}
const customFirebaseUploader = ({
  files,
  setProcess,
  cb,
  fileName,
  folderName = "pdfs",
}) => {
  const uploadPromises = files.map((file, index) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const name = `${folderName}/${fileName || file.name}_${index}`;
      const storageRef = ref(storage, name); // Firebase storage reference
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const currentProgress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          setProcess((draft) => {
            draft.value = currentProgress;
            draft.status = `Uploading ${file.name}: ${currentProgress}%`;
          });
        },
        (error) => {
          console.error("Error uploading file:", error);
          setProcess((draft) => {
            draft.value = 0;
            draft.status = `Error uploading ${file.name}`;
          });
          reject(error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at:", downloadUrl);
          setProcess((draft) => {
            draft.value = 100;
            draft.status = `Uploaded ${file.name} successfully!`;
          });
          resolve(downloadUrl);
        }
      );
    });
  });

  Promise.all(uploadPromises)
    .then((downloadUrls) => {
      cb(downloadUrls);
    })
    .catch((error) => {
      console.error("Error uploading one or more files:", error);
    });
};

const AdvancedFileUploader = ({ fileName, label, cb }) => {
  const [isInProgress, setIsInProgress] = useState(false);
  const [text, setText] = useState(label || "");
  const [process, setProcess] = useImmer({
    value: 0,
    status: "",
  });
  const upload = (event) => {
    setIsInProgress(true);
    const files = event.files;
    const { name, ext } = getFileNameAndExtension(files[0].name);
    customFirebaseUploader({
      files,
      setProcess,
      cb: (downloadUrls) => {
        setIsInProgress(false);
        cb({
          label: text,
          url: downloadUrls[0],
        });
      },
      fileName: `${name}_${text}`,
      folderName: ext === "pdf" ? "pdfs" : ext,
    });
  };
  console.log(process);
  return (
    <>
      <Wrapper>
        <InputText
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <FileUpload
          name="file"
          accept="pdf/*"
          maxFileSize={35000000}
          customUpload
          uploadHandler={upload}
          multiple
          // mode="basic"
          uploadLabel={"Upload PDF"}
          chooseLabel={" "}
        />
        {isInProgress && (
          <Loader>
            <ProgressBar value={process.value || 30}>
              <p>Status: {process.status}</p>
            </ProgressBar>
            <div>{`${process.value ?? 0}%`}</div>
          </Loader>
        )}
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  position: relative;
`;

const Loader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  flex-direction: column;
  pointer-events: none;
`;

export default AdvancedFileUploader;

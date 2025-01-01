import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
  deleteObject,
} from "firebase/storage";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";
import { useEffect, useState } from "react";
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
export const customFirebaseUploader = ({
  event,
  setProgress,
  setStatus,
  cb,
  fileName,
  folderName = "pdfs",
}) => {
  const files = event.files; // Files to be uploaded
  const uploadPromises = files.map((file, index) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const name = `${folderName}/${fileName || file.name}_${index}`;
      const storageRef = ref(storage, name); // Firebase storage reference
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress((prevProgress) => ({
            ...prevProgress,
            [file.name]: progress,
          }));
          setStatus((prevStatus) => ({
            ...prevStatus,
            [file.name]: `Uploading ${file.name}: ${progress}%`,
          }));
        },
        (error) => {
          console.error("Error uploading file:", error);
          setStatus((prevStatus) => ({
            ...prevStatus,
            [file.name]: `Error uploading ${file.name}`,
          }));
          reject(error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at:", downloadUrl);
          setStatus((prevStatus) => ({
            ...prevStatus,
            [file.name]: `Uploaded ${file.name} successfully!`,
          }));
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
          text !== e.target.value &&
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
const AdvancedFileUploader = ({ fileName, label, cb }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [isInProgress, setIsInProgress] = useState(false);
  const [text, setText] = useState(label || "");

  const upload = (event) => {
    setIsInProgress(true);
    customFirebaseUploader({
      event,
      setProgress,
      setStatus,
      cb: (downloadUrls) => {
        setIsInProgress(false);
        cb({
          label: text,
          url: downloadUrls[0],
        });
      },
      fileName: `${fileName}_${text}`,
    });
  };
  const progressItemValues = Object.values(progress);
  const overallProgress =
    progressItemValues.reduce((acc, curr) => acc + curr, 0) /
    progressItemValues.length;
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
          maxFileSize={6000000} // Max 1 MB
          customUpload
          uploadHandler={upload}
          multiple
          // mode="basic"
          uploadLabel={"Upload PDF"}
          chooseLabel={" "}
        />
        <div className="loader">
          {isInProgress && (
            <ProgressBar value={overallProgress}>
              <p>Status: {status}</p>
            </ProgressBar>
          )}
        </div>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  gap: 1rem;
`;
export default function ({ urls, fileName, cb }) {
  const [urlsState, setUrlsState] = useState([]);

  useEffect(() => {
    setUrlsState(urls);
  }, [urls]);

  return (
    <UrlsWrapper>
      {urlsState.map(({ label, url }) =>
        url ? (
          <CurrentFile key={label + url} url={url} label={label} cb={cb} />
        ) : (
          <AdvancedFileUploader
            key={label + url}
            label={label}
            fileName={`${fileName}_${urls?.length || 0}`}
            cb={cb}
          />
        )
      )}
      <div className="buttons">
        <Button
          label={"+"}
          onClick={() => {
            setUrlsState((prevUrls) => [
              ...prevUrls,
              { label: "הצג", url: "" },
            ]);
          }}
        />
        <Button
          label={"-"}
          onClick={() => {
            setUrlsState((prevUrls) => prevUrls.slice(0, -1));
          }}
        />
      </div>
    </UrlsWrapper>
  );
}

const UrlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

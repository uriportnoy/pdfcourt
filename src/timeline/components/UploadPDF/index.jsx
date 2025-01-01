import CurrentFile from "./CurrentPDF";
import AdvancedFileUploader from "./UploadPDF";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import styled from "styled-components";

function PDFUploader({ urls, fileName, cb }) {
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

export default PDFUploader;

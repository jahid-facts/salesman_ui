import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export const ExcelFileUpload = ({ setFile }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do something with the accepted files (e.g., upload to server)
      setFile(acceptedFiles);
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: ".xls, .xlsx",
    });

  const dropzoneStyles = {
    border: `2px dashed #cccccc`,
    borderRadius: "4px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
  };

  return (
    <div>
      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the Excel file here...</p>
        ) : (
          <p>
            {acceptedFiles.length > 0
              ? `File selected: ${acceptedFiles[0].name}`
              : "Drag 'n' drop an Excel file here, or click to select one"}
          </p>
        )}
      </div>
      <p style={{ color: "#008000" }}>
        {acceptedFiles.length > 0 && `File selected: ${acceptedFiles[0].name}`}
      </p>
    </div>
  );
};

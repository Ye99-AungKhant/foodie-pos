import { Box } from "@mui/material";
import { useDropzone } from "react-dropzone";

interface Props {
  onDrop: (files: File[]) => void;
}

const FileDropZone = ({ onDrop }: Props) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <Box
      {...getRootProps()}
      sx={{
        borderRadius: 4,
        border: "3px dotted lightgray",
        p: 1,
        cursor: "pointer",
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag and drop some files here, or click to select files</p>
      )}
    </Box>
  );
};

export default FileDropZone;

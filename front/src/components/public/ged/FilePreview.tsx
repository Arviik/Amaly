// components/FilePreview.tsx
import { useState, useEffect } from "react";
import Image from "next/image";

interface FilePreviewProps {
  file: string | null;
  onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose }) => {
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      fetch(file)
        .then((response) => response.blob())
        .then((blob) => setFileType(blob.type))
        .catch(() => setFileType(null));
    }
  }, [file]);

  if (!file) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">File Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
        {fileType?.startsWith("image/") ? (
          <Image
            src={file}
            alt="Preview"
            width={800}
            height={600}
            objectFit="contain"
          />
        ) : fileType === "application/pdf" ? (
          <iframe src={file} className="w-full h-[80vh]" />
        ) : (
          <div className="text-center p-4">
            <p>Preview not available for this file type.</p>
            <a
              href={file}
              download
              className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Download File
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePreview;

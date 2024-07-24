"use client";
import "./Ged.css";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  deleteDocument,
  getAllDocumentsFromOrganization,
  getDocument,
  renameDocument,
  repathDocument,
  uploadDocument,
} from "@/api/services/documents";
import {
  selectCurrentMember,
  selectSelectedOrganizationId,
} from "@/app/store/slices/authSlice";
import { useSelector } from "react-redux";

interface file {
  id: number;
  title: string;
  description: string;
  path: string;
  fileData?: string;
  type: string;
}

interface fileProps {
  file: file;
  accessFileHandler: (path: string) => void;
  renameFileHandler: (id: number, newName: string) => void;
  deleteFileHandler: (id: number) => void;
}

function File({
  file,
  accessFileHandler,
  renameFileHandler,
  deleteFileHandler,
}: fileProps) {
  const [newName, setNewName] = useState(file.title);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const downloadFile = () => {
    getDocument(file.id).then((doc: any) => {
      const a = document.createElement("a");
      a.href = doc.file;
      a.download = doc.document.title;
      a.click();
    });
  };

  useEffect(() => {
    setNewName(file.title);
    setIsEditing(false);
    setConfirmDelete(false);
  }, [file]);

  const selectFile = () => {
    //const folderName = file.title.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, "_");
    accessFileHandler(file.path + file.title);
  };

  let button: ReactElement = <></>;
  switch (file.type) {
    case "file":
      button = <button onClick={downloadFile}>Download</button>;
      break;
    case "folder":
      button = <button onClick={selectFile}>Acces File</button>;
      break;
  }

  const handleRename = () => {
    renameFileHandler(file.id, newName);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteFileHandler(file.id);
    setConfirmDelete(false);
  };

  return (
    <>
      <div className="fileCard">
        {isEditing ? (
          <>
            <input
              type={"text"}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button onClick={handleRename}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <h3>{file.title}</h3>
            <button onClick={() => setIsEditing(true)}>Rename</button>
          </>
        )}
        <p>{file.description}</p>
        {button}
        {confirmDelete ? (
          <>
            <p>Are you sure you want to delete {file.title} ?</p>
            <button onClick={handleDelete}>Yes</button>
            <button
              onClick={() => {
                setConfirmDelete(false);
              }}
            >
              Never mind
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setConfirmDelete(true);
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </>
  );
}

interface fileListProps {
  fileList: file[];
  currentPath: string;
  newFolderHandler: () => void;
  accessFileHandler: (path: string) => void;
  renameFileHandler: (id: number, newName: string) => void;
  deleteFileHandler: (id: number) => void;
  backHandler: () => void;
}

function FileList({
  fileList,
  newFolderHandler,
  accessFileHandler,
  backHandler,
  currentPath,
  renameFileHandler,
  deleteFileHandler,
}: fileListProps) {
  const member = useSelector(selectCurrentMember);

  const onHandleFolder = () => {
    newFolderHandler();
  };

  const onBackHandler = () => {
    backHandler();
  };

  return (
    <>
      <button disabled={currentPath === "/"} onClick={onBackHandler}>
        Back
      </button>
      {member && member.isAdmin ? (
        <button onClick={onHandleFolder}>New Folder +</button>
      ) : null}
      <div id="fileList">
        {fileList.map((item) => (
          <File
            key={item.id} // Add key prop with a unique value
            deleteFileHandler={deleteFileHandler}
            renameFileHandler={renameFileHandler}
            accessFileHandler={accessFileHandler}
            file={{
              id: item.id,
              title: item.title,
              fileData: item.fileData,
              type: item.type,
              path: item.path,
              description: item.description,
            }}
          />
        ))}
      </div>
    </>
  );
}

interface uploadFileProps {
  onDocumentUpload: () => void;
  currentPath: string;
}

function UploadFile({ onDocumentUpload, currentPath }: uploadFileProps) {
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const onUploadFile = async (
    event: React.DragEvent<HTMLDivElement>
  ): Promise<void> => {
    const file: File = event.dataTransfer.files[0];
    event.preventDefault();
    dropZoneRef.current?.classList.remove("drop-active");
    await uploadDocument(file.name, currentPath, file, 1);
    onDocumentUpload();
  };

  function onDragEnter(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dropZoneRef.current?.classList.add("drop-active");
  }

  function onDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dropZoneRef.current?.classList.remove("drop-active");
  }

  function preventEvent(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  return (
    <>
      <form>
        <div
          id="dropZone"
          ref={dropZoneRef}
          onDrop={onUploadFile}
          onDragOver={preventEvent}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
        >
          Upload your file by dragging them inside.
        </div>
      </form>
    </>
  );
}

const Ged: React.FC = () => {
  let [originalData, setOriginalData] = useState<file[]>([]);
  let [data, setData] = useState<file[]>([]);
  let [currentPath, setCurrentPath] = useState<string>("/");
  const member = useSelector(selectCurrentMember);

  const loadDocuments = async () => {
    if (!member) return;
    const result: any = await getAllDocumentsFromOrganization(
      member.organizationId
    );
    const files = result.map((e: any) => ({ ...e, type: "file" }));

    const folderToAdd: Map<string, any> = new Map();
    files
      .filter((e: any) => e.path !== "/")
      .forEach((e: any) => {
        let path = [...e.path.split("/").filter((e: any) => e)];
        let folderName = path.pop();
        let finalPath = "";
        if (path.length > 0) {
          finalPath = path.join("/") + "/";
        }
        let folderMapName = "/" + finalPath + folderName;
        let folder = {
          title: folderName,
          description: "New Folder",
          type: "folder",
          path: "/" + finalPath,
          id: Date.now(),
        };
        folderToAdd.set(folderMapName, folder);
      });

    // @ts-ignore
    const combinedResult = [...files, ...folderToAdd.values()];
    setOriginalData(combinedResult);
    setData(combinedResult.filter((item: any) => item.path === currentPath));
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    updateView();
  }, [currentPath]);

  const onNewFolder = (): void => {
    let finalPath: string = currentPath.endsWith("/")
      ? currentPath
      : currentPath + "/";
    const newFolderList = originalData.filter(
      (item: any) =>
        item.type === "folder" && item.title.startsWith("New Folder")
    );
    const title =
      "New Folder " + (newFolderList.length ? newFolderList.length : "");
    const newFolder = {
      title: title.trim(),
      description: "New Folder",
      type: "folder",
      path: finalPath,
      id: Date.now(),
    };
    const updatedData = [...originalData, newFolder];
    setOriginalData(updatedData);
    setData(updatedData.filter((item: any) => item.path === currentPath));
  };

  const updateView = () => {
    setData(originalData.filter((item: any) => item.path === currentPath));
  };

  const onBack = () => {
    let fileArray = currentPath.split(/(\/)/).filter((item: any) => item);
    if (fileArray.length <= 1) {
      fileArray.pop();
    } else {
      fileArray = fileArray.slice(0, fileArray.length - 2);
    }
    const newPath = fileArray.join("");
    setCurrentPath(newPath);
  };

  const onAccessFile = (path: string): void => {
    setCurrentPath(path + "/");
  };

  const renameFile = async (id: number, newName: string) => {
    const document = originalData.find((item: any) => item.id === id);
    if (!document) {
      return;
    }
    switch (document.type) {
      case "file":
        await renameDocument(id, newName);
        break;
      case "folder":
        const pathToRepath = document.path + document.title + "/";
        const documentsToRepath = originalData.filter(
          (item: any) =>
            item.path.startsWith(pathToRepath) && item.type == "file"
        );
        const newPath = document.path + newName + "/";
        for (const e of documentsToRepath) {
          await repathDocument(e.id, e.path.replace(pathToRepath, newPath));
        }
        break;
      default:
        break;
    }

    await loadDocuments();
  };

  const deleteFile = async (id: number) => {
    const document = originalData.find((item: any) => item.id === id);
    if (!document) {
      return;
    }
    console.log(document);
    switch (document.type) {
      case "file":
        await deleteDocument(id);
        break;
      case "folder":
        const pathToDelete = document.path + document.title + "/";
        const documentsToDelete = originalData.filter(
          (item: any) =>
            item.path.startsWith(pathToDelete) && item.type == "file"
        );
        for (const e of documentsToDelete) {
          await deleteDocument(e.id);
        }
        break;
      default:
        break;
    }

    await loadDocuments();
  };

  return (
    <>
      <button onClick={loadDocuments}>Reload</button>
      <h1>Current Path : {currentPath}</h1>
      <FileList
        deleteFileHandler={deleteFile}
        renameFileHandler={renameFile}
        fileList={data}
        newFolderHandler={onNewFolder}
        accessFileHandler={onAccessFile}
        backHandler={onBack}
        currentPath={currentPath}
      ></FileList>
      {member && member.isAdmin ? (
        <UploadFile
          onDocumentUpload={loadDocuments}
          currentPath={currentPath}
        ></UploadFile>
      ) : null}
    </>
  );
};

export default Ged;

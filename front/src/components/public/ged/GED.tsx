"use client";
import React, { useEffect, useRef, useState, SetStateAction } from "react";

import {
  deleteDocument,
  getAllDocumentsFromOrganization,
  getDocument,
  renameDocument,
  repathDocument,
  uploadDocument,
} from "@/api/services/documents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import {
  FiFolder,
  FiFile,
  FiArrowLeft,
  FiUpload,
  FiTrash2,
  FiEdit2,
} from "react-icons/fi";
import {
  selectCurrentMember,
  selectSelectedOrganizationId,
} from "@/app/store/slices/authSlice";
import { useSelector } from "react-redux";

interface File {
  id: number;
  title: string;
  description: string;
  path: string;
  fileData?: string;
  type: string;
  name: string;
}

interface fileProps {
  file: File;
  accessFileHandler: (path: string) => void;
  renameFileHandler: (id: number, newName: string) => void;
  deleteFileHandler: (id: number) => void;
}

const FileItem: React.FC<{
  file: File;
  accessFileHandler: (path: string) => void;
  renameFileHandler: (id: number, newName: string) => void;
  deleteFileHandler: (id: number) => void;
}> = ({ file, accessFileHandler, renameFileHandler, deleteFileHandler }) => {
  const [newName, setNewName] = useState(file.title);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDownload = async () => {
    try {
      const doc: any = await getDocument(file.id);
      const a = document.createElement("a");
      const filet = new File([doc.file], doc.document.title)
      a.href = URL.createObjectURL(filet);
      a.download = doc.document.title;
      a.click();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download the file.",
        variant: "destructive",
      });
    }
  };

  const handleRename = () => {
    renameFileHandler(file.id, newName);
    setIsEditing(false);
  };

  return (
    <TableRow className="hover:bg-gray-50 transition-colors">
      <TableCell className="font-medium">
        {file.type === "folder" ? (
          <FiFolder className="mr-2 inline text-blue-500" />
        ) : (
          <FiFile className="mr-2 inline text-green-500" />
        )}
        {isEditing ? (
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-40 inline-block"
          />
        ) : (
          file.title
        )}
      </TableCell>
      <TableCell className="text-gray-500">{file.description}</TableCell>
      <TableCell>
        {file.type === "file" ? (
          <Button variant="outline" size="sm" onClick={handleDownload}>
            Download
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => accessFileHandler(file.path + file.title)}
          >
            Open
          </Button>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <>
            <Button variant="ghost" size="sm" onClick={handleRename}>
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <FiEdit2 className="text-blue-500" />
          </Button>
        )}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <FiTrash2 className="text-red-500" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete {file.title}?</p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteFileHandler(file.id);
                  setIsDeleteDialogOpen(false);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const FileList: React.FC<{
  fileList: File[];
  currentPath: string;
  newFolderHandler: () => void;
  accessFileHandler: (path: string) => void;
  renameFileHandler: (id: number, newName: string) => void;
  deleteFileHandler: (id: number) => void;
  backHandler: () => void;
}> = ({
  fileList,
  newFolderHandler,
  accessFileHandler,
  backHandler,
  currentPath,
  renameFileHandler,
  deleteFileHandler,
}) => {
  const member = useSelector(selectCurrentMember);

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gray-50">
        <CardTitle className="flex justify-between items-center">
          <span className="text-xl font-bold">Files - {currentPath}</span>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={backHandler}
              disabled={currentPath === "/"}
              className="mr-2"
            >
              <FiArrowLeft className="mr-2" /> Back
            </Button>
            {member?.isAdmin && (
              <Button variant="outline" size="sm" onClick={newFolderHandler}>
                New Folder
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Name</TableHead>
              <TableHead className="w-[30%]">Description</TableHead>
              <TableHead className="w-[15%]">Action</TableHead>
              <TableHead className="w-[15%]">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fileList.map((item) => (
              <FileItem
                key={item.id}
                file={item}
                accessFileHandler={accessFileHandler}
                renameFileHandler={renameFileHandler}
                deleteFileHandler={deleteFileHandler}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const UploadFile: React.FC<{
  onDocumentUpload: () => void;
  currentPath: string;
}> = ({ onDocumentUpload, currentPath }) => {
  const member = useSelector(selectCurrentMember);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!member) return;
    try {
      await uploadDocument(file.name, currentPath, file, member.organizationId);
      onDocumentUpload();
      toast({
        title: "Success",
        description: "File uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload the file.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mt-4 shadow-md">
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file as unknown as File);
          }}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <FiUpload className="mr-2" /> Choose File
        </Button>
      </CardContent>
    </Card>
  );
};

const Ged: React.FC = () => {
  const [originalData, setOriginalData] = useState<File[]>([]);
  const [data, setData] = useState<File[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("/");
  const member = useSelector(selectCurrentMember);

  const loadDocuments = async () => {
    if (!member) return;
    try {
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
          let finalPath = path.length > 0 ? path.join("/") + "/" : "";
          let folderMapName = "/" + finalPath + folderName;
          let folder = {
            title: folderName,
            description: "Folder",
            type: "folder",
            path: "/" + finalPath,
            id: Date.now() + Math.random(),
            name: folderName,
          };
          folderToAdd.set(folderMapName, folder);
        });

      const combinedResult = [...files, ...Array.from(folderToAdd.values())];
      setOriginalData(combinedResult);
      setData(combinedResult.filter((item: any) => item.path === currentPath));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load documents.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    updateView();
  }, [currentPath]);

  const updateViewHandler = () => {
    setData(originalData.filter((item: any) => item.path === currentPath));
  };

  const onNewFolder = () => {
    let finalPath: string = currentPath.endsWith("/")
      ? currentPath
      : currentPath + "/";
    const newFolderList = originalData.filter(
      (item: any) =>
        item.type === "folder" && item.title.startsWith("New Folder")
    );
    const title = "New Folder " + (newFolderList.length || "");
    const newFolder: File = {
      title: title.trim(),
      description: "New Folder",
      type: "folder",
      path: finalPath,
      id: Date.now() + Math.random(),
      name: title.trim(),
    };
    const updatedData: File[] = [...originalData, newFolder];
    setOriginalData(updatedData);
    setData(
      updatedData.filter(
        (item: any) => item.path === currentPath
      ) as SetStateAction<File[]>
    );
  };
  const onNewFolderHandler = (): void => {
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
      name: title.trim(),
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
    fileArray = fileArray.slice(
      0,
      fileArray.length > 1 ? fileArray.length - 2 : fileArray.length - 1
    );
    const newPath = "/" + fileArray.join("");
    setCurrentPath(newPath);
  };

  const onAccessFile = (path: string) => {
    setCurrentPath(path + "/");
  };

  const renameFile = async (id: number, newName: string) => {
    try {
      const document = originalData.find((item: any) => item.id === id);
      if (!document) return;

      if (document.type === "file") {
        await renameDocument(id, newName);
      } else if (document.type === "folder") {
        const pathToRepath = document.path + document.title + "/";
        const documentsToRepath = originalData.filter(
          (item: any) =>
            item.path.startsWith(pathToRepath) && item.type === "file"
        );
        const newPath = document.path + newName + "/";
        for (const e of documentsToRepath) {
          await repathDocument(e.id, e.path.replace(pathToRepath, newPath));
        }
      }

      await loadDocuments();
      toast({
        title: "Success",
        description: "File renamed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rename the file.",
        variant: "destructive",
      });
    }
  };

  const deleteFile = async (id: number) => {
    try {
      const document = originalData.find((item: any) => item.id === id);
      if (!document) return;

      if (document.type === "file") {
        await deleteDocument(id);
      } else if (document.type === "folder") {
        const pathToDelete = document.path + document.title + "/";
        const documentsToDelete = originalData.filter(
          (item: any) =>
            item.path.startsWith(pathToDelete) && item.type === "file"
        );
        for (const e of documentsToDelete) {
          await deleteDocument(e.id);
        }
      }

      await loadDocuments();
      toast({
        title: "Success",
        description: "File deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Document Management
      </h1>
      <FileList
        fileList={data}
        newFolderHandler={onNewFolder}
        accessFileHandler={onAccessFile}
        backHandler={onBack}
        currentPath={currentPath}
        renameFileHandler={renameFile}
        deleteFileHandler={deleteFile}
      />
      {member?.isAdmin && (
        <UploadFile
          onDocumentUpload={loadDocuments}
          currentPath={currentPath}
        />
      )}
    </div>
  );
};

export default Ged;

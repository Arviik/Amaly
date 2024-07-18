"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateModal, EditModal, DeleteAlert, Field } from "./CrudModals";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: { key: keyof T; header: string }[];
  onCreate: (data: Partial<T>) => void;
  onUpdate: (id: number, data: Partial<T>) => void;
  onDelete: (id: number) => void;
  onResetPassword?: (id: number) => void;
  getColumnValue?: (data: T, column: { key: keyof T; header: string }) => any;
  fields: Field[];
}

export function DataTable<T extends { id: number }>({
  data,
  columns,
  onCreate,
  onUpdate,
  onDelete,
  onResetPassword,
  fields,
  getColumnValue = (data, column) => data[column.key],
}: DataTableProps<T>) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleCreate = (newData: Partial<T>) => {
    onCreate(newData);
    setCreateModalOpen(false);
  };

  const handleUpdate = (updatedData: Partial<T>) => {
    if (selectedItem) {
      onUpdate(selectedItem.id, updatedData);
      setEditModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      onDelete(selectedItem.id);
      setDeleteAlertOpen(false);
    }
  };

  const handleResetPassword = () => {
    if (selectedItem && onResetPassword) {
      onResetPassword(selectedItem.id);
    }
  };

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = sortColumn
    ? [...filteredData].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn])
          return sortDirection === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn])
          return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
    : filteredData;

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Button onClick={() => setCreateModalOpen(true)}>Create New</Button>
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key as string}
                onClick={() => handleSort(column.key)}
              >
                {column.header}
                {sortColumn === column.key ? (
                  sortDirection === "asc" ? (
                    <ChevronUp className="inline ml-1" />
                  ) : (
                    <ChevronDown className="inline ml-1" />
                  )
                ) : (
                  <ChevronsUpDown className="inline ml-1" />
                )}
              </TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item) => (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell key={column.key as string}>
                  {String(getColumnValue(item, column))}
                </TableCell>
              ))}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Actions</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedItem(item);
                        setEditModalOpen(true);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedItem(item);
                        setDeleteAlertOpen(true);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                    {onResetPassword && (
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedItem(item);
                          handleResetPassword();
                        }}
                      >
                        Reset Password
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between mt-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(sortedData.length / itemsPerPage)
            }
          >
            Next
          </Button>
        </div>

        <span>
          Page {currentPage} of {Math.ceil(sortedData.length / itemsPerPage)}
        </span>
      </div>

      <CreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreate}
        fields={fields}
        title="Create New Item"
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleUpdate}
        initialData={selectedItem || {}}
        fields={fields}
        title="Edit Item"
      />

      <DeleteAlert
        isOpen={deleteAlertOpen}
        onClose={() => setDeleteAlertOpen(false)}
        onConfirm={handleDelete}
        itemName="item"
      />
    </div>
  );
}

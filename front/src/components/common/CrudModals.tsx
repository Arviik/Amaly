import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

export interface Field {
  name: string;
  label: string;
  type: string;
  options?: string[];
}

interface ModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<T>) => void;
  fields: Field[];
  title: string;
}

interface CreateModalProps<T> extends ModalProps<T> {}

interface EditModalProps<T> extends ModalProps<T> {
  initialData: Partial<T>;
}

interface DeleteAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

// Render Field function
function RenderField<T>({
  field,
  formData,
  handleChange,
  isCreateMode,
  isEditMode,
}: {
  field: Field;
  formData: Partial<T>;
  handleChange: (name: string, value: any) => void;
  isCreateMode: boolean;
  isEditMode: boolean;
}) {
  switch (field.type) {
    case "select":
      return (
        <Select
          onValueChange={(value) => handleChange(field.name, value)}
          value={formData[field.name as keyof T]?.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${field.label}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={field.name}
            checked={formData[field.name as keyof T] as boolean}
            onCheckedChange={(checked) => handleChange(field.name, checked)}
            disabled={isEditMode}
          />
          <label
            htmlFor={field.name}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {field.label}
          </label>
        </div>
      );
    case "text":
    case "email":
      return (
        <Input
          type={field.type}
          id={field.name}
          name={field.name}
          value={formData[field.name as keyof T]?.toString() || ""}
          onChange={(e) => handleChange(field.name, e.target.value)}
          required
          autoComplete="off"
        />
      );
    case "password":
      return (
        <Input
          type="password"
          id={field.name}
          name={field.name}
          value={formData[field.name as keyof T]?.toString() || ""}
          onChange={(e) => handleChange(field.name, e.target.value)}
          required
          autoComplete="new-password"
          disabled={isCreateMode}
        />
      );
    case "date":
      return (
        <Input
          type="date"
          id={field.name}
          name={field.name}
          //make the format of date input as dd/mm/yyyy
          value={formData[field.name as keyof T]?.toString() || ""}
          onChange={(e) => handleChange(field.name, e.target.value)}
          required
          autoComplete="off"
        />
      );
    default:
      return <p>Field type not implemented</p>;
  }
}

// Create Modal
export function CreateModal<T>({
  isOpen,
  onClose,
  onSubmit,
  fields,
  title,
}: CreateModalProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>(() => {
    const initialData: Partial<T> = {};
    fields.forEach((field) => {
      if (field.name === "password") {
        initialData[field.name as keyof T] = "Amaly123" as any;
      }
    });
    return initialData;
  });

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} className="mb-4">
              {field.type !== "checkbox" && (
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}
                </label>
              )}
              <RenderField
                field={field}
                formData={formData}
                handleChange={handleChange}
                isCreateMode={true}
                isEditMode={false}
              />
            </div>
          ))}
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Edit Modal
export function EditModal<T>({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  fields,
  title,
}: EditModalProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => {
            if (field.type === "password") return null;

            return (
              <div key={field.name} className="mb-4">
                {field.type !== "checkbox" && (
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.label}
                  </label>
                )}
                <RenderField
                  field={field}
                  formData={formData}
                  handleChange={handleChange}
                  isCreateMode={false}
                  isEditMode={true}
                />
              </div>
            );
          })}
          <DialogFooter>
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Delete Alert
export function DeleteAlert({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: DeleteAlertProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <Alert>
          <AlertTitle>
            Are you sure you want to delete this {itemName}?
          </AlertTitle>
          <AlertDescription>
            This action cannot be undone. This will permanently delete the{" "}
            {itemName} and remove all associated data.
          </AlertDescription>
        </Alert>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

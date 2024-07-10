import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Field {
  name: string;
  label: string;
  type: "text" | "email" | "select";
  options?: string[];
}

interface CreateModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<T>) => void;
  fields: Field[];
  title?: string;
  submitLabel?: string;
}

const CreateModal = <T extends object>({
  isOpen,
  onClose,
  onSubmit,
  fields,
  title = "Create",
  submitLabel = "Create",
}: CreateModalProps<T>) => {
  const [formData, setFormData] = useState<Partial<T>>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-1">
              <label htmlFor={field.name} className="block text-sm font-medium">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={(formData[field.name as keyof T] as string) || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={(formData[field.name as keyof T] as string) || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              )}
            </div>
          ))}
          <DialogFooter>
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateModal;

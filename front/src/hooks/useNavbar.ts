"use client";
import { useState, useCallback } from "react";

export const useNavbar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleNavbar = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, toggleNavbar };
};

"use client";
import { useState, useCallback } from "react";

const useNavbar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleNavbar = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, toggleNavbar };
};

export default useNavbar;

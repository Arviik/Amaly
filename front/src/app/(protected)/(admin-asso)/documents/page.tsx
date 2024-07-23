import React from "react";
import Ged from "@/components/public/ged/GED";

interface Document {
  id: number;
  name: string;
  description: string;
}

const DocumentManagementPage: React.FC = () => {

  return (
      <Ged></Ged>
  );
};

export default DocumentManagementPage;

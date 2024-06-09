import React from "react";

const MembersPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-primary">Gestion des Membres</h1>
      <p className="mt-2 text-secondary">
        Ici, vous pouvez gérer tous les membres de votre administration.
      </p>
      {/* Ici, vous pouvez ajouter plus de fonctionnalités comme la liste des membres, les actions pour ajouter, supprimer ou modifier un membre */}
    </div>
  );
};

export default MembersPage;

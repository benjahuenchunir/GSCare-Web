import React, { useState } from "react";

interface CreateThreadFormProps {
  onSubmit: (title: string, description: string) => void;
  onCancel: () => void;
}

const CreateThreadForm: React.FC<CreateThreadFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg p-6 border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-[#00495C] mb-4">
        Crear Nuevo Hilo
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009982]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009982]"
            required
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!title.trim() || !description.trim()}
          className="bg-[#009982] text-white px-6 py-2 rounded-lg hover:bg-[#007a6b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Crear
        </button>
      </div>
    </form>
  );
};

export default CreateThreadForm;

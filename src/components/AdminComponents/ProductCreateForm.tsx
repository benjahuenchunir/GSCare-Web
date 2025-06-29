import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { createProducto, aprobarProducto } from "../../services/adminService";
import { Plus, Info, ShoppingCart } from "lucide-react";

interface ProductCreateFormProps {
  onUpdate: () => void;
}

const initialState = {
  nombre: "",
  descripcion: "",
  categoria: "",
  marca: "",
  nombre_del_vendedor: "",
  link_al_producto: "",
  imagen: "",
};

export default function ProductCreateForm({ onUpdate }: ProductCreateFormProps) {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      // 1. Crear el producto
      const nuevoProducto = await createProducto(formState, token);
      // 2. Aprobar el producto recién creado
      await aprobarProducto(nuevoProducto.id, token);
      
      onUpdate();
      setFormState(initialState); // Reset form
      alert("Producto creado y aprobado exitosamente.");
    } catch (error) {
      console.error("Error al crear el producto:", error);
      alert("No se pudo crear el producto. Revisa la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (name: keyof typeof initialState, label: string, placeholder: string, type = "text", required = true) => (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input
        type={type}
        name={name}
        value={formState[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none border-gray-300"
        required={required}
      />
    </label>
  );

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Plus className="w-6 h-6" />
        Crear Nuevo Producto
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <Section title="Información Principal" icon={<Info />}>
          <div className="grid md:grid-cols-2 gap-4">
            {renderInput("nombre", "Nombre del producto", "Ej: Zapatillas de casa")}
            {renderInput("marca", "Marca", "Ej: ComfortStep")}
            <div className="md:col-span-2">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">Descripción</span>
                <textarea
                  name="descripcion"
                  value={formState.descripcion}
                  onChange={handleChange}
                  placeholder="Ej: Zapatillas cómodas y seguras para el hogar"
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none border-gray-300"
                  required
                />
              </label>
            </div>
            {renderInput("categoria", "Categoría", "Ej: Calzado")}
            {renderInput("imagen", "URL de Imagen", "https://ejemplo.com/imagen.jpg", "url", false)}
          </div>
           {/* Vista previa de imagen */}
           {formState.imagen && /^https?:\/\/.+\..+/.test(formState.imagen) && (
            <div className="mt-4 text-center">
              <img
                src={formState.imagen}
                alt="Vista previa del producto"
                className="max-h-40 mx-auto rounded-md border"
              />
              <p className="text-xs text-gray-500 mt-1">Vista previa de la imagen</p>
            </div>
          )}
        </Section>

        <Section title="Detalles del Vendedor y Enlace" icon={<ShoppingCart />}>
          <div className="grid md:grid-cols-2 gap-4">
            {renderInput("nombre_del_vendedor", "Nombre del vendedor", "Ej: Tienda del Abuelo")}
            {renderInput("link_al_producto", "Link al producto", "https://tienda.com/producto", "url")}
          </div>
        </Section>
        
        <div className="flex justify-end border-t pt-6 mt-6">
          <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg bg-[#009982] text-white font-semibold hover:bg-[#007c6b] disabled:bg-gray-400">
            {loading ? "Creando..." : "Crear Producto"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="border-t border-gray-200 pt-6 first-of-type:border-t-0 first-of-type:pt-0">
      <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2 mb-4">{icon} {title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

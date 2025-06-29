// Página de formulario de edición de los datos del usuario ya registrado
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { getUserByEmail, updateUserProfile, deleteCurrentUser, User } from "../../services/userService";
import { getAllUsers } from "../../services/adminService";
import regionesData from "../../assets/data/comunas-regiones.json";
import RoleSwitcherButton from "../../components/RoleSwitcherButton";

export default function EditProfilePage() {
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const [form, setForm] = useState<User>({
    id: 0,
    nombre: "",
    email: "",
    fecha_de_nacimiento: "",
    region_de_residencia: "",
    comuna_de_residencia: "",
    rol: ""
  });

  const [communeList, setCommuneList] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const regionList = regionesData.regions.map(region => region.name);

  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email).then(data => {
        setForm({
          id: data.id,
          nombre: data.nombre || "",
          email: data.email,
          fecha_de_nacimiento: data.fecha_de_nacimiento || "",
          region_de_residencia: data.region_de_residencia || "",
          comuna_de_residencia: data.comuna_de_residencia || "",
          rol: data.rol
        });
      });
    }
  }, [user]);

  useEffect(() => {
    const selectedRegion = regionesData.regions.find(
      r => r.name === form.region_de_residencia
    );
    setCommuneList(selectedRegion ? selectedRegion.communes.map(c => c.name) : []);
  }, [form.region_de_residencia]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: "" }));
    setSuccessMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!form.fecha_de_nacimiento) newErrors.fecha_de_nacimiento = "Fecha de nacimiento es obligatoria.";
    if (!form.region_de_residencia) newErrors.region_de_residencia = "Debes seleccionar una región.";
    if (!form.comuna_de_residencia) newErrors.comuna_de_residencia = "Debes seleccionar una comuna.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const {rol, ...safeData} = form; // Excluimos el rol del objeto
      await updateUserProfile(safeData as User, token);
      navigate(rol === "administrador" ? "/admin" : "/user");
    } catch (err) {
      console.error("Error al obtener token:", err);
      setErrors({ general: "No se pudo obtener el token. Intenta iniciar sesión nuevamente." });
    }
  };

  const handleDeleteAccount = async () => {
  if (
    window.confirm(
      "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
    )
  ) {
    try {
      const token = await getAccessTokenSilently();

      // Verificamos si es admin y si hay más
      if (form.rol === "administrador") {
        const allUsers = await getAllUsers(token);
        const adminCount = allUsers.filter(u => u.rol === "administrador").length;

        if (adminCount <= 1) {
          alert("No puedes eliminar tu cuenta porque eres el único administrador.");
          return;
        }
      }

      await deleteCurrentUser(token, form.id);

      logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    } catch (err) {
      console.error("Error al eliminar la cuenta:", err);
      setErrors({
        general: "No se pudo eliminar la cuenta. Intenta más tarde.",
      });
    }
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-16 pb-20 px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow max-w-md w-full space-y-4"
      >
        <h2 className="text-[2em] font-bold mb-4">Editar perfil</h2>

        {errors["general"] && <p className="text-red-600 mb-4">{errors["general"]}</p>}
        {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

        <label className="block">
          Correo electrónico
          <input
            name="email"
            value={form.email}
            disabled
            className="mt-1 w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
          />
        </label>

        <label className="block">
          Nombre completo *
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {errors["nombre"] && <p className="text-[1em] text-red-600 mt-1">{errors["nombre"]}</p>}
        </label>

        <label className="block">
          Fecha de nacimiento *
          <input
            type="date"
            name="fecha_de_nacimiento"
            value={form.fecha_de_nacimiento}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {errors["fecha_de_nacimiento"] && (
            <p className="text-[1em] text-red-600 mt-1">{errors["fecha_de_nacimiento"]}</p>
          )}
        </label>

        <label className="block">
          Región *
          <select
            name="region_de_residencia"
            value={form.region_de_residencia}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2 bg-white"
          >
            <option value="">Selecciona una región</option>
            {regionList.map(regionName => (
              <option key={regionName} value={regionName}>
                {regionName}
              </option>
            ))}
          </select>
          {errors["region_de_residencia"] && (
            <p className="text-[1em] text-red-600 mt-1">{errors["region_de_residencia"]}</p>
          )}
        </label>

        <label className="block">
          Comuna *
          <select
            name="comuna_de_residencia"
            value={form.comuna_de_residencia}
            onChange={handleChange}
            disabled={communeList.length === 0}
            className="mt-1 w-full border rounded px-3 py-2 bg-white disabled:bg-gray-100"
          >
            <option value="">
              {communeList.length ? "Selecciona una comuna" : "Primero selecciona una región"}
            </option>
            {communeList.map(comuna => (
              <option key={comuna} value={comuna}>
                {comuna}
              </option>
            ))}
          </select>
          {errors["comuna_de_residencia"] && (
            <p className="text-[1em] text-red-600 mt-1">{errors["comuna_de_residencia"]}</p>
          )}
        </label>

        <button
          type="submit"
          className="w-full mt-6 px-6 py-3 bg-primary1 text-white font-semibold rounded-lg hover:bg-primary2 transition"
        >
          Guardar cambios
        </button>
        <div className="mt-6 border-t pt-4 space-y-2">
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
          >
            Eliminar cuenta
          </button>
        </div>
        {/* Nuevo recuadro para cancelar suscripción */}
        {form.rol === "socio" && (
          <div className="mt-8 bg-yellow-100 border border-yellow-400 rounded-lg p-4 text-center">
            <p className="mb-2 text-yellow-800 font-semibold">
              ¿Deseas cancelar tu suscripción de socio?
            </p>
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="bg-yellow-400 text-black hover:bg-yellow-600 font-semibold px-4 py-2 rounded transition"
              disabled={isCancelling}
            >
              Cancelar mi suscripción
            </button>
          </div>
        )}
      </form>
      {/* Modal de confirmación de cancelación de suscripción */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-sm p-6 relative">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Cerrar"
            >
              <span className="text-2xl font-bold">&times;</span>
            </button>
            <h2 className="text-[1.2em] font-semibold text-yellow-700 mb-2">Lamentamos perderte</h2>
            <p className="text-[1em] text-gray-700 mb-6">
              ¿Estás seguro de que deseas cancelar tu suscripción de socio? Perderás acceso a los beneficios exclusivos.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-md hover:bg-gray-200"
                disabled={isCancelling}
              >
                No, mantener
              </button>
              <RoleSwitcherButton
                profile={form}
                targetRole="gratis"
                label={isCancelling ? "Cancelando..." : "Sí, cancelar"}
                className="bg-yellow-400 text-black hover:bg-yellow-600 font-semibold px-4 py-2 rounded transition"
                // Al hacer click, cerrar el modal y mostrar loading
                // El propio RoleSwitcherButton recarga el perfil y muestra alert
                // Para UX, deshabilitamos botones mientras cambia
                {...{
                  onClick: async (e: any) => {
                    e.preventDefault();
                    setIsCancelling(true);
                    try {
                      // RoleSwitcherButton maneja el cambio y reloadProfile
                      // Esperamos un poco para UX
                      await new Promise(res => setTimeout(res, 500));
                      setShowCancelModal(false);
                    } finally {
                      setIsCancelling(false);
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

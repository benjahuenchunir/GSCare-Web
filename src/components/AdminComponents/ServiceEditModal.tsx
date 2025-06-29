import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { updateServicio } from "../../services/adminService";
import { Servicio } from "../../pages/Admin/AdminServicesPage";

interface Props {
  servicio: Servicio;
  onClose: () => void;
  onUpdate: () => void;
}

const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default function ServiceEditModal({ servicio, onClose, onUpdate }: Props) {
  const { getAccessTokenSilently } = useAuth0();
  const [form, setForm] = useState({
    ...servicio,
    dias_disponibles: typeof (servicio.dias_disponibles as any) === 'string'
      ? (servicio.dias_disponibles as any).split(',').map(Number)
      : servicio.dias_disponibles || []
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      ...servicio,
      dias_disponibles: typeof (servicio.dias_disponibles as any) === 'string'
        ? (servicio.dias_disponibles as any).split(',').map(Number)
        : servicio.dias_disponibles || []
    });
  }, [servicio]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDiasChange = (dia: number) => {
    setForm(prev => {
      const dias = prev.dias_disponibles;
      if (dias.includes(dia)) {
        return { ...prev, dias_disponibles: dias.filter((d: number) => d !== dia) };
      } else {
        return { ...prev, dias_disponibles: [...dias, dia].sort() };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getAccessTokenSilently();
      const dataToUpdate = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        prestador_del_servicio: form.prestador_del_servicio,
        direccion_principal_del_prestador: form.direccion_principal_del_prestador,
        hace_domicilio: form.hace_domicilio,
        comunas_a_las_que_hace_domicilio: form.comunas_a_las_que_hace_domicilio,
        telefono_de_contacto: form.telefono_de_contacto,
        email_de_contacto: form.email_de_contacto,
        imagen: form.imagen,
        hora_inicio: form.hora_inicio,
        hora_termino: form.hora_termino,
        dias_disponibles: form.dias_disponibles.join(','),
      };
      await updateServicio(form.id, dataToUpdate, token);
      onUpdate();
      onClose();
    } catch (err) {
      alert("Error al actualizar el servicio");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Editar Servicio: <span className="text-primary1">{servicio.nombre}</span></h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vista previa de imagen */}
          {form.imagen && /^https?:\/\/.+\..+/.test(form.imagen) && (
            <div className="col-span-full text-center">
              <img
                src={form.imagen}
                alt="Vista previa del servicio"
                className="max-h-40 mx-auto rounded-md border"
              />
              <p className="text-xs text-gray-500 mt-1">Vista previa de la imagen</p>
            </div>
          )}
          <label className="block col-span-full">URL de imagen<input name="imagen" value={form.imagen} onChange={handleChange} className="w-full border px-3 py-2 mt-1 rounded" /></label>
          <label className="block">Nombre<input name="nombre" value={form.nombre} onChange={handleChange} className="w-full border px-3 py-2 mt-1 rounded" /></label>
          <label className="block">Prestador<input name="prestador_del_servicio" value={form.prestador_del_servicio} onChange={handleChange} className="w-full border px-3 py-2 mt-1 rounded" /></label>
          <label className="block col-span-full">Descripción<textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border px-3 py-2 mt-1 rounded" rows={3} /></label>
          <label className="block">Dirección<input name="direccion_principal_del_prestador" value={form.direccion_principal_del_prestador} onChange={handleChange} className="w-full border px-3 py-2 mt-1 rounded" /></label>
          <label className="block">Teléfono<input name="telefono_de_contacto" value={form.telefono_de_contacto} onChange={handleChange} className="w-full border px-3 py-2 mt-1 rounded" /></label>
          <label className="block">Email<input name="email_de_contacto" value={form.email_de_contacto} onChange={handleChange} className="w-full border px-3 py-2 mt-1 rounded" /></label>
          
          <div className="col-span-full grid grid-cols-2 gap-4">
            <label className="block">Horario atención (inicio)<input type="time" name="hora_inicio" value={form.hora_inicio?.slice(0, 5) || ''} onChange={handleChange} className="w-full border px-3 py-2 mt-1 rounded" /></label>
            <label className="block">Horario atención (fin)<input type="time" name="hora_termino" value={form.hora_termino?.slice(0, 5) || ''} onChange={handleChange} className="w-full border px-3 py-2 mt-1 rounded" /></label>
          </div>

          <div className="col-span-full">
            <span className="block text-sm font-medium text-gray-700 mb-2">Días de atención</span>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
              {diasSemana.map((nombre, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => handleDiasChange(index)}
                  className={`p-2 text-sm rounded-lg border-2 ${form.dias_disponibles.includes(index) ? 'bg-primary1 text-white border-primary1' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {nombre.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-full flex items-center gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" name="hace_domicilio" checked={form.hace_domicilio} onChange={handleChange} /><span>Hace domicilio</span></label>
            {form.hace_domicilio && (<label className="block flex-1">Comunas<input name="comunas_a_las_que_hace_domicilio" value={form.comunas_a_las_que_hace_domicilio} onChange={handleChange} className="w-full border px-3 py-2 mt-1 rounded" /></label>)}
          </div>
          <div className="col-span-full flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">Cancelar</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-primary1 text-white hover:bg-primary2 rounded">{saving ? "Guardando..." : "Guardar cambios"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react"
import { getConfig, updateConfig, Config } from "../../firebase/configService"
import { Contact, Share2, LayoutTemplate } from "lucide-react";

export default function AdminConfigPage() {
  const [config, setConfig] = useState<Config>({
    contactPhone: "",
    contactEmail: "",
    address: "",
    landingTitle: "",
    landingSubtitle: "",
    landingImage: "",
    socialLinks: { facebook: "", instagram: "", x: "", linkedin: "" },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getConfig().then((data) => {
      if (data) setConfig({ ...config, ...data })
      setLoading(false)
    })
  }, [])

  const handleChange = (key: keyof Config, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const handleSocialChange = (network: keyof NonNullable<Config["socialLinks"]>, value: string) => {
    setConfig((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [network]: value },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    await updateConfig(config)
    setSaving(false)
    alert("Configuración guardada correctamente.")
    window.location.href = "/admin"
  }


  if (loading) return <p className="p-4 text-gray-500">Cargando configuración...</p>

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto font-sans">
      <h1 className="text-2xl font-bold text-gray-800">Configuración de Contenido Público</h1>

      {/* Sección: Información de contacto */}
      <div className="bg-white shadow rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
          <Contact className="w-5 h-5 text-gray-500" />
          Información de Contacto
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Teléfono" value={config.contactPhone} onChange={(v) => handleChange("contactPhone", v)} />
          <Input label="Correo electrónico" value={config.contactEmail} onChange={(v) => handleChange("contactEmail", v)} />
          <Input label="Dirección" value={config.address} onChange={(v) => handleChange("address", v)} />
        </div>
      </div>

      {/* Sección: Redes sociales */}
      <div className="bg-white shadow rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-gray-500" />
          Redes Sociales
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Facebook" value={config.socialLinks?.facebook ?? ""} onChange={(v) => handleSocialChange("facebook", v)} />
          <Input label="Instagram" value={config.socialLinks?.instagram ?? ""} onChange={(v) => handleSocialChange("instagram", v)} />
          <Input label="X (Twitter)" value={config.socialLinks?.x ?? ""} onChange={(v) => handleSocialChange("x", v)} />
          <Input label="LinkedIn" value={config.socialLinks?.linkedin ?? ""} onChange={(v) => handleSocialChange("linkedin", v)} />
        </div>
      </div>

      {/* Sección: Landing Page */}
      <div className="bg-white shadow rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5 text-gray-500" />
          Información de la Página Inicial
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Título" value={config.landingTitle} onChange={(v) => handleChange("landingTitle", v)} />
          <Input label="URL Imagen" value={config.landingImage} onChange={(v) => handleChange("landingImage", v)} />
        </div>
        <div>
          <Input label="Subtítulo" value={config.landingSubtitle} onChange={(v) => handleChange("landingSubtitle", v)} />
        </div>
      </div>

      {/* Vista previa del Hero */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
        <h2 className="font-semibold text-lg mb-4 text-gray-800">Vista Previa</h2>
        <div className="aspect-[4/2.5] max-w-4xl mx-auto overflow-hidden rounded-xl shadow-lg flex flex-col lg:flex-row font-[Poppins]">
          <div className="w-full lg:w-1/2 bg-gray-200 flex flex-col justify-center pl-10 pr-6 py-8">
            <h1 className="text-[#006881] font-bold text-[2.1em] lg:text-[2.1em] leading-tight">
              {config.landingTitle || "Mejorando la Calidad de Vida de Nuestros Mayores"}
            </h1>
            <p className="text-[#4B5563] text-[1.2em] leading-snug mt-3">
              {config.landingSubtitle || "Brindamos compañía, apoyo y cuidado personalizado para adultos mayores, permitiéndoles mantener su independencia y bienestar."}
            </p>
            <div className="flex flex-col sm:flex-row text-[1em] gap-4 mt-5">
              <div className="px-4 py-4 bg-a7 text-[0.9em] text-white font-semibold hover:bg-a7/80 rounded-lg transition flex justify-center items-center">
                Explorar Servicios
              </div>
              <div className="px-4 py-4 bg-secondary2 text-[1em] text-white font-semibold rounded-lg hover:bg-secondary2/80 transition flex justify-center items-center">
                Crear cuenta
              </div>
            </div>
          </div>
          <div
            className="w-full lg:w-1/2 bg-cover bg-center"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(220, 13%, 91%) 0%, rgba(229, 231, 235, 0.31) 25%, rgba(0, 0, 0, 0) 50%, rgba(215, 215, 215, 0) 50%),
                url('${config.landingImage}')
              `
            }}
          />
        </div>
      </div>

      {/* Botón guardar */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-3 bg-primary1 text-white rounded-lg font-semibold hover:bg-primary1/80 transition"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  )
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009982]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
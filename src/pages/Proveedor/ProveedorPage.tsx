import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import UserIcon from '../../assets/Person.svg?react';
import QuickAccessButton from "../../common/QuickAccessButton";

export default function ProveedorPage() {
  const navigate = useNavigate();
  const { profile, loading } = useContext(UserContext);

  if (loading) {
    return <p className="text-center mt-10">Cargando perfil…</p>;
  }

  const userName = profile?.nombre || "Proveedor";

  return (
    <main className="flex-1 pt-24 pb-12 bg-gray-100">
      <div className="w-full px-6 py-8 space-y-8">
        <div className="flex justify-center mb-6">
          <h1 className="text-[2.5em] font-bold text-primary">Hola, {userName}!</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="sm:col-start-2">
                <QuickAccessButton 
                    icon={<UserIcon className="w-8 h-8 text-accent2" />} 
                    label="Mi perfil" 
                    onClick={() => navigate("/edit-profile")} 
                />
            </div>
        </div>
      </div>
    </main>
  );
}

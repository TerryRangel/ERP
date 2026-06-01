import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../../services/api';
import { productService } from '../../services/productService';
import { suppliersService } from '../../services/suppliersService';

export default function SettingsModal({ isOpen, onClose }) {
  const { user } = useAuth(); 
  
  const [activeView, setActiveView] = useState('main'); 
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [notificationsAlerts, setNotificationsAlerts] = useState(true);

  const [profileForm, setProfileForm] = useState({ 
    nombre: '', 
    email: '',
    usuario: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      setNotificationsAlerts(localStorage.getItem('erp_notifications') !== 'false');
      
      setProfileForm(prev => ({
        ...prev,
        nombre: user?.nombre || '', 
        email: user?.email || '',
        usuario: user?.usuario || '',
        currentPassword: '', newPassword: '', confirmPassword: ''
      }));

      // Si el usuario ya tiene una foto, se muestra
      setAvatarPreview(user?.fotoPerfil || null);
      setSelectedFile(null);
      
      setActiveView('main');
      setSuccessMsg('');
      setErrorMsg('');
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen, user]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleToggleNotifications = () => {
    const newValue = !notificationsAlerts;
    setNotificationsAlerts(newValue);
    localStorage.setItem('erp_notifications', newValue);
    window.dispatchEvent(new Event('notificationsChanged'));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file)); // Crea vista previa temporal
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    
    try {
      if (profileForm.newPassword) {
        if (profileForm.newPassword !== profileForm.confirmPassword) {
          setIsLoading(false);
          return setErrorMsg('Las contraseñas nuevas no coinciden.');
        }
        if (!profileForm.currentPassword) {
          setIsLoading(false);
          return setErrorMsg('Debes ingresar tu contraseña actual.');
        }
      }

      const payload = {
        nombre: profileForm.nombre,
        email: profileForm.email,
        usuario: profileForm.usuario
      };

      if (profileForm.newPassword) {
        payload.currentPassword = profileForm.currentPassword;
        payload.password = profileForm.newPassword;
      }

      if (selectedFile) {
        const formDataCloudinary = new FormData();
        formDataCloudinary.append("file", selectedFile);
        
        formDataCloudinary.append("upload_preset", "Foto_perfil"); 

        const cloudinaryRes = await fetch(
          "https://api.cloudinary.com/v1_1/dsbwrorlk/image/upload", 
          {
            method: "POST",
            body: formDataCloudinary,
          }
        );

        const cloudinaryData = await cloudinaryRes.json();

        if (cloudinaryData.secure_url) {
          payload.fotoPerfil = cloudinaryData.secure_url;
        } else {
          throw new Error("Hubo un problema al subir la imagen a Cloudinary.");
        }
      }

      await api.patch(`/users/${user.id || user._id}`, payload);

      showSuccess('Perfil actualizado correctamente');
      setProfileForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      setSelectedFile(null);
      
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'Error al actualizar el perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBusiness = (e) => {
    e.preventDefault();
    localStorage.setItem('erp_facebook', businessForm.facebook);
    localStorage.setItem('erp_instagram', businessForm.instagram);
    showSuccess('Redes sociales guardadas');
  };

  const downloadCSV = (filename, dataArray) => {
    if (!dataArray || dataArray.length === 0) {
      setErrorMsg("No hay datos para exportar.");
      return;
    }
    const headers = Object.keys(dataArray[0]).join(",");
    const rows = dataArray.map(obj => Object.values(obj).map(val => `"${val}"`).join(",")).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess(`Archivo ${filename}.csv descargado`);
  };

  const handleExportData = async (moduleName) => {
    setIsLoading(true);
    setErrorMsg('');
    let realData = [];

    try {
      if (moduleName === 'usuarios') {
        const res = await api.get("/users");
        realData = res.data?.items || res.data || [];
      } 
      else if (moduleName === 'clientes') {
        const res = await api.get("/clients"); 
        realData = res.data?.items || res.data || [];
      } 
      else if (moduleName === 'productos' || moduleName === 'inventario') {
        realData = await productService.getAll();
      }
      else if (moduleName === 'proveedores') {
        const res = await suppliersService.getSuppliers();
        realData = res.items || res || [];
      }

      downloadCSV(moduleName, realData);
    } catch (err) {
      setErrorMsg('Error al exportar ' + moduleName);
    } finally {
      setIsLoading(false);
    }
  };

  const SettingsRow = ({ icon, title, isToggle, toggleValue, onClick, isLast }) => (
    <div className="flex items-center justify-between p-3 sm:p-4 bg-white hover:bg-[#F9F7F2] active:bg-[#E8E4DE] transition-colors cursor-pointer" onClick={onClick}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#F4F6EE] border border-[#E8E4DE] flex items-center justify-center text-[#8B9467] flex-shrink-0">
          <i className={`bi ${icon} text-lg`}></i>
        </div>
        <span className="text-[#4A453E] font-medium text-[15px]">{title}</span>
      </div>
      {isToggle ? (
        <div className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors duration-300 ${toggleValue ? 'bg-[#8B9467]' : 'bg-[#D1D5DB]'}`}>
          <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${toggleValue ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </div>
      ) : <i className="bi bi-chevron-right text-[#8C867E] text-sm font-bold"></i>}
      {!isLast && <div className="absolute bottom-0 right-0 left-[52px] h-[1px] bg-[#E8E4DE]"></div>}
    </div>
  );

  const TopBar = ({ title }) => (
    <div className="shrink-0 flex items-center justify-center p-5 pt-6 pb-4 bg-[#F9F7F2] relative border-b border-[#E8E4DE]">
      {activeView !== 'main' && (
        <button type="button" onClick={() => setActiveView('main')} className="absolute left-5 flex items-center gap-1 text-[#8B9467] font-medium hover:text-[#5F6F52] bg-transparent border-none cursor-pointer">
          <i className="bi bi-chevron-left"></i> Volver
        </button>
      )}
      <h2 className="text-lg font-bold text-[#4A453E] m-0">{title}</h2>
      {activeView === 'main' && (
        <button type="button" onClick={onClose} className="absolute right-5 w-8 h-8 flex items-center justify-center rounded-full bg-[#E8E4DE] text-[#4A453E] hover:bg-[#D6D2C4] transition-colors border-none cursor-pointer">
          <i className="bi bi-x-lg text-sm font-bold"></i>
        </button>
      )}
    </div>
  );

  const StatusAlerts = () => (
    <div className="shrink-0 px-6 pt-4">
      {isLoading && <div className="p-3 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold flex items-center justify-center"><i className="bi bi-arrow-repeat animate-spin mr-2"></i> Procesando...</div>}
      {successMsg && <div className="p-3 bg-[#EEF2E7] border border-[#B8BE9C] text-[#5F6F52] rounded-xl text-sm font-semibold flex items-center justify-center gap-2"><i className="bi bi-check-circle-fill"></i> {successMsg}</div>}
      {errorMsg && <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-center"><i className="bi bi-exclamation-triangle-fill"></i> {errorMsg}</div>}
    </div>
  );

  const renderMainView = () => (
    <div className="flex flex-col h-full w-full">
      <TopBar title="Ajustes" />
      <div className="flex-1 min-h-0 p-4 sm:p-5 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        <div>
          <p className="text-xs font-semibold text-[#8C867E] uppercase tracking-wider mb-2 ml-2">Cuenta</p>
          <div className="rounded-2xl overflow-hidden border border-[#E8E4DE] relative shadow-sm">
            <SettingsRow icon="bi-person-badge" title="Mi Perfil y Seguridad" onClick={() => setActiveView('profile')} />
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#8C867E] uppercase tracking-wider mb-2 ml-2">Sistema y Datos</p>
          <div className="rounded-2xl overflow-hidden border border-[#E8E4DE] relative shadow-sm">
            <SettingsRow icon="bi-cloud-download" title="Exportar BD (CSV)" onClick={() => setActiveView('export')} />
            <SettingsRow icon="bi-bell" title="Notificaciones Push" isToggle toggleValue={notificationsAlerts} onClick={handleToggleNotifications} isLast />
          </div>
        </div>
        <div>
          <div className="rounded-2xl overflow-hidden border border-[#E8E4DE] relative shadow-sm">
            <SettingsRow icon="bi-question-circle" title="Ayuda y Soporte" onClick={() => setActiveView('support')} isLast />
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileView = () => (
    <div className="flex flex-col h-full w-full">
      <TopBar title="Mi Perfil" />
      <StatusAlerts />
      <form onSubmit={handleSaveProfile} className="flex-1 min-h-0 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
        
        {/* FOTO DE PERFIL INTERACTIVA */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="w-24 h-24 rounded-full bg-[#8d9b70] text-white flex items-center justify-center text-4xl font-bold shadow-md overflow-hidden relative group cursor-pointer border-4 border-white">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (profileForm.nombre.charAt(0) || "U").toUpperCase()
            )}
            
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <i className="bi bi-camera-fill text-xl text-white"></i>
            </div>
            
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
          </div>
          <p className="text-[10px] text-[#8C867E] !mt-2 uppercase tracking-widest font-bold">Cambiar Foto</p>
        </div>
        
        {/* DATOS PERSONALES */}
        <div className="flex flex-col gap-4 shrink-0">
          <h3 className="text-sm font-bold text-[#4A453E] border-b border-[#E8E4DE] pb-1 m-0">Datos Personales</h3>
          
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 w-1/2">
              <label className="text-xs font-semibold text-[#8C867E] ml-1">Nombre</label>
              <input type="text" required value={profileForm.nombre} onChange={(e) => setProfileForm({...profileForm, nombre: e.target.value})} className="w-full !px-4 !py-3 rounded-xl border border-[#E8E4DE] outline-none focus:border-[#8d9b70] text-[#4A453E] bg-white transition-colors" />
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <label className="text-xs font-semibold text-[#8C867E] ml-1">Usuario</label>
              <div className="relative">
                <i className="bi bi-at absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input type="text" required value={profileForm.usuario} onChange={(e) => setProfileForm({...profileForm, usuario: e.target.value})} className="w-full !pl-9 !pr-4 !py-3 rounded-xl border border-[#E8E4DE] outline-none focus:border-[#8d9b70] text-[#4A453E] bg-white transition-colors" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#8C867E] ml-1">Correo Electrónico</label>
            <div className="relative">
              <i className="bi bi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="email" required value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="w-full !pl-11 !pr-4 !py-3 rounded-xl border border-[#E8E4DE] outline-none focus:border-[#8d9b70] text-[#4A453E] bg-white transition-colors" />
            </div>
          </div>
        </div>
        
        {/* SEGURIDAD */}
        <div className="flex flex-col gap-4 shrink-0">
          <h3 className="text-sm font-bold text-[#4A453E] border-b border-[#E8E4DE] pb-1 m-0 flex justify-between items-center">
            Cambiar Contraseña
            <span className="text-[10px] font-bold tracking-widest text-[#8C867E] uppercase bg-[#E8E4DE] px-2 py-0.5 rounded-md">Opcional</span>
          </h3>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#8C867E] ml-1">Contraseña Actual</label>
            <input type="password" required={profileForm.newPassword !== ''} value={profileForm.currentPassword} onChange={(e) => setProfileForm({...profileForm, currentPassword: e.target.value})} className="w-full !px-4 !py-3 rounded-xl border border-[#E8E4DE] bg-white outline-none focus:border-[#8d9b70] text-[#4A453E] transition-colors" placeholder="••••••••" />
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 w-1/2">
              <label className="text-xs font-semibold text-[#8C867E] ml-1">Nueva Contraseña</label>
              <input type="password" value={profileForm.newPassword} onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})} className="w-full !px-4 !py-3 rounded-xl border border-[#E8E4DE] bg-white outline-none focus:border-[#8d9b70] text-[#4A453E] transition-colors" placeholder="Nueva..." />
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <label className="text-xs font-semibold text-[#8C867E] ml-1">Confirmar</label>
              <input type="password" value={profileForm.confirmPassword} onChange={(e) => setProfileForm({...profileForm, confirmPassword: e.target.value})} className="w-full !px-4 !py-3 rounded-xl border border-[#E8E4DE] bg-white outline-none focus:border-[#8d9b70] text-[#4A453E] transition-colors" placeholder="Confirmar..." />
            </div>
          </div>
        </div>
        
        <div className="mt-auto shrink-0 !pt-4 !pb-2">
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full !bg-[#8d9b70] !text-white font-bold py-3.5 rounded-xl transition-all duration-300 hover:!bg-[#7c8b61] hover:scale-[1.02] hover:shadow-lg active:scale-95 disabled:!bg-gray-400 disabled:!opacity-50 disabled:cursor-not-allowed border-none cursor-pointer flex items-center justify-center gap-2"
          >
            <i className="bi bi-person-check-fill text-lg"></i> 
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );

  const renderExportView = () => (
    <div className="flex flex-col h-full w-full">
      <TopBar title="Exportar Bases de Datos" />
      <StatusAlerts />
      <div className="flex-1 min-h-0 p-6 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => handleExportData('usuarios')} disabled={isLoading} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[#E8E4DE] bg-white hover:bg-[#F9F7F2] text-[#4A453E] cursor-pointer transition-colors">
            <i className="bi bi-people text-2xl text-[#8B9467]"></i><span className="font-semibold text-sm">Usuarios</span>
          </button>
          <button onClick={() => handleExportData('clientes')} disabled={isLoading} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[#E8E4DE] bg-white hover:bg-[#F9F7F2] text-[#4A453E] cursor-pointer transition-colors">
            <i className="bi bi-person-vcard text-2xl text-[#8B9467]"></i><span className="font-semibold text-sm">Clientes</span>
          </button>
          <button onClick={() => handleExportData('productos')} disabled={isLoading} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[#E8E4DE] bg-white hover:bg-[#F9F7F2] text-[#4A453E] cursor-pointer transition-colors">
            <i className="bi bi-bag text-2xl text-[#8B9467]"></i><span className="font-semibold text-sm">Productos</span>
          </button>
          <button onClick={() => handleExportData('proveedores')} disabled={isLoading} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[#E8E4DE] bg-white hover:bg-[#F9F7F2] text-[#4A453E] cursor-pointer transition-colors">
            <i className="bi bi-truck text-2xl text-[#8B9467]"></i><span className="font-semibold text-sm">Proveedores</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSupportView = () => (
    <div className="flex flex-col h-full w-full">
      <TopBar title="Ayuda y Soporte" />
      <div className="flex-1 min-h-0 p-6 flex flex-col gap-5 overflow-y-auto custom-scrollbar items-center text-center">
        <div className="w-16 h-16 shrink-0 rounded-full bg-[#EEF2E7] text-[#8B9467] flex items-center justify-center text-3xl mb-2"><i className="bi bi-headset"></i></div>
        <div className="shrink-0">
          <h3 className="text-[#4A453E] font-bold text-lg m-0 mb-1">¿Necesitas ayuda?</h3>
        </div>
        <div className="w-full shrink-0 flex flex-col gap-3 mt-2">
          <a href="https://wa.me/524621614240" target="_blank" rel="noreferrer" className="w-full bg-[#25D366] !text-white font-bold py-3.5 rounded-xl hover:bg-[#20bd5a] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 border-none cursor-pointer flex items-center justify-center gap-2 no-underline">
            <i className="bi bi-whatsapp text-xl"></i> Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle backdrop-blur-sm" data-theme="light" onCancel={onClose}>
      <div className="modal-box !bg-[#F9F7F2] sm:rounded-[2rem] !p-0 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh] font-['Inter',sans-serif]">
        {activeView === 'main' && renderMainView()}
        {activeView === 'profile' && renderProfileView()}
        {activeView === 'export' && renderExportView()}
        {activeView === 'support' && renderSupportView()}
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
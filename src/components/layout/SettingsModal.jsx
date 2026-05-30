import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../../services/api';
import { productService } from '../../services/productService';
import { suppliersService } from '../../services/suppliersService';

export default function SettingsModal({ isOpen, onClose }) {
  const { user, logout } = useAuth(); 
  
  const [activeView, setActiveView] = useState('main'); 
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsAlerts, setNotificationsAlerts] = useState(true);

  const [profileForm, setProfileForm] = useState({ 
    nombre: '', 
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [businessForm, setBusinessForm] = useState({ 
    storeName: '', receiptMessage: '', rfc: '', phone: '', address: '', currency: 'MXN'
  });

  useEffect(() => {
    if (isOpen) {
      setIsDarkMode(localStorage.getItem('erp_dark_mode') === 'true');
      setNotificationsAlerts(localStorage.getItem('erp_notifications') !== 'false');
      
      setProfileForm(prev => ({
        ...prev,
        nombre: user?.nombre || '', 
        email: user?.email || '',
        currentPassword: '', newPassword: '', confirmPassword: ''
      }));

      setBusinessForm({
        storeName: localStorage.getItem('erp_store_name') || 'Tejidos a Mano',
        receiptMessage: localStorage.getItem('erp_receipt_msg') || '¡Gracias por tu compra!',
        rfc: localStorage.getItem('erp_rfc') || '',
        phone: localStorage.getItem('erp_phone') || '',
        address: localStorage.getItem('erp_address') || '',
        currency: localStorage.getItem('erp_currency') || 'MXN'
      });
      
      setActiveView('main');
      setSuccessMsg('');
      setErrorMsg('');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleToggleDarkMode = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    localStorage.setItem('erp_dark_mode', newValue);
    if (newValue) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleToggleNotifications = () => {
    const newValue = !notificationsAlerts;
    setNotificationsAlerts(newValue);
    localStorage.setItem('erp_notifications', newValue);
    window.dispatchEvent(new Event('notificationsChanged'));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (profileForm.newPassword) {
      if (profileForm.newPassword !== profileForm.confirmPassword) {
        return setErrorMsg('Las contraseñas nuevas no coinciden.');
      }
      if (!profileForm.currentPassword) {
        return setErrorMsg('Debes ingresar tu contraseña actual.');
      }

      setIsLoading(true);
      try {
        await api.patch(`/users/${user.id || user._id}`, {
          currentPassword: profileForm.currentPassword,
          password: profileForm.newPassword
        });

        showSuccess('Contraseña actualizada');
        setProfileForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Error al actualizar la contraseña.');
      } finally {
        setIsLoading(false);
      }
    } else {
      showSuccess('Perfil actualizado');
    }
  };

  const handleSaveBusiness = (e) => {
    e.preventDefault();
    localStorage.setItem('erp_store_name', businessForm.storeName);
    localStorage.setItem('erp_receipt_msg', businessForm.receiptMessage);
    localStorage.setItem('erp_rfc', businessForm.rfc);
    localStorage.setItem('erp_phone', businessForm.phone);
    localStorage.setItem('erp_address', businessForm.address);
    localStorage.setItem('erp_currency', businessForm.currency);
    showSuccess('Datos del negocio guardados');
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

  const handleLogout = () => {
    onClose();
    logout();
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
    <div className="flex items-center justify-center p-5 pt-6 pb-4 bg-[#F9F7F2] relative border-b border-[#E8E4DE]">
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
    <>
      {isLoading && <div className="mx-6 mt-4 p-3 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold flex items-center justify-center"><i className="bi bi-arrow-repeat animate-spin mr-2"></i> Procesando...</div>}
      {successMsg && <div className="mx-6 mt-4 p-3 bg-[#EEF2E7] border border-[#B8BE9C] text-[#5F6F52] rounded-xl text-sm font-semibold flex items-center justify-center gap-2"><i className="bi bi-check-circle-fill"></i> {successMsg}</div>}
      {errorMsg && <div className="mx-6 mt-4 p-3 bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-center"><i className="bi bi-exclamation-triangle-fill"></i> {errorMsg}</div>}
    </>
  );

  const renderMainView = () => (
    <>
      <TopBar title="Ajustes" />
      <div className="p-4 sm:p-5 overflow-y-auto flex flex-col gap-6">
        <div>
          <p className="text-xs font-semibold text-[#8C867E] uppercase tracking-wider mb-2 ml-2">Cuenta</p>
          <div className="rounded-2xl overflow-hidden border border-[#E8E4DE] relative shadow-sm">
            <SettingsRow icon="bi-person-badge" title="Mi Perfil y Seguridad" onClick={() => setActiveView('profile')} />
            <SettingsRow icon="bi-shop-window" title="Datos del Negocio" onClick={() => setActiveView('business')} isLast />
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#8C867E] uppercase tracking-wider mb-2 ml-2">Sistema y Datos</p>
          <div className="rounded-2xl overflow-hidden border border-[#E8E4DE] relative shadow-sm">
            <SettingsRow icon="bi-cloud-download" title="Exportar BD (CSV)" onClick={() => setActiveView('export')} />
            <SettingsRow icon="bi-moon-stars" title="Modo Oscuro" isToggle toggleValue={isDarkMode} onClick={handleToggleDarkMode} />
            <SettingsRow icon="bi-bell" title="Notificaciones Push" isToggle toggleValue={notificationsAlerts} onClick={handleToggleNotifications} isLast />
          </div>
        </div>
        <div>
          <div className="rounded-2xl overflow-hidden border border-[#E8E4DE] relative shadow-sm">
            <SettingsRow icon="bi-question-circle" title="Ayuda y Soporte" onClick={() => setActiveView('support')} />
            <SettingsRow icon="bi-box-arrow-right" title="Cerrar Sesión" onClick={handleLogout} isLast />
          </div>
        </div>
      </div>
    </>
  );

  const renderProfileView = () => (
    <>
      <TopBar title="Mi Perfil" />
      <StatusAlerts />
      <form onSubmit={handleSaveProfile} className="p-6 flex flex-col gap-5 overflow-y-auto">
        <div className="flex justify-center relative group cursor-pointer w-max mx-auto">
           <div className="w-20 h-20 rounded-full bg-[#8B9467] text-white flex items-center justify-center text-3xl font-bold shadow-md">
             {(profileForm.nombre.charAt(0) || "U").toUpperCase()}
           </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-[#4A453E] border-b border-[#E8E4DE] pb-1 m-0">Seguridad de la Cuenta</h3>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#8C867E] ml-1">Contraseña Actual</label>
            <input type="password" required={profileForm.newPassword !== ''} value={profileForm.currentPassword} onChange={(e) => setProfileForm({...profileForm, currentPassword: e.target.value})} className="p-3 rounded-xl border border-[#E8E4DE] bg-white outline-none focus:border-[#8B9467] text-[#4A453E]" />
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 w-1/2">
              <label className="text-xs font-semibold text-[#8C867E] ml-1">Nueva Contraseña</label>
              <input type="password" value={profileForm.newPassword} onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})} className="p-3 rounded-xl border border-[#E8E4DE] bg-white outline-none focus:border-[#8B9467] text-[#4A453E]" />
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <label className="text-xs font-semibold text-[#8C867E] ml-1">Confirmar</label>
              <input type="password" value={profileForm.confirmPassword} onChange={(e) => setProfileForm({...profileForm, confirmPassword: e.target.value})} className="p-3 rounded-xl border border-[#E8E4DE] bg-white outline-none focus:border-[#8B9467] text-[#4A453E]" />
            </div>
          </div>
        </div>
        <button type="submit" disabled={isLoading} className="mt-2 w-full bg-[#8B9467] text-white font-bold py-3.5 rounded-xl hover:bg-[#7A8258] disabled:bg-gray-400 transition-colors border-none cursor-pointer">
          <i className="bi bi-shield-check"></i> Actualizar Seguridad
        </button>
      </form>
    </>
  );

  const renderBusinessView = () => (
    <>
      <TopBar title="Datos del Negocio" />
      <StatusAlerts />
      <form onSubmit={handleSaveBusiness} className="p-6 flex flex-col gap-4 overflow-y-auto">
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 w-2/3">
            <label className="text-xs font-semibold text-[#8C867E] ml-1">Nombre</label>
            <input type="text" required value={businessForm.storeName} onChange={(e) => setBusinessForm({...businessForm, storeName: e.target.value})} className="p-3 rounded-xl border border-[#E8E4DE] outline-none focus:border-[#8B9467]" />
          </div>
          <div className="flex flex-col gap-1 w-1/3">
            <label className="text-xs font-semibold text-[#8C867E] ml-1">Moneda</label>
            <select value={businessForm.currency} onChange={(e) => setBusinessForm({...businessForm, currency: e.target.value})} className="p-3 rounded-xl border border-[#E8E4DE] bg-white outline-none focus:border-[#8B9467]">
              <option value="MXN">MXN</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#8C867E] ml-1">Teléfono o WhatsApp</label>
          <input type="text" value={businessForm.phone} onChange={(e) => setBusinessForm({...businessForm, phone: e.target.value})} className="p-3 rounded-xl border border-[#E8E4DE] outline-none focus:border-[#8B9467]" />
        </div>
        <button type="submit" className="mt-2 w-full bg-[#8B9467] text-white font-bold py-3.5 rounded-xl hover:bg-[#7A8258] border-none cursor-pointer">
          Guardar Configuración
        </button>
      </form>
    </>
  );

  const renderExportView = () => (
    <>
      <TopBar title="Exportar Bases de Datos" />
      <StatusAlerts />
      <div className="p-6 flex flex-col gap-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => handleExportData('usuarios')} disabled={isLoading} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#E8E4DE] bg-white hover:bg-[#F9F7F2] text-[#4A453E] cursor-pointer">
            <i className="bi bi-people text-2xl text-[#8B9467]"></i><span className="font-semibold text-sm">Usuarios</span>
          </button>
          <button onClick={() => handleExportData('clientes')} disabled={isLoading} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#E8E4DE] bg-white hover:bg-[#F9F7F2] text-[#4A453E] cursor-pointer">
            <i className="bi bi-person-vcard text-2xl text-[#8B9467]"></i><span className="font-semibold text-sm">Clientes</span>
          </button>
          <button onClick={() => handleExportData('productos')} disabled={isLoading} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#E8E4DE] bg-white hover:bg-[#F9F7F2] text-[#4A453E] cursor-pointer">
            <i className="bi bi-bag text-2xl text-[#8B9467]"></i><span className="font-semibold text-sm">Productos</span>
          </button>
          <button onClick={() => handleExportData('proveedores')} disabled={isLoading} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#E8E4DE] bg-white hover:bg-[#F9F7F2] text-[#4A453E] cursor-pointer">
            <i className="bi bi-truck text-2xl text-[#8B9467]"></i><span className="font-semibold text-sm">Proveedores</span>
          </button>
        </div>
      </div>
    </>
  );

  const renderSupportView = () => (
    <>
      <TopBar title="Ayuda y Soporte" />
      <div className="p-6 flex flex-col gap-5 overflow-y-auto items-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#EEF2E7] text-[#8B9467] flex items-center justify-center text-3xl mb-2"><i className="bi bi-headset"></i></div>
        <div>
          <h3 className="text-[#4A453E] font-bold text-lg m-0 mb-1">¿Necesitas ayuda?</h3>
        </div>
        <div className="w-full flex flex-col gap-3 mt-2">
          <a href="https://wa.me/524621614240" target="_blank" rel="noreferrer" className="w-full bg-[#25D366] text-white font-bold py-3.5 rounded-xl hover:bg-[#20bd5a] transition-colors border-none cursor-pointer flex items-center justify-center gap-2 no-underline">
            <i className="bi bi-whatsapp text-lg"></i> Contactar por WhatsApp
          </a>
        </div>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 transition-opacity font-['Inter',sans-serif]">
      <div className="bg-[#F9F7F2] sm:rounded-[2rem] rounded-t-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        {activeView === 'main' && renderMainView()}
        {activeView === 'profile' && renderProfileView()}
        {activeView === 'business' && renderBusinessView()}
        {activeView === 'export' && renderExportView()}
        {activeView === 'support' && renderSupportView()}
      </div>
    </div>
  );
}
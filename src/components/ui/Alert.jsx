import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ConfirmAlert({
  isOpen,
  onClose,
  onConfirm,
  title = "¿Estás seguro?",
  message = "Esta acción no se puede deshacer.",
  confirmText = "Sí, continuar",
  cancelText = "Cancelar",
  type = "danger", // Opciones: 'danger', 'warning', 'info', 'success'
  isLoading = false
}) {
  if (!isOpen) return null;

  // Paleta de colores dinámica según el tipo de alerta
  const config = {
    danger: {
      icon: "bi-exclamation-triangle-fill",
      iconColor: "text-red-500",
      iconBg: "bg-red-100",
      btnBg: "bg-red-500 hover:bg-red-600 shadow-red-200",
    },
    warning: {
      icon: "bi-exclamation-circle-fill",
      iconColor: "text-orange-500",
      iconBg: "bg-orange-100",
      btnBg: "bg-orange-500 hover:bg-orange-600 shadow-orange-200",
    },
    info: {
      icon: "bi-info-circle-fill",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100",
      btnBg: "bg-blue-500 hover:bg-blue-600 shadow-blue-200",
    },
    success: {
      icon: "bi-check-circle-fill",
      iconColor: "text-[#8d9b70]",
      iconBg: "bg-[#EEF1E7]",
      btnBg: "bg-[#8d9b70] hover:bg-[#7c8b61] shadow-[#EEF1E7]",
    }
  };

  const current = config[type] || config.danger;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        className="bg-[#fcfcf9] w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-[#d1d5db] overflow-hidden animate-fade-in-up"
      >
        <div className="p-8 text-center">
          
          {/* ICONO */}
          <div className={`w-24 h-24 mx-auto rounded-[2rem] flex items-center justify-center mb-6 shadow-sm ${current.iconBg}`}>
            <i className={`bi ${current.icon} text-5xl ${current.iconColor}`}></i>
          </div>

          {/* TEXTOS */}
          <h2 className="text-2xl font-black text-[#1F2937] mb-3">
            {title}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {message}
          </p>

          {/* BOTONES */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`btn border-none text-white rounded-2xl shadow-lg font-bold w-full uppercase tracking-widest ${current.btnBg}`}
            >
              {isLoading ? <span className="loading loading-spinner"></span> : confirmText}
            </button>
            
            <button
              onClick={onClose}
              disabled={isLoading}
              className="btn bg-gray-100 border-none rounded-2xl text-gray-600 hover:bg-gray-200 font-bold w-full"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";

export default function ClientFormModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        nombre: "",
        rfc: "",
        email: "",
        telefono: "",
        direccion: "",
        contacto: "",
        notas: "",
        activo: true,
    });

    const [loading, setLoading] = useState(false);



    useEffect(() => {

        if (initialData) {
          setForm({
            nombre: initialData.nombre || "",
            rfc: initialData.rfc || "",
            email: initialData.email || "",
            telefono: initialData.telefono || "",
            direccion: initialData.direccion || "",
            contacto: initialData.contacto || "",
            notas: initialData.notas || "",
            activo: initialData.activo || true,
          });
        } else {
          setForm({
            nombre: "",
            rfc: "",
            email: "",
            telefono: "",
            direccion: "",
            contacto: "",
            notas: "",
            activo: true,
          });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
      try{
        setLoading(true);
        await onSubmit(form);
        onClose();
      } catch (error) {
        console.error(error);
      
      } finally {
        setLoading(false);
      }
    };

    return (

    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm px-4 py-10">
      <div className="min-h-full flex items-start justify-center pt-12">
        <div
          className="
            w-full max-w-3xl
            bg-white
            rounded-[36px]
            border border-[#E5EBDD]
            shadow-2xl
            overflow-hidden
            animate-[fadeIn_.2s_ease]
          "
        >

          {/* HEADER */}
          <div className="px-8 py-6 border-b border-[#EEF2E7] flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#DDE8CF] to-[#8FA878] text-[#5F6F52] flex items-center justify-center shadow-sm border border-[#D4DFC5]">
                <i className="bi bi-person-vcard-fill text-2xl"></i>
              </div>

              <div>
                <p className="uppercase tracking-[0.3em] text-xs font-bold text-[#7E8B63]">
                  Gestión ERP
                </p>

                <h2 className="text-3xl font-black text-[#1F2937] leading-none mt-1">
                  {initialData ? "Editar Cliente" : "Nuevo Cliente"}
                </h2>
              </div>

            </div>

            <button
              onClick={onClose}
              className="
                w-11 h-11
                rounded-2xl
                bg-gray-100
                text-gray-500
                hover:bg-red-100
                hover:text-red-500
                transition-all
              "
            >
              <i className="bi bi-x-lg"></i>
            </button>

          </div>

          {/* BODY */}
          <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto">

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* NOMBRE */}
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-3">
                  Nombre
                </label>

                <input
                  type="text"
                  placeholder=" Nombre del cliente"
                  value={form.nombre}
                  onChange={(e) =>
                    setForm({ ...form, nombre: e.target.value })
                  }
                  className="
                    w-full h-[56px]
                    rounded-2xl
                    border border-[#E5EBDD]
                    bg-[#FAFBF8]
                    px-5
                    outline-none
                    text-sm
                    font-medium
                    focus:border-[#7E8B63]
                    focus:ring-4
                    focus:ring-[#7E8B63]/10
                    transition-all
                  "
                />
              </div>

              {/* RFC */}
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-3">
                  RFC
                </label>

                <input
                  type="text"
                  placeholder=" RFC"
                  value={form.rfc}
                  onChange={(e) =>
                    setForm({ ...form, rfc: e.target.value })
                  }
                  className="
                    w-full h-[56px]
                    rounded-2xl
                    border border-[#E5EBDD]
                    bg-[#FAFBF8]
                    px-5
                    outline-none
                    text-sm
                    font-medium
                    focus:border-[#7E8B63]
                    focus:ring-4
                    focus:ring-[#7E8B63]/10
                    transition-all
                  "
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-3">
                  Email
                </label>

                <input
                  type="email"
                  placeholder=" correo@ejemplo.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="
                    w-full h-[56px]
                    rounded-2xl
                    border border-[#E5EBDD]
                    bg-[#FAFBF8]
                    px-5
                    outline-none
                    text-sm
                    font-medium
                    focus:border-[#7E8B63]
                    focus:ring-4
                    focus:ring-[#7E8B63]/10
                    transition-all
                  "
                />
              </div>

              {/* TELEFONO */}
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-3">
                  Teléfono
                </label>

                <input
                  type="text"
                  placeholder=" Número telefónico"
                  value={form.telefono}
                  onChange={(e) =>
                    setForm({ ...form, telefono: e.target.value })
                  }
                  className="
                    w-full h-[56px]
                    rounded-2xl
                    border border-[#E5EBDD]
                    bg-[#FAFBF8]
                    px-5
                    outline-none
                    text-sm
                    font-medium
                    focus:border-[#7E8B63]
                    focus:ring-4
                    focus:ring-[#7E8B63]/10
                    transition-all
                  "
                />
              </div>

            </div>

            {/* DIRECCION */}
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-3">
                Dirección
              </label>

              <input
                type="text"
                placeholder=" Dirección del cliente"
                value={form.direccion}
                onChange={(e) =>
                  setForm({ ...form, direccion: e.target.value })
                }
                className="
                  w-full h-[56px]
                  rounded-2xl
                  border border-[#E5EBDD]
                  bg-[#FAFBF8]
                  px-5
                  outline-none
                  text-sm
                  font-medium
                  focus:border-[#7E8B63]
                  focus:ring-4
                  focus:ring-[#7E8B63]/10
                  transition-all
                "
              />
            </div>

            {/* CONTACTO */}
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-3">
                Persona de contacto
              </label>

              <input
                type="text"
                placeholder=" Contacto"
                value={form.contacto}
                onChange={(e) =>
                  setForm({ ...form, contacto: e.target.value })
                }
                className="
                  w-full h-[56px]
                  rounded-2xl
                  border border-[#E5EBDD]
                  bg-[#FAFBF8]
                  px-5
                  outline-none
                  text-sm
                  font-medium
                  focus:border-[#7E8B63]
                  focus:ring-4
                  focus:ring-[#7E8B63]/10
                  transition-all
                "
              />
            </div>

            {/* NOTAS */}
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-3">
                Notas
              </label>

              <textarea
                rows="4"
                placeholder=" Notas adicionales"
                value={form.notas}
                onChange={(e) =>
                  setForm({ ...form, notas: e.target.value })
                }
                className="
                  w-full
                  rounded-2xl
                  border border-[#E5EBDD]
                  bg-[#FAFBF8]
                  px-5 py-4
                  outline-none
                  text-sm
                  font-medium
                  resize-none
                  focus:border-[#7E8B63]
                  focus:ring-4
                  focus:ring-[#7E8B63]/10
                  transition-all
                "
              />
            </div>

          </div>

          {/* FOOTER */}
          <div className="px-8 py-6 border-t border-[#EEF2E7] flex justify-end gap-4 bg-[#FAFBF8]">

            <button
              onClick={onClose}
              className="
                h-[54px]
                px-7
                rounded-2xl
                border border-[#E5EBDD]
                bg-white
                text-gray-600
                font-semibold
                hover:bg-gray-50
                transition-all
              "
            >
              Cancelar
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
                h-[54px]
                px-8
                rounded-2xl
                bg-gradient-to-r
                from-[#8FA878]
                to-[#718355]
                text-white
                font-semibold
                shadow-lg
                hover:opacity-90
                transition-all
                disabled:opacity-50
              "
            >
              {loading
                ? "Guardando..."
                : initialData
                ? "Actualizar Cliente"
                : "Crear Cliente"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
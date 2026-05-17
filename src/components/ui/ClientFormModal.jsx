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

    useEffect(() => {
        if (initialData) setForm(initialData);
    }, [initialData]);

    if (!isOpen) return null;

    return (
        
        <div className="modal modal-open">
      <div className="modal-box">

        <h3 className="font-bold text-lg">
          {initialData ? "Editar Cliente" : "Nuevo Cliente"}
        </h3>

        <div className="space-y-2 mt-4">

          <input className="input input-bordered w-full"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />

          <input className="input input-bordered w-full"
            placeholder="RFC"
            value={form.rfc || ""}
            onChange={(e) => setForm({ ...form, rfc: e.target.value })}
          />

          <input className="input input-bordered w-full"
            placeholder="Email"
            value={form.email || ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input className="input input-bordered w-full"
            placeholder="Teléfono"
            value={form.telefono || ""}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />

          <input className="input input-bordered w-full"
            placeholder="Dirección"
            value={form.direccion || ""}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />

          <input className="input input-bordered w-full"
            placeholder="Contacto"
            value={form.contacto || ""}
            onChange={(e) => setForm({ ...form, contacto: e.target.value })}
          />

          <textarea className="textarea textarea-bordered w-full"
            placeholder="Notas"
            value={form.notas || ""}
            onChange={(e) => setForm({ ...form, notas: e.target.value })}
          />

        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>Cancelar</button>

          <button
            className="btn btn-primary"
            onClick={() => {
              onSubmit(form);
              onClose();
            }}
          >
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
}
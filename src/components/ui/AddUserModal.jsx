import React, { useState } from "react";
import api from "../../services/api";

import "bootstrap-icons/font/bootstrap-icons.css";

export default function AddUserModal({
  isOpen,
  onClose,
  onUserAdded,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    usuario: "",
    password: "",
    role: "USER",
    permissions: ["auth:me", "dashboard:read"],
    activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      await api.post("/users", formData);

      onUserAdded();
      onClose();

      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        usuario: "",
        password: "",
        role: "USER",
        permissions: ["auth:me", "dashboard:read"],
        activo: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al crear el usuario."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50

        flex items-center justify-center

        bg-black/40
        backdrop-blur-sm

        p-3 sm:p-5
      "
    >
      {/* MODAL */}
      <div
        className="
          bg-white

          w-full
          max-w-lg

          rounded-[1.8rem] sm:rounded-[2rem]

          shadow-2xl

          border border-[#E6EBDA]

          overflow-hidden

          animate-[fadeIn_.2s_ease]

          max-h-[95vh]
          overflow-y-auto
        "
      >
        {/* HEADER */}
        <div
          className="
            px-5 sm:px-8
            py-5 sm:py-6

            border-b border-[#EEF1E7]

            bg-gradient-to-r
            from-[#F8FAF5]
            to-[#EEF1E7]
          "
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div
                className="
                  flex items-center gap-2

                  text-[#8d9b70]

                  text-[11px] sm:text-sm
                  font-semibold
                  uppercase
                  tracking-wider

                  mb-2
                "
              >
                <i className="bi bi-person-plus-fill"></i>

                Gestión de usuarios
              </div>

              <h2
                className="
                  text-xl sm:text-2xl

                  font-bold

                  text-[#2D2D2D]
                "
              >
                Nuevo Usuario
              </h2>
            </div>

            {/* CLOSE */}
            <button
              onClick={onClose}
              className="
                min-w-[40px]
                h-10

                rounded-xl

                bg-white

                border border-[#E6EBDA]

                text-gray-500

                flex items-center justify-center

                transition-all duration-300

                hover:bg-[#8d9b70]
                hover:text-white
                hover:shadow-md
              "
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-5 sm:p-8">
          {/* ERROR */}
          {error && (
            <div
              className="
                mb-5

                flex items-start gap-3

                p-4

                rounded-2xl

                bg-red-50

                border border-red-100

                text-red-600
                text-sm
              "
            >
              <i className="bi bi-exclamation-circle-fill mt-0.5"></i>

              <span>{error}</span>
            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* NOMBRE + APELLIDO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* NOMBRE */}
              <div>
                <label
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider

                    text-[#8d9b70]

                    mb-2
                    block
                  "
                >
                  Nombre
                </label>

                <div className="relative">
                  <i
                    className="
                      bi bi-person

                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2

                      text-gray-400
                    "
                  ></i>

                  <input
                    required
                    name="nombre"
                    placeholder="Juan"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="
                      w-full

                      pl-11 pr-4 py-3

                      rounded-2xl

                      border border-[#E6EBDA]

                      bg-[#FAFBF8]

                      text-sm sm:text-base

                      outline-none

                      transition-all duration-300

                      focus:border-[#8d9b70]
                      focus:ring-4
                      focus:ring-[#8d9b70]/10
                    "
                  />
                </div>
              </div>

              {/* APELLIDO */}
              <div>
                <label
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider

                    text-[#8d9b70]

                    mb-2
                    block
                  "
                >
                  Apellido
                </label>

                <div className="relative">
                  <i
                    className="
                      bi bi-person-badge

                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2

                      text-gray-400
                    "
                  ></i>

                  <input
                    required
                    name="apellido"
                    placeholder="Pérez"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="
                      w-full

                      pl-11 pr-4 py-3

                      rounded-2xl

                      border border-[#E6EBDA]

                      bg-[#FAFBF8]

                      text-sm sm:text-base

                      outline-none

                      transition-all duration-300

                      focus:border-[#8d9b70]
                      focus:ring-4
                      focus:ring-[#8d9b70]/10
                    "
                  />
                </div>
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider

                  text-[#8d9b70]

                  mb-2
                  block
                "
              >
                Correo electrónico
              </label>

              <div className="relative">
                <i
                  className="
                    bi bi-envelope

                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2

                    text-gray-400
                  "
                ></i>

                <input
                  required
                  type="email"
                  name="email"
                  placeholder="correo@empresa.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="
                    w-full

                    pl-11 pr-4 py-3

                    rounded-2xl

                    border border-[#E6EBDA]

                    bg-[#FAFBF8]

                    text-sm sm:text-base

                    outline-none

                    transition-all duration-300

                    focus:border-[#8d9b70]
                    focus:ring-4
                    focus:ring-[#8d9b70]/10
                  "
                />
              </div>
            </div>

            {/* USERNAME */}
            <div>
              <label
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider

                  text-[#8d9b70]

                  mb-2
                  block
                "
              >
                Usuario
              </label>

              <div className="relative">
                <i
                  className="
                    bi bi-at

                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2

                    text-gray-400
                  "
                ></i>

                <input
                  required
                  name="usuario"
                  placeholder="usuario123"
                  value={formData.usuario}
                  onChange={handleChange}
                  className="
                    w-full

                    pl-11 pr-4 py-3

                    rounded-2xl

                    border border-[#E6EBDA]

                    bg-[#FAFBF8]

                    text-sm sm:text-base

                    outline-none

                    transition-all duration-300

                    focus:border-[#8d9b70]
                    focus:ring-4
                    focus:ring-[#8d9b70]/10
                  "
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider

                  text-[#8d9b70]

                  mb-2
                  block
                "
              >
                Contraseña
              </label>

              <div className="relative">
                <i
                  className="
                    bi bi-lock

                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2

                    text-gray-400
                  "
                ></i>

                <input
                  required
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="
                    w-full

                    pl-11 pr-4 py-3

                    rounded-2xl

                    border border-[#E6EBDA]

                    bg-[#FAFBF8]

                    text-sm sm:text-base

                    outline-none

                    transition-all duration-300

                    focus:border-[#8d9b70]
                    focus:ring-4
                    focus:ring-[#8d9b70]/10
                  "
                />
              </div>
            </div>

            {/* ROLE */}
            <div>
              <label
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider

                  text-[#8d9b70]

                  mb-2
                  block
                "
              >
                Rol
              </label>

              <div className="relative">
                <i
                  className="
                    bi bi-shield-lock

                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2

                    text-gray-400

                    z-10
                  "
                ></i>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="
                    w-full

                    pl-11 pr-4 py-3

                    rounded-2xl

                    border border-[#E6EBDA]

                    bg-[#FAFBF8]

                    text-sm sm:text-base

                    outline-none

                    appearance-none

                    transition-all duration-300

                    focus:border-[#8d9b70]
                    focus:ring-4
                    focus:ring-[#8d9b70]/10
                  "
                >
                  <option value="USER">
                    Usuario (USER)
                  </option>

                  <option value="ADMIN">
                    Administrador (ADMIN)
                  </option>
                </select>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {/* CANCEL */}
              <button
                type="button"
                onClick={onClose}
                className="
                  w-full sm:flex-1

                  py-3

                  rounded-2xl

                  bg-gray-100

                  text-gray-700
                  font-medium

                  transition-all duration-300

                  hover:bg-gray-200
                "
              >
                <div className="flex items-center justify-center gap-2">
                  <i className="bi bi-x-circle"></i>

                  Cancelar
                </div>
              </button>

              {/* SAVE */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full sm:flex-1

                  py-3

                  rounded-2xl

                  bg-[#8d9b70]

                  text-white
                  font-medium

                  shadow-md

                  transition-all duration-300

                  hover:bg-[#7c8b61]
                  hover:shadow-lg
                  hover:-translate-y-0.5

                  active:scale-95
                "
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <i className="bi bi-check-circle-fill"></i>

                    Guardar
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
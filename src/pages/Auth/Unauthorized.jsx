import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-[#F9F7F2] via-[#F3F0E8] to-[#EAE5DA] p-4">

      {/* Círculos decorativos */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#8B9467]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#A8B08A]/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md p-10 text-center backdrop-blur-lg bg-white/80 border border-white/50 rounded-3xl shadow-2xl">

        {/* Icono animado */}
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping">
            <i className="bi bi-shield-lock-fill text-8xl text-red-300"></i>
          </div>

          <i className="bi bi-incognito text-8xl text-[#8B9467] animate-bounce"></i>
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-4 py-2 mb-5 text-sm font-semibold text-red-700 bg-red-100 rounded-full">
          <i className="bi bi-lock-fill"></i>
          Acceso Restringido
        </span>

        {/* Título */}
        <h1 className="mb-3 text-4xl font-extrabold text-[#4A453E]">
          ¡No seas pillo! 😏
        </h1>

        {/* Texto */}
        <p className="mb-8 text-[#7B756E] leading-relaxed">
          Parece que has encontrado una puerta secreta...
          pero este módulo está reservado para otros perfiles.
        </p>

        {/* Botones */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="group flex items-center justify-center gap-2 py-3 rounded-xl bg-[#8B9467] text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-[#7A8258]"
          >
            <i className="bi bi-arrow-left transition-transform group-hover:-translate-x-1"></i>
            Volver al Inicio
          </button>

          <button
            onClick={() => window.history.back()}
            className="py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
}
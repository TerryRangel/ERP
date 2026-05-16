import React from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function NoAutorizado() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 bg-[#F8FAF5]">
      
      <div className="w-32 h-32 bg-orange-100 text-orange-500 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-sm border border-orange-200">
        <i className="bi bi-shield-fill-exclamation text-6xl"></i>
      </div>
      
      <h1 className="text-4xl sm:text-5xl font-black text-[#1F2937] mb-4">
        ¡No seas pillo! 🧶
      </h1>
      
      <p className="text-gray-500 text-lg max-w-md mb-8">
        Parece que intentaste colarte a una zona restringida del taller. No tienes los permisos necesarios para estar aquí.
      </p>
      
      <Link
        to="/dashboard"
        className="px-8 py-4 bg-gradient-to-r from-[#8d9b70] to-[#7c8b61] hover:scale-105 active:scale-95 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 uppercase tracking-widest text-sm"
      >
        <i className="bi bi-house-door-fill text-lg"></i>
        Volver a un lugar seguro
      </Link>
    </div>
  );
}
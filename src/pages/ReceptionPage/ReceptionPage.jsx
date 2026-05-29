import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { Can } from "../../components/can.jsx";
import NewReceptionModal from "./NewReceptionModal";
import ConfirmAlert from "../../components/ui/Alert.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ReceptionsPage() {
  const [recepciones, setRecepciones] = useState([]);
  const [loading, setLoading] = useState(true);

  /* SEARCH & FILTERS */
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* MODALES */
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  /* ALERT */
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
  });

  
  const cargarRecepciones = async () => {
    try {
      setLoading(true);

      const response = await api.get("/recepciones");

      const lista = response.data?.items || response.data || [];

      const listaConEstadoVisual = lista.map((r) => ({
        ...r,
        visualStatus:
          r.status === "CONFIRMED"
            ? "ENTREGADO"
            : "PENDIENTE",
      }));

      setRecepciones(listaConEstadoVisual);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRecepciones();
  }, []);

  const handleConfirmar = async (id) => {
    try {
      await api.patch(`/recepciones/${id}/confirm`);

      setRecepciones((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "CONFIRMED",
                visualStatus: "ENTREGADO",
              }
            : r
        )
      );
    } catch (err) {
      alert("Error al confirmar");
    }
  };

 
  const handleDelete = async () => {
    try {
      await api.delete(`/recepciones/${deleteModal.id}`);

      setRecepciones((prev) =>
        prev.filter((r) => r.id !== deleteModal.id)
      );

      setDeleteModal({
        open: false,
        id: null,
      });
    } catch (err) {
      alert("Error al eliminar");
    }
  };

 
  const cambiarEstadoVisual = (id, estado) => {
    setRecepciones((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              visualStatus: estado,
            }
          : r
      )
    );
  };


  const recepcionesFiltradas = useMemo(() => {
    return recepciones.filter((r) => {
      const nombresProductos =
        r.items?.map((i) => i.productNombre).join(" ") || "";

      const texto = `${r.folio} ${r.supplierNombre} ${nombresProductos}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const estado =
        statusFilter === "ALL"
          ? true
          : r.visualStatus === statusFilter;

      return texto && estado;
    });
  }, [recepciones, searchTerm, statusFilter]);

  const entregados = recepciones.filter(
    (r) => r.visualStatus === "ENTREGADO"
  ).length;

  const pendientes = recepciones.filter(
    (r) => r.visualStatus === "PENDIENTE"
  ).length;

  const cancelados = recepciones.filter(
    (r) => r.visualStatus === "CANCELADO"
  ).length;

 
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ENTREGADO":
        return "bg-emerald-100 text-emerald-700";

      case "CANCELADO":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7F2]">
        <div className="w-20 h-20 rounded-[28px] bg-white border border-[#E7ECDD] shadow-sm flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-[#7E8B63]"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7F2] px-2 md:px-4 py-8 w-full">
      <div className="max-w-[2200px] mx-auto">

        {/* =========================
            HEADER
        ========================== */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-10">

          <div>
            <div className="flex items-center gap-5 mb-4">

              <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#DDE8CF] to-[#8FA878] text-[#5F6F52] flex items-center justify-center shadow-md border border-[#D4DFC5]">
                <i className="bi bi-box-seam text-2xl"></i>
              </div>

              <div>
                <p className="uppercase tracking-[0.35em] text-xs font-bold text-[#7E8B63]">
                  Gestión ERP
                </p>

                <h1 className="text-5xl font-black text-[#1F2937] leading-none mt-1">
                  Recepciones
                </h1>
              </div>
            </div>

            <p className="text-gray-500 text-lg max-w-2xl">
              Control visual y administración de entradas de mercancía.
            </p>
          </div>

          {/* SEARCH */}
          <div className="flex flex-col lg:flex-row gap-4">

            <div className="relative">
              <input
                type="text"
                placeholder="Buscar recepción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full lg:w-[360px]
                  h-[58px]
                  rounded-2xl
                  border border-[#E5EBDD]
                  bg-white
                  !pl-5 !pr-14
                  text-sm
                  shadow-sm
                  outline-none
                  focus:border-[#7E8B63]
                  focus:ring-4
                  focus:ring-[#7E8B63]/10
                "
              />

              <i className="bi bi-search absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"></i>
            </div>

            <Can I="recepciones:create">
              <button
                onClick={() => setIsNewModalOpen(true)}
                className="
                  h-[58px]
                  px-7
                  rounded-2xl
                  bg-[#7E8B63]
                  text-white
                  font-semibold
                  shadow-lg
                  hover:bg-[#6F7D56]
                  transition-all
                  flex items-center gap-3
                "
              >
                <i className="bi bi-plus-circle text-lg"></i>
                Nueva Recepción
              </button>
            </Can>
          </div>
        </div>

        {/* =========================
            STATS
        ========================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white border border-[#E5EBDD] rounded-[32px] p-7 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
                Entregados
              </p>

              <h3 className="text-5xl font-black mt-2 text-emerald-700">
                {entregados}
              </h3>
            </div>

            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-emerald-100">
              <i className="bi bi-check2-circle text-2xl text-emerald-700"></i>
            </div>
          </div>

          <div className="bg-white border border-[#E5EBDD] rounded-[32px] p-7 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
                Pendientes
              </p>

              <h3 className="text-5xl font-black mt-2 text-yellow-600">
                {pendientes}
              </h3>
            </div>

            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-yellow-100">
              <i className="bi bi-clock-history text-2xl text-yellow-700"></i>
            </div>
          </div>

          <div className="bg-white border border-[#E5EBDD] rounded-[32px] p-7 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
                Cancelados
              </p>

              <h3 className="text-5xl font-black mt-2 text-red-600">
                {cancelados}
              </h3>
            </div>

            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-red-100">
              <i className="bi bi-x-circle text-2xl text-red-600"></i>
            </div>
          </div>
        </div>

        {/* =========================
            TABLA
        ========================== */}
        <div className="bg-white border border-[#E5EBDD] rounded-[36px] shadow-sm overflow-hidden">

          <div className="px-8 py-6 border-b border-[#EEF2E7]">
            <h2 className="text-xl font-black text-gray-800">
              Historial de recepciones
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              {recepcionesFiltradas.length} registros encontrados
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead>
                <tr className="bg-[#FAFBF8] border-b border-[#EEF2E7]">

                  <th className="text-left pl-10 py-5 text-xs uppercase tracking-widest text-gray-400 font-black">
                    Folio / Fecha
                  </th>

                  <th className="text-left py-5 text-xs uppercase tracking-widest text-gray-400 font-black">
                    Proveedor
                  </th>

                  <th className="text-left py-5 text-xs uppercase tracking-widest text-gray-400 font-black">
                    Productos
                  </th>

                  <th className="text-left py-5 text-xs uppercase tracking-widest text-gray-400 font-black">
                    Total
                  </th>

                  <th className="text-left py-5 text-xs uppercase tracking-widest text-gray-400 font-black">
                    Estado
                  </th>

                  <th className="text-center pr-10 py-5 text-xs uppercase tracking-widest text-gray-400 font-black">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {recepcionesFiltradas.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-[#F3F5EF] hover:bg-[#FAFBF8] transition-all"
                  >

                    {/* FOLIO */}
                    <td className="pl-10 py-6">
                      <p className="font-bold text-gray-800">
                        {r.folio}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(r.fecha)}
                      </p>
                    </td>

                    {/* PROVEEDOR */}
                    <td className="font-semibold text-gray-700">
                      {r.supplierNombre}
                    </td>

                    {/* PRODUCTOS */}
                    <td>
                      <div className="text-xs font-semibold text-gray-600 max-w-[300px]">
                        {r.items?.map((i) => i.productNombre).join(", ")}
                      </div>
                    </td>

                    {/* TOTAL */}
                    <td className="font-bold text-gray-800">
                      {formatMoney(r.total)}
                    </td>

                    {/* ESTADO */}
                    <td>
                      <select
                        value={r.visualStatus}
                        onChange={(e) =>
                          cambiarEstadoVisual(r.id, e.target.value)
                        }
                        className={`
                          px-4 py-2 rounded-2xl text-xs font-bold outline-none border-0
                          ${getStatusStyle(r.visualStatus)}
                        `}
                      >
                        <option value="PENDIENTE">
                          PENDIENTE
                        </option>

                        <option value="ENTREGADO">
                          ENTREGADO
                        </option>

                        <option value="CANCELADO">
                          CANCELADO
                        </option>
                      </select>
                    </td>

                    {/* ACCIONES */}
                    <td className="pr-10">
                      <div className="flex justify-center gap-3">

                        {/* CONFIRMAR */}
                        {r.visualStatus !== "ENTREGADO" && (
                          <Can I="recepciones:update">
                            <button
                              onClick={() => handleConfirmar(r.id)}
                              className="
                                w-11 h-11
                                rounded-2xl
                                bg-emerald-50
                                text-emerald-600
                                hover:bg-emerald-600
                                hover:text-white
                                transition-all
                                flex items-center justify-center
                              "
                            >
                              <i className="bi bi-check2-all text-lg"></i>
                            </button>
                          </Can>
                        )}

                        {/* ELIMINAR */}
                        <Can I="recepciones:delete">
                          <button
                            onClick={() =>
                              setDeleteModal({
                                open: true,
                                id: r.id,
                              })
                            }
                            className="
                              w-11 h-11
                              rounded-2xl
                              bg-red-50
                              text-red-600
                              hover:bg-red-600
                              hover:text-white
                              transition-all
                              flex items-center justify-center
                            "
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </Can>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

        {/* MODAL NUEVA RECEPCIÓN */}
        <NewReceptionModal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          onSuccess={() => {
            setIsNewModalOpen(false);
            cargarRecepciones();
          }}
        />

        {/* ALERT ELIMINAR */}
        <ConfirmAlert
          isOpen={deleteModal.open}
          onClose={() =>
            setDeleteModal({
              open: false,
              id: null,
            })
          }
          onConfirm={handleDelete}
          title="Eliminar recepción"
          message="Esta acción eliminará el registro permanentemente."
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
        />
      </div>
    </div>
  );
}
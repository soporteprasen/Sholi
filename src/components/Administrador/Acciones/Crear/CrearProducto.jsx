"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import CropperModal from "@/components/CropperModal";
import { obtenerCategorias, obtenerMarcas, obtenerUnidades, crearProducto , ObtenerImagenProducto} from "@/lib/api";

export default function CrearProducto({ onCancel }) {
  const [formulario, setFormulario] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    precio: "",
    descuento: "",
    stock: "",
    idMarca: "",
    categorias: [],
    unidades: [],
  });

  const [archivoFicha, setArchivoFicha] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [imagenOriginal, setImagenOriginal] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [marcas, setMarcas] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState("");
  const [historialIndex, setHistorialIndex] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [historialCambios, setHistorialCambios] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [principalMode, setPrincipalMode] = useState(1);
  const [modalImagenesAbierto, setModalImagenesAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      const [cats, marcasData, unidadesData] = await Promise.all([
        obtenerCategorias(),
        obtenerMarcas(),
        obtenerUnidades(),
      ]);

      setCategorias(cats);
      setMarcas(marcasData);
      setUnidades(unidadesData);
    }

    cargarDatos();
  }, []);

  const guardarEnHistorial = (nuevoEstado) => {
    const nuevoHistorial = historial.slice(0, historialIndex + 1);
    nuevoHistorial.push(nuevoEstado);
    setHistorial(nuevoHistorial);
    setHistorialIndex(nuevoHistorial.length - 1);
  };

  useEffect(() => {
    if (!modalImagenesAbierto) return;

    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            handleAgregarImagen({ target: { files: [file] } });
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [modalImagenesAbierto]);

  const marcarComoPrincipal = (idImagenProducto) => {
    if (!principalMode) return;

    const nuevoEstado = imagenes.map(img => {
        if (img.principalTipo === principalMode) {
        return { ...img, principalTipo: null };
        }
        if (img.idImagenProducto === idImagenProducto) {
        return { ...img, principalTipo: principalMode };
        }
        return img;
    });

    guardarEnHistorial(nuevoEstado);
    setImagenes(nuevoEstado);
    setPrincipalMode(null);
    };

    const handleResetearPrincipales = () => {
    const nuevoEstado = imagenes.map(img => ({ ...img, principalTipo: null }));
    guardarEnHistorial(nuevoEstado);
    setImagenes(nuevoEstado);
    setPrincipalMode(null);
    };

    const handleUndo = () => {
    if (historialIndex > 0) {
        const nuevoIndex = historialIndex - 1;
        setHistorialIndex(nuevoIndex);
        setImagenes(historial[nuevoIndex]);
    }
    };

    const handleRedo = () => {
    if (historialIndex < historial.length - 1) {
        const nuevoIndex = historialIndex + 1;
        setHistorialIndex(nuevoIndex);
        setImagenes(historial[nuevoIndex]);
    }
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Por favor, selecciona un PDF válido.");
      e.target.value = "";
      return;
    }

    setArchivoFicha(file);
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
  };

  const handleAgregarImagen = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        const img = new Image();
        img.onload = () => {
          setImagenOriginal(dataUrl);
          setIsCropperOpen(true);
        };
        img.onerror = () => {
          alert("La imagen está dañada o no se puede procesar.");
          event.target.value = "";
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    } else {
      alert("Por favor, selecciona una imagen válida.");
      event.target.value = "";
    }
  };

  const handleImagenCortada = (blob) => {
    const urlTemporal = URL.createObjectURL(blob);
    const nuevaImagen = {
      idImagenProducto: `temp-${Date.now()}-${Math.random()}`,
      imagenBlob: blob,
      imagenUrlTemporal: urlTemporal,
      urlImagen: "",
      principalTipo: null,
    };
    const nuevoEstado = [...imagenes, nuevaImagen];
    guardarEnHistorial(nuevoEstado);
    setImagenes(nuevoEstado);
  };

  const handleEliminarImagen = (id) => {
    const nuevoEstado = imagenes.filter(img => img.idImagenProducto !== id);
    guardarEnHistorial(nuevoEstado);
    setImagenes(nuevoEstado);
    };

  const handleGuardarProducto = async () => {
    // Validaciones principales
    if (
      !formulario.codigo?.trim() ||
      !formulario.nombre?.trim() ||
      !formulario.descripcion?.trim() ||
      formulario.precio == null ||
      formulario.descuento == null ||
      formulario.stock == null ||
      !formulario.idMarca
    ) 
    {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    //Validaciones adicionales
    if (!Array.isArray(formulario.categorias) || formulario.categorias.length < 1) {
      alert("Debe seleccionar al menos una categoría.");
      return;
    }

    if (!Array.isArray(formulario.unidades) || formulario.unidades.length < 1) {
      alert("Debe seleccionar al menos una unidad de medida.");
      return;
    }

    if (!imagenes || imagenes.length === 0) {
      const continuar = confirm("Advertencia: No se han añadido imágenes. ¿Desea continuar? Se mostrará una imagen auxiliar por defecto.");
      if (!continuar) return;
    }

    const datosProducto = {
        codigo: formulario.codigo,
        nombre: formulario.nombre,
        descripcion: formulario.descripcion,
        precio: formulario.precio,
        descuento: formulario.descuento,
        stock: formulario.stock,
        id_marca: formulario.idMarca,
        categoria: formulario.categorias,
        unidad: formulario.unidades,
        archivoFicha: archivoFicha,
        imagenes: imagenes.map((img, i) => ({
        NombreArchivo: `imagen_${i}.webp`,
        EsPrincipal: img.principalTipo === 1,
        EsPrincipal2: img.principalTipo === 2,
        }))
    };

    // Agregar los blobs de las imágenes como propiedades dinámicas
    imagenes.forEach((img, i) => {
        if (img.imagenBlob) {
        datosProducto[`imagenArchivo_${i}`] = img.imagenBlob;
        }
    });

    setGuardando(true);
    try {
        // Aquí llamamos a la función para crear el producto    
        if( datosProducto.categoria.length >= 1 && datosProducto.unidad.length >= 1 ) {
          const response = await crearProducto(datosProducto);
          if (response.ValorConsulta === "1" || response.valorConsulta === "1") {
          alert("Producto creado correctamente");
          if (onCancel) onCancel();
          } else {
          alert("Error al crear producto: " + response.MensajeConsulta);
          }
        } else {
          alert("Debe seleccionar al menos una categoría y una unidad de medida.");
        }
    } catch (error) {
        console.error(error);
        alert("Error inesperado al crear producto");
    } finally {
        setGuardando(false);
    }
    };


    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6">Editar Producto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Código */}
            <div>
              <label className="block mb-1 font-semibold">Código</label>
              <input
                type="text"
                name="codigo"
                value={formulario.codigo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Código del producto"
              />
            </div>
  
            {/* Nombre */}
            <div>
              <label className="block mb-1 font-semibold">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Nombre del producto"
              />
            </div>
  
            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold">Descripción</label>
              <textarea
                name="descripcion"
                value={formulario.descripcion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                rows="3"
                placeholder="Descripción del producto"
              ></textarea>
            </div>
  
            {/* Precio */}
            <div>
              <label className="block mb-1 font-semibold">Precio</label>
              <input
                type="number"
                name="precio"
                value={formulario.precio}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Precio"
              />
            </div>
  
            {/* Descuento */}
            <div>
              <label className="block mb-1 font-semibold">Descuento</label>
              <input
                type="number"
                name="descuento"
                value={formulario.descuento}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Descuento"
              />
            </div>
  
            {/* Stock */}
            <div>
              <label className="block mb-1 font-semibold">Stock</label>
              <input
                type="number"
                name="stock"
                value={formulario.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Stock disponible"
              />
            </div>
  
            {/* Imágenes Principales */}
            <div className="md:col-span-2">
              <div className="flex gap-4">
                {/* Imagen Principal 1 */}
                <div className="flex flex-col items-center w-[180px]">
                  <label className="block mb-1 font-semibold text-center">Imagen Principal 1</label>
                  <div className="aspect-square w-full border rounded bg-gray-50 flex items-center justify-center overflow-hidden">
                    {(() => {
                      const img1 = imagenes.find(img => img.principalTipo === 1);
                      return img1 ? (
                        <img
                          src={
                            img1.imagenUrlTemporal
                          }
                          className="object-contain w-full h-full"
                          alt="Imagen Principal 1"
                        />
                      ) : (
                        <span className="text-gray-400 italic">No asignada</span>
                      );
                    })()}
                  </div>
                </div>
  
                {/* Imagen Principal 2 */}
                <div className="flex flex-col items-center w-[180px]">
                  <label className="block mb-1 font-semibold text-center">Imagen Principal 2</label>
                  <div className="aspect-square w-full border rounded bg-gray-50 flex items-center justify-center overflow-hidden">
                    {(() => {
                      const img2 = imagenes.find(img => img.principalTipo === 2);
                      return img2 ? (
                        <img
                          src={
                            img2.imagenUrlTemporal
                          }
                          className="object-contain w-full h-full"
                          alt="Imagen Principal 2"
                        />
                      ) : (
                        <span className="text-gray-400 italic">No asignada</span>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block mb-1 font-semibold">Imágenes</label>
              <Button
                onClick={() => setModalImagenesAbierto(true)}
                className="mt-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                Ver Imágenes
              </Button>
            </div>
                  
            {/* Input para nueva ficha técnica */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold">Ficha Técnica (opcional)</label>
              <div className="flex gap-4 items-center">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="flex-1 border p-2 rounded"
                  ref={fileInputRef}
                />
  
                {/* Botón Visualizar */}
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => {
                    if (archivoFicha) {
                      const url = URL.createObjectURL(archivoFicha);
                      window.open(url, "_blank");
                    } else {
                      alert("No hay archivo cargado.");
                    }
                  }}
                >
                  <Eye className="w-5 h-5" />
                </button>
  
                {/* Botón Eliminar */}
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => {
                    setArchivoFicha(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
  
            {/* Combos Marca, Categoría, Unidad */}
            {/* Marca */}
            <div>
              <label className="block mb-1 font-semibold">Marca</label>
              <select
                name="idMarca"
                value={formulario.idMarca}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">Selecciona una marca</option>
                {marcas.map((marca) => (
                  <option key={marca.id_marcas} value={marca.id_marcas}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
            </div>
  
            {/* Categoría */}
            {/* Categorías seleccionadas como chips */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Categorías</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formulario.categorias.map((cat) => (
                  <span key={cat.id_categoria} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {cat.nombre}
                    <button
                      type="button"
                      className="text-red-500 ml-1 hover:text-red-700"
                      onClick={() => {
                        setFormulario((prev) => ({
                          ...prev,
                          categorias: prev.categorias.filter((c) => c.id_categoria !== cat.id_categoria),
                        }));
                      }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
  
              <select
                value={categoriaSeleccionada}
                onChange={(e) => {
                  const id = e.target.value;
                  setCategoriaSeleccionada(id);
                  const cat = categorias.find((c) => c.id_categoria === id);
                  if (cat && !formulario.categorias.some((c) => c.id_categoria === id)) {
                    setFormulario((prev) => ({
                      ...prev,
                      categorias: [...prev.categorias, cat],
                    }));
                  }
  
                  setCategoriaSeleccionada("");
                }}
                className="w-full border rounded p-2"
              >
                <option value="">-- Seleccionar categoría --</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
  
            {/* Unidad */}
            {/* Lista de selects de unidades */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Unidades de medida</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formulario.unidades.map((unidad) => (
                  <span key={unidad.id_unidad} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    {unidad.nombre}
                    <button
                      type="button"
                      className="text-red-500 ml-1 hover:text-red-700"
                      onClick={() => {
                        setFormulario((prev) => ({
                          ...prev,
                          unidades: prev.unidades.filter((u) => u.id_unidad !== unidad.id_unidad),
                        }));
                      }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
  
              <select
                value={unidadSeleccionada}
                className="w-full border rounded p-2"
                onChange={(e) => {
                  const id = e.target.value;
                  setUnidadSeleccionada(id);
                  const unidad = unidades.find((u) => u.id_unidad === id);
                  if (unidad && !formulario.unidades.some((u) => u.id_unidad === id)) {
                    setFormulario((prev) => ({
                      ...prev,
                      unidades: [...prev.unidades, unidad],
                    }));
                  }
  
                  setUnidadSeleccionada(""); // Resetear el select
                }}
              >
                <option value="">-- Seleccionar unidad --</option>
                {unidades.map((u) => (
                  <option key={u.id_unidad} value={u.id_unidad}>
                    {u.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
  
        {/* Botones */}
        <div className="flex gap-4 mt-6">
          <Button
            onClick={handleGuardarProducto}
            disabled={guardando}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {guardando ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <Button
            onClick={onCancel}
            className="bg-gray-400 text-white hover:bg-gray-500"
          >
            Cancelar
          </Button>
        </div>
  
        {modalImagenesAbierto && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-none bg-black/20 transition-opacity duration-300 ease-in-out ${modalImagenesAbierto ? "opacity-100" : "opacity-0"}`}
            onDragEnter={() => setArrastrando(true)}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setArrastrando(false);
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setArrastrando(false);
              const files = Array.from(e.dataTransfer.files);
              const imagen = files.find(file => file.type.startsWith("image/"));
              if (imagen) {
                handleAgregarImagen({ target: { files: [imagen] } });
              }
            }}
          >
            <div className="bg-white rounded p-6 max-w-6xl w-full relative overflow-y-auto max-h-[90vh]">
              
              {/* Superposición durante el arrastre */}
              {arrastrando && (
                <div className="absolute inset-0 bg-white/50 border-4 border-black-500 z-50 pointer-events-none flex items-center justify-center">
                  <span className="text-lg rounded p-2 bg-[rgba(0,0,0,0.7)] font-bold text-blue-50">Suelta la imagen aquí</span>
                </div>
              )}

              {/* Header y controles */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-4">
                  Imágenes del Producto
                </h3>
                <div className="flex gap-2">
                  <button onClick={() => setPrincipalMode(1)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs cursor-pointer">
                    Principal 1
                  </button>
                  <button onClick={() => setPrincipalMode(2)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs cursor-pointer">
                    Principal 2
                  </button>
                  <button onClick={handleResetearPrincipales} className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs cursor-pointer">
                    Resetear
                  </button>
                  <button disabled={historialIndex <= 0} onClick={handleUndo} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs cursor-pointer">
                    Deshacer
                  </button>
                  <button disabled={historialIndex >= historial.length - 1} onClick={handleRedo} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs cursor-pointer">
                    Rehacer
                  </button>
                  <button onClick={() => setModalImagenesAbierto(false)} className="text-gray-700 text-2xl">
                    &times;
                  </button>
                </div>
              </div>

              {/* Grid de imágenes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagenes.length > 0 &&
                  imagenes.map((img, index) => {
                    let borderClass = "border-gray-300";
                    let label = "";

                    if (img.principalTipo === 1) {
                      borderClass = "ring-4 ring-blue-500";
                      label = "Imagen principal 1";
                    } else if (img.principalTipo === 2) {
                      borderClass = "ring-4 ring-red-500";
                      label = "Imagen principal 2";
                    }

                    return (
                      <div
                        key={`${img.idImagenProducto || index}-${img.principalTipo}`}
                        className="flex flex-col items-center border p-2 rounded shadow relative cursor-pointer"
                        onClick={() => principalMode && marcarComoPrincipal(img.idImagenProducto)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEliminarImagen(img.idImagenProducto);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          title="Eliminar imagen"
                        >
                          &times;
                        </button>
                        <div className="w-full aspect-square">
                          <img
                            src={img.imagenUrlTemporal}
                            alt={`Imagen ${index + 1}`}
                            className={`object-cover w-full h-full rounded ${borderClass}`}
                          />
                        </div>
                        {label && <span className="mt-2 text-sm font-semibold">{label}</span>}
                      </div>
                    );
                  })}

                {/* Botón Agregar */}
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded cursor-pointer aspect-square"
                  onClick={() => document.getElementById('fileUploadNuevoProducto').click()}
                >
                  <span className="text-4xl text-gray-500">+</span>
                  <span className="text-sm text-gray-500">Agregar Imagen</span>
                  <input
                    id="fileUploadNuevoProducto"
                    type="file"
                    accept="image/*"
                    onChange={handleAgregarImagen}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
  
        <CropperModal
          imagenOriginal={imagenOriginal}
          isOpen={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          onCropped={handleImagenCortada}
        />
      </div>
    );
}

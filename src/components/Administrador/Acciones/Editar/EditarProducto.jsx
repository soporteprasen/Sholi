"use client";

import { useState, useEffect, useRef} from "react";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import CropperModal from "@/components/CropperModal"; // o el path correcto
import { editarProducto, obtenerCategorias, obtenerMarcas, obtenerUnidades, obtenerProductoPorId, ObtenerImagenProducto, ObtenerArchivoFicha } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditarProducto({ producto, onCancel }) {
  const [formulario, setFormulario] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [imagenes, setImagenes] = useState([]);
  const principales = imagenes.filter(img => img.esPrincipal);
  const [principalMode, setPrincipalMode] = useState(null);
  const [modalImagenesAbierto, setModalImagenesAbierto] = useState(false); // 🚩 Modal para ver imágenes
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [imagenOriginal, setImagenOriginal] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState("");
  const [cargando, setCargando] = useState(true);
  const [archivoFicha, setArchivoFicha] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [historialIndex, setHistorialIndex] = useState(-1);
  const [imagenesOriginales, setImagenesOriginales] = useState([]);
  const [imagenesEliminadas, setImagenesEliminadas] = useState([]);
  const [productoCompleto, setProductoCompleto] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const productoCompleto = await obtenerProductoPorId(producto.id_producto);
        setFormulario({
          idProducto: productoCompleto.id_producto,
          codigo: productoCompleto.codigo,
          nombre: productoCompleto.nombre,
          descripcion: productoCompleto.descripcion,
          precio: productoCompleto.precio,
          descuento: productoCompleto.descuento,
          stock: productoCompleto.stock,
          urlImagen1: productoCompleto.urlImagen1,
          urlImagen2: productoCompleto.urlImagen2,
          ficha: productoCompleto.ficha,
          idMarca: String(productoCompleto.id_marca),
          categorias: productoCompleto.categoria ?? [],
          unidades: productoCompleto.unidad ?? [],
        });

        // 🚩 Guardar las imágenes que vienen en base64
        if (productoCompleto.imagenes) {
          // Convertir esPrincipal (boolean) a principalTipo
          const imagenesConPrincipal = productoCompleto.imagenes.map((img) => {
            let principalTipo = null;

            if (productoCompleto.urlImagen1 === img.urlImagen) {
              principalTipo = 1;
            } else if (productoCompleto.urlImagen2 === img.urlImagen) {
              principalTipo = 2;
            }

            return {
              ...img,
              principalTipo: principalTipo,
            };
          });

          setImagenes(imagenesConPrincipal);
          setImagenesOriginales(imagenesConPrincipal.map(img => ({ ...img })));
        }

        if (productoCompleto.ficha) {
          const blob = await ObtenerArchivoFicha(productoCompleto.ficha);
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        }

        const [categoriasData, marcasData, unidadesData] = await Promise.all([
          obtenerCategorias(),
          obtenerMarcas(),
          obtenerUnidades()
        ]);
        setCategorias(categoriasData);
        setMarcas(marcasData);
        setUnidades(unidadesData);

        setProductoCompleto(productoCompleto);

      } catch (error) {
        
      } finally {
        setCargando(false);
      }
    }

    fetchData();
  }, [producto]);

  useEffect(() => {
    const cargarImagenes = async () => {
      const imagenesCargadas = await Promise.all(
        productoCompleto.imagenes
          .filter(img => img.urlImagen && img.urlImagen.trim() !== "")
          .map(async (img) => {
          try {
            const blob = await ObtenerImagenProducto(img.urlImagen);
            const url = URL.createObjectURL(blob);

            // 👇 Volvemos a determinar principalTipo
            let principalTipo = null;
            if (productoCompleto.urlImagen1 === img.urlImagen) {
              principalTipo = 1;
            } else if (productoCompleto.urlImagen2 === img.urlImagen) {
              principalTipo = 2;
            }

            return {
              ...img,
              idImagenProducto: img.idImagen ,
              imagenBlob: blob,
              imagenUrlTemporal: url,
              principalTipo: principalTipo
            };
          } catch (error) {
            alert("Error cargando imagen:", img.urlImagen);
            return null;
          }
        })
      );
      setImagenes(imagenesCargadas.filter(Boolean));
    };

    if (productoCompleto?.imagenes?.length > 0) {
      cargarImagenes();
    }
  }, [productoCompleto]);

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

  const handleEliminarImagen = (idImagenProducto) => {
    const imagenEliminada = imagenes.find(img => img.idImagenProducto === idImagenProducto);
    if (imagenEliminada?.urlImagen) {
      setImagenesEliminadas(prev => [...prev, imagenEliminada.urlImagen]);
    }
    
    const nuevoEstado = imagenes.filter(img => img.idImagenProducto !== idImagenProducto);
    guardarEnHistorial(nuevoEstado);
    setImagenes(nuevoEstado);
  };

  const guardarEnHistorial = (nuevoEstado) => {
    const nuevoHistorial = historial.slice(0, historialIndex + 1);
    nuevoHistorial.push(nuevoEstado);
    setHistorial(nuevoHistorial);
    setHistorialIndex(nuevoHistorial.length - 1);
  };

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

    guardarEnHistorial(nuevoEstado); // <- Guardamos el cambio
    setImagenes(nuevoEstado);
    setPrincipalMode(null); // Resetea el modo para que sea solo una acción
  };

  const handleResetearPrincipales = () => {
    const copiaOriginal = imagenesOriginales.map(img => ({ ...img })); // Copia profunda

    setImagenes(copiaOriginal); // ← Restauramos el array original
    setHistorial([]); // Vaciamos el historial
    setHistorialIndex(-1); // Resetear el puntero del historial
    setPrincipalMode(null); // Cancelar modo de selección
  };
  
  const handleUndo = () => {
    if (historialIndex > 0) {
      setHistorialIndex(historialIndex - 1);
      setImagenes(historial[historialIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historialIndex < historial.length - 1) {
      setHistorialIndex(historialIndex + 1);
      setImagenes(historial[historialIndex + 1]);
    }
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
    }else{
      alert("Por favor, selecciona una imagen válida.");
      event.target.value = "";
    }
  };

  const handleImagenCortada = (blob) => {
    const urlTemporal = URL.createObjectURL(blob);

    const nuevaImagen = {
      idImagenProducto: Math.floor(Math.random() * 1000),
      imagenBlob: blob, 
      imagenUrlTemporal: urlTemporal,
      urlImagen: "",
      principalTipo: null,
    };

    const nuevoEstado = [...imagenes, nuevaImagen];
    guardarEnHistorial(nuevoEstado);
    setImagenes(nuevoEstado);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Por favor, selecciona un archivo PDF válido.");
      e.target.value = "";
      return;
    }

    setArchivoFicha(file);
  };

  const seModificoInformacionPrincipal = () => {
      if (!formulario || !productoCompleto) return false;

    return (
      formulario.codigo !== productoCompleto.codigo ||
      formulario.nombre !== productoCompleto.nombre ||
      formulario.descripcion !== productoCompleto.descripcion ||
      formulario.precio !== productoCompleto.precio ||
      formulario.descuento !== productoCompleto.descuento ||
      formulario.stock !== productoCompleto.stock ||
      formulario.idMarca !== String(productoCompleto.id_marca)
    );
  };

  const seModificaronImagenes = () => {
    if (imagenes.length !== imagenesOriginales.length) return true;
    return imagenes.some((img, i) => {
      const orig = imagenesOriginales[i];
      return (
        img.idImagenProducto !== orig.idImagenProducto ||
        img.urlImagen !== orig.urlImagen ||
        img.principalTipo !== orig.principalTipo
      );
    });
  };

  const seModificoFicha = () => archivoFicha !== null;
  
  const seModificaronCategorias = () => {
    const originales = (productoCompleto.categoria ?? []).map(c => c.id_categoria).sort();
    const actuales = (formulario.categorias ?? []).map(c => c.id_categoria).sort();
    return JSON.stringify(originales) !== JSON.stringify(actuales);
  };

  const seModificaronUnidades = () => {
    const originales = (productoCompleto.unidad ?? []).map(u => u.id_unidad).sort();
    const actuales = (formulario.unidades ?? []).map(u => u.id_unidad).sort();
    return JSON.stringify(originales) !== JSON.stringify(actuales);
  };

  const hayCambios = () => {
    if (!formulario || !productoCompleto) return false;
    return (
      seModificoInformacionPrincipal() ||
      seModificaronImagenes() ||
      seModificoFicha() ||
      seModificaronCategorias() ||
      seModificaronUnidades()
    );
  };

  const obtenerCambios = () => {
    const cambios = {};

    const seModificoCodigo = formulario.codigo !== productoCompleto.codigo;
    const seModificoNombre = formulario.nombre !== productoCompleto.nombre;
    const seModificoDescripcion = formulario.descripcion !== productoCompleto.descripcion;
    const seModificoPrecio = formulario.precio !== productoCompleto.precio;
    const seModificoDescuento = formulario.descuento !== productoCompleto.descuento;
    const seModificoStock = formulario.stock !== productoCompleto.stock;
    const seModificoMarca = formulario.idMarca !== String(productoCompleto.id_marca);

    const seModificoFichas = () => {
      return archivoFicha !== null;
    };

    const seModificoBloquePrincipal =
      seModificoCodigo || seModificoNombre || seModificoDescripcion ||
      seModificoPrecio || seModificoDescuento || seModificoStock || seModificoMarca || seModificoFichas;

    const seModificaronCategorias = (() => {
      const originales = (productoCompleto.categoria ?? []).map(c => c.id_categoria).sort();
      const actuales = (formulario.categorias ?? []).map(c => c.id_categoria).sort();
      return JSON.stringify(originales) !== JSON.stringify(actuales);
    })();

    const seModificaronUnidades = (() => {
      const originales = (productoCompleto.unidad ?? []).map(u => u.id_unidad).sort();
      const actuales = (formulario.unidades ?? []).map(u => u.id_unidad).sort();
      return JSON.stringify(originales) !== JSON.stringify(actuales);
    })();

    const seModificoFicha = archivoFicha !== null;

    const imagenesCambiadas = imagenes.filter((img, i) => {
      const original = imagenesOriginales[i];
      return (
        !original ||
        img.idImagenProducto !== original.idImagenProducto ||
        img.urlImagen !== original.urlImagen ||
        img.principalTipo !== original.principalTipo
      );
    });

    const seModificaronImagenes = imagenesCambiadas.length > 0 || imagenesEliminadas.length > 0;

    const seModificoOtroBloque = (
      seModificaronCategorias || seModificaronUnidades ||
      seModificoFicha || seModificaronImagenes
    );

    // 🔹 Incluir bloque principal si cambió
    if (seModificoBloquePrincipal) {
      cambios.codigo = formulario.codigo;
      cambios.nombre = formulario.nombre;
      cambios.descripcion = formulario.descripcion;
      cambios.precio = formulario.precio;
      cambios.descuento = formulario.descuento;
      cambios.stock = formulario.stock;
      cambios.id_marca = formulario.idMarca;
      cambios.urlImagen1 = formulario.urlImagen1;
      cambios.urlImagen2 = formulario.urlImagen2;
      cambios.ficha = formulario.ficha;
    }

    // 🔹 Incluir código y nombre si solo cambió otro bloque
    else if (seModificoOtroBloque) {
      cambios.codigo = formulario.codigo;
      cambios.nombre = formulario.nombre;
    }

    // 🔹 Categorías
    if (seModificaronCategorias) {
      cambios.Categoria = formulario.categorias.map(c =>({
        Id_categoria: c.id_categoria
      }));
    }

    // 🔹 Unidades
    if (seModificaronUnidades) {
      cambios.Unidad = formulario.unidades.map(u => ({
        Id_unidad: u.id_unidad
      }));
    }

    // 🔹 Ficha técnica
    if (seModificoFicha) {
      cambios.archivoFicha = archivoFicha;
    }

    // 🔹 Imágenes nuevas o modificadas
    if (imagenesCambiadas.length > 0) {
      cambios.imagenes = imagenes.map((img, i) => {
        const nombreArchivo = `imagen_${i}.webp`;

        // Solo incluir imagenArchivo si esta imagen fue modificada
        const original = imagenesOriginales[i];
        const fueModificada =
          !original ||
          img.idImagenProducto !== original.idImagenProducto ||
          img.urlImagen !== original.urlImagen ||
          img.principalTipo !== original.principalTipo;

        if (fueModificada && img.imagenBlob) {
          cambios[`imagenArchivo_${i}`] = img.imagenBlob;
        }

        return {
          IdImagenProducto: img.idImagenProducto,
          UrlImagen: img.urlImagen,
          NombreArchivo: nombreArchivo,
          EsPrincipal: img.principalTipo === 1,
          EsPrincipal2: img.principalTipo === 2
        };
      });
    }

    // 🔹 Imágenes eliminadas
    if (imagenesEliminadas.length > 0) {
      cambios.imagenesEliminadas = imagenesEliminadas;
    }

    return cambios;
  };


  const handleGuardarCambios = async () => {
    if (!hayCambios()) {
      alert("No se han realizado cambios.");
      return;
    }
    const cambios = obtenerCambios();

    if (cambios.codigo === "" || cambios.nombre === "" || cambios.precio === "" || cambios.stock === "" || cambios.id_marca === "") {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }
    
    const sinImagenesNuevas = !Array.isArray(cambios.imagenes) || cambios.imagenes.length === 0;
    const seEliminaronImagenes = Array.isArray(cambios.imagenesEliminadas) && cambios.imagenesEliminadas.length > 0;
    const sinImagenesOriginales = imagenesOriginales.length === 0;

    if ((sinImagenesNuevas && sinImagenesOriginales) || (sinImagenesNuevas && seEliminaronImagenes)) {
      const continuar = confirm(
        "Advertencia: No se estan estableciendo imagenes para este producto. ¿Desea continuar? Se mostrará una imagen auxiliar por defecto."
      );
      if (!continuar) return;
    }

    const categoriasActuales = formulario.categorias ?? [];
    const unidadesActuales = formulario.unidades ?? [];

    if (categoriasActuales.length < 1 || unidadesActuales.length < 1) {
      alert("Debe seleccionar al menos una categoría y una unidad de medida.");
      return;
    }

    setGuardando(true);
    try 
    { 
      const response = await editarProducto(formulario.idProducto, cambios);
      if (response.ValorConsulta == "1" || response.valorConsulta == "1") 
      {
        alert("Producto editado correctamente");
      }
      else
      {
        alert("Error al editar el producto: " + response.MensajeConsulta + response.ValorConsulta);
      }
      if (onCancel) onCancel();
    } 
    catch (error) 
    {
      alert("Hubo un error al editar el producto");
    }
    finally
    {
      setGuardando(false); // ⛔ Desbloquea el botón
    }
  };

  const handleVerFicha = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    } else {
      alert("No hay ficha técnica disponible.");
    }
  };

  useEffect(() => {
    if (modalImagenesAbierto) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [modalImagenesAbierto]);


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Editar Producto</h2>

      {cargando || !formulario ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, idx) => (
            <div key={idx}>
              <Skeleton className="h-5 w-1/2 mb-2" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
          ))}

          {/* Simulación de imágenes */}
          <div className="md:col-span-2 flex gap-4">
            {[1, 2].map((_, idx) => (
              <div key={idx} className="w-[180px]">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="aspect-square w-full rounded" />
              </div>
            ))}
          </div>

          {/* Simulación de botones y combos */}
          <div>
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
          <div>
            <Skeleton className="h-5 w-1/2 mb-2" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-5 w-1/3 mb-2" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        </div>
      ) : (
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
            <label className="block mb-1 font-semibold">Nueva Ficha Técnica (opcional)</label>
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

          {/* Botón Ver Ficha Técnica */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold">Ficha Técnica</label>
            <Button
              onClick={handleVerFicha}
              className="mt-2 bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Ver Ficha Técnica
            </Button>
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
      )}

      {/* Botones */}
      <div className="flex gap-4 mt-6">
        <Button
          onClick={handleGuardarCambios}
          disabled={!hayCambios() || guardando}
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

      {/* 🚩 Modal Imágenes */}
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
            {arrastrando && (
              <div className="absolute inset-0 bg-white/50 border-4 border-black-500 z-50 pointer-events-none flex items-center justify-center">
                <span className="text-lg rounded p-2 bg-[rgba(0,0,0,0.7)] font-bold text-blue-50">Suelta la imagen aquí</span>
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-4">
                Imágenes del Producto
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setPrincipalMode(1)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs cursor-pointer"
                >
                  Principal 1
                </button>
                <button
                  onClick={() => setPrincipalMode(2)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs cursor-pointer"
                >
                  Principal 2
                </button>
                <button
                  onClick={handleResetearPrincipales}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs cursor-pointer"
                >
                  Resetear
                </button>
                <button
                  disabled={historialIndex <= 0}
                  onClick={handleUndo}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs cursor-pointer" 
                >
                  Deshacer
                </button>
                <button
                  disabled={historialIndex >= historial.length - 1}
                  onClick={handleRedo}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs cursor-pointer"
                >
                  Rehacer
                </button>
                <button
                  onClick={() => setModalImagenesAbierto(false)}
                  className="text-gray-700 text-2xl hover:cursor-pointer"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Grid de imágenes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagenes.length > 0 &&
                imagenes.map((img, index) => {
                  let borderClass = "border-gray-300"; // Default
                  let label = "";

                  if (img.principalTipo === 1) {
                    borderClass = "ring-4 ring-blue-500"; // Azul
                    label = "Imagen principal 1";
                  } else if (img.principalTipo === 2) {
                    borderClass = "ring-4 ring-red-500"; // Rojo
                    label = "Imagen principal 2";
                  }

                  return (
                    <div
                      key={`${img.idImagenProducto || index}-${img.principalTipo}`}
                      className="flex flex-col items-center border p-2 rounded shadow relative cursor-pointer"
                      onClick={() => principalMode && marcarComoPrincipal(img.idImagenProducto)} // <--- 🚩 click en imagen
                    >
                      {/* Botón Eliminar */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // 🚩 Agregado: Previene click de marcar como principal
                          handleEliminarImagen(img.idImagenProducto);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        title="Eliminar imagen"
                      >
                        &times;
                      </button>

                      {/* Imagen con cuadrado 1:1 */}
                      <div className="w-full aspect-square">
                        <img
                          src={img.imagenUrlTemporal}
                          alt={`Imagen ${index + 1}`}
                          className={`object-cover w-full h-full rounded ${borderClass}`}
                        />
                      </div>

                      {/* Texto debajo, no altera el cuadrado */}
                      {label && (
                        <span className="mt-2 text-sm font-semibold">{label}</span>
                      )}
                    </div>
                  );
                })
              }

              {/* Botón de Agregar Imagen */}
              <div
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded cursor-pointer aspect-square"
                onClick={() => document.getElementById('fileUploadNuevo').click()}
              >
                <span className="text-4xl text-gray-500">+</span>
                <span className="text-sm text-gray-500">Agregar Imagen</span>
                <input
                  id="fileUploadNuevo"
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
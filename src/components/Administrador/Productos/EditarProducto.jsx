"use client";

import { useState, useEffect, useRef, useCallback} from "react";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import CropperModal from "@/components/Administrador/CropperModal";
import FloatingWindow from "@/components/Administrador/FloatingWindow";
import { editarProducto, obtenerCategoriasAxios, obtenerMarcasAxios, obtenerUnidades, obtenerProductoPorId, ObtenerImagenProducto, ObtenerArchivoFicha } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

{/* Secciones del panel creacion de productos */}
{/*--------------------------------------------------------------------------------------------------------------------------
1       Seccion de manejo de imagenes
1.1     Agregar imagen 
1.2     Manejo de imagen cortada 
1.3     Eliminar Imagen 
1.4     Historial para el control de imagenes
2       Buscador de google 
2.1     Procesamiento de la busqueda 
2.1.1   Verificacion de algun texto en el input
2.1.2   Activar buscador al presiones enter
2.1.3   Activa el buscador e inicia la busqueda al darle click al boton de google
2.1.4   Activa el buscador e inicia la busqueda al darle click al input del buscador en caso de que haya texto 
2.1.5   Limpia el valor del input del buscador de google 
2.2     Procesamiento de imagenes resultado 
2.2.1   Selecciona las imagenes del resultado del buscador al dar click sobre ellas 
2.2.2   Inicia el panel de cargando y procesa la imagen 
2.2.3   Prueba si la imagen es descargable 
2.2.4   Se inicia la transaferencia de imagenes al cropper 
2.2.5   Continua la siguiente imagen y libera aquellas que fueron procesadas 
2.3     Pasar nombre del producto al input de google 
2.4     Eventos y atajos para la busqueda 
2.5     Descarga de la api de google 
3       Seccion del modal de imagenes 
3.1     Marcado de principales 
3.2     Generacion del evento pegar en el modal de imagenes 
3.3     Bloque del fondo y el scrollal abrir el panel 
4       Seccion de pdf 
5       Seccion del atajos de ventanas 
6       Bloque principal del producto 
6.1     Declaracion de estados 
6.2     Carga inicial de datos 
6.3     Actualizacion de datos (se usa en caso de haber creado una nueva marca, categoria o un nuevo producto) 
6.4     Carga de todos los datos de producto
6.5     Carga de las imagenes
6.6     Actualizar el formulario
7       Validacion de cambios
7.1     se modifico la informacion principal
7.2     se modificaron las imagenes
7.3     se modifico la ficha tecnica
7.4     se modificaron las categorias
7.5     se modificaron las unidades
7.6     validacion general
7.7     creacion de un objeto con los campos que cambiaron
7.8     Llamada a la api con los campos que cambiaron

--------------------------------------------------------------------------------------------------------------------------*/}
{/* Bloques html */}
{/*--------------------------------------------------------------------------------------------------------------------------
Codigo
Nombre
Descripcion
Precio
Descuento
Stock

Imagenes Principales
	Imagen Principal 1
	Imagen Principal 2
Boton para abrir las imagenes
Input para nueva ficha tecnica

Combos box
Marca
Categoria
	Chips de categorias seleccionadas
Unidad
	Chips de unidades seleccionadas

Botones finales
	Boton guardado
	Boton Cancelar o cerrar

Modal Imagenes
	Superposicion durante el arrastre
	Header y controles
		Titulo
		Boton Procesar
		Bloque buscador
		Botones (marcadores de principales)
		Boton cerrado de modal
	Grido de imagenes
		Boton agregar

CropperModal
Carga para las imagenes de google
--------------------------------------------------------------------------------------------------------------------------*/}

export default function EditarProducto({ producto, onCancel, onFinalizar }) {

  {/* 1 Seccion de manejo de imagenes */}
  const [imagenes, setImagenes] = useState([]);
  const [imagenOriginal, setImagenOriginal] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [historialIndex, setHistorialIndex] = useState(-1);
  const [imagenesOriginales, setImagenesOriginales] = useState([]);
  const [imagenesEliminadas, setImagenesEliminadas] = useState([]);

  {/* 1.1 Agregar imagen */}
  const handleAgregarImagen = (event, tipoPrincipal = null) => {
    if(imagenes.length < 5)
    {
      console.log(imagenes)
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result;
          const img = new Image();
          img.onload = () => {
            setImagenOriginal(dataUrl);
            setIsCropperOpen(true);
            setPrincipalMode(tipoPrincipal); // <- importante: ya dejamos marcado el tipo
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
      event.target.value = "";
    }
    else
    {
      alert("los productos solo pueden tener hasta 5 imagenes")
    }
    event.target.value = "";
  };

  {/* 1.2 Manejo de imagen cortada */}
  const handleImagenCortada = (blob) => {
    const tipo = principalMode; // o mejor aún: usa ref como en el primer bloque
    if(imagenes.length <= 5)
    {
      const urlTemporal = URL.createObjectURL(blob);

      const nuevaImagen = {
        idImagenProducto: Math.floor(Math.random() * 100000), // id amplio
        imagenBlob: blob,
        imagenUrlTemporal: urlTemporal,
        urlImagen: "",
        principalTipo: tipo,
      };

      let nuevoEstado;

      if (tipo === 1 || tipo === 2) {
        const estadoFiltrado = imagenes.filter(img => img.principalTipo !== tipo);
        nuevoEstado = [...estadoFiltrado, nuevaImagen];
      } else {
        nuevoEstado = [...imagenes, nuevaImagen];
      }

      guardarEnHistorial(nuevoEstado);
      setImagenes(nuevoEstado);

      // ✅ no limpiar principalMode aquí, mejor cuando realmente cambies de contexto
      // setPrincipalMode(null);
    }else{
      alert("se alcanzo el maximo de imagenes producto")
    }
    // ✅ opcional: manejar la cola si la usas
    if (colaRef?.current?.length > 0) {
      abrirSiguiente();
    } else {
      setIsCropperOpen(false);
    }
  };

  {/* 1.3 Eliminar Imagen */}
  const handleEliminarImagen = (idImagenProducto) => {
    const imagenEliminada = imagenes.find(img => img.idImagenProducto === idImagenProducto);
    if (imagenEliminada?.urlImagen) {
      setImagenesEliminadas(prev => [...prev, imagenEliminada.urlImagen]);
    }

    const nuevoEstado = imagenes.filter(img => img.idImagenProducto !== idImagenProducto);
    guardarEnHistorial(nuevoEstado);
    setImagenes(nuevoEstado);
  };

  {/* 1.4 Historial para el control de imagenes */}
  const guardarEnHistorial = (nuevoEstado) => {
    const nuevoHistorial = historial.slice(0, historialIndex + 1);
    nuevoHistorial.push(nuevoEstado);
    setHistorial(nuevoHistorial);
    setHistorialIndex(nuevoHistorial.length - 1);
  };

  {/* 2 Motor de busqueda programable */}

  const [buscador, setBuscador] = useState(false);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const colaRef = useRef([]);
  const [loading,setLoading] = useState(false);
  const fallidasRef = useRef(new Set());

  {/* 2.1 Procesamiento de la busqueda */}

  {/* 2.1.1 Verificacion de algun texto en el input */}
  const isEmptyInput = useCallback(() => {
    const input = document.getElementById("gsc-i-id1");
    return !input || !input.value.trim();
  }, []);
  
  {/* 2.1.2 Activar buscador al presiones enter */}
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      const input = document.getElementById("gsc-i-id1");
      if (input.value.trim()) {
        setBuscador(true);
      }
    }
  }, []);
  
  {/* 2.1.3 Activa el buscador e inicia la busqueda al darle click al boton de google */}
  const handleClick = useCallback(
    (e) => {
      if (!isEmptyInput()) {
        setBuscador(true);
      }
    },
    [isEmptyInput]
  );
  
  {/* 2.1.4 Activa el buscador e inicia la busqueda al darle click al input del buscador en caso de que haya texto  */}
  const handleClick2 = useCallback(
    (e) => {
      if (!isEmptyInput()) {
        const btn = document.getElementsByClassName("gsc-search-button-v2")[0];
        if (btn) {
          btn.click();
        }
        setBuscador(true);
      }
    },
    [isEmptyInput]
  );
  
  {/* 2.1.5 Limpia el valor del input del buscador de google */}
  const LimpiezaManual =()=> {
    setTimeout(()=>{
      const input = document.getElementById("gsc-i-id1");
      input.value="";
    },100)
  };

  {/* 2.2 Procesamiento de imagenes resultado */}

  {/* 2.2.1 Selecciona las imagenes del resultado del buscador al dar click sobre ellas */}
  const handleClick3 = async (e) => {
    const targetDiv = e.target.closest(
      ".gsc-imageResult.gsc-imageResult-popup.gsc-result"
    );
    if (!targetDiv) return;

    const imgGrande = targetDiv.querySelector("img.gs-imagePreview");
    const srcGrande = imgGrande?.src || null;
    if (!srcGrande) return;

    // ❌ Si ya falló antes → bloquear
    if (fallidasRef.current.has(srcGrande)) {
      alert("⚠️ Esta imagen ya fue descartada, elige otra.");
      return;
    }

    // ✅ Quitar si ya está seleccionada
    if (targetDiv.classList.contains("seleccionada")) {
      targetDiv.classList.remove("seleccionada");
      setSeleccionadas((prev) => prev.filter((s) => s !== srcGrande));
      return;
    }

    // ⚠️ Máximo 5
    if (seleccionadas.length >= 5) {
      alert("⚠️ Solo puedes seleccionar hasta 5 imágenes.");
      return;
    }

    // 🔄 Validar sin loading (loading se usa al procesar)
    const urlFinal = await validarImagen(srcGrande);

    if (!urlFinal) {
      alert("⚠️ Esta imagen no se puede procesar.");
      fallidasRef.current.add(srcGrande);
      targetDiv.classList.add("Error");
      return;
    }

    // ✅ Si pasó validación
    targetDiv.classList.add("seleccionada");
    setSeleccionadas((prev) => [...prev, urlFinal]);
  };

  {/* 2.2.2 Inicia el panel de cargando y procesa la imagen */}
  const validarImagen = async (src) => {
    setLoading(true);

    try {
      // 1. HEAD directo (rápido si lo permite)
      try {
        const response = await fetch(src, { method: "HEAD", mode: "cors" });
        if (response.ok) {
          const cargaOk = await probarCargaImagen(src);
          if (cargaOk) return src;
        }
      } catch (err) {
        console.warn("HEAD directo falló:", err);
      }

      // 2. GET vía API/proxy (porque HEAD no está soportado)
      try {
        const apiBase = process.env.NEXT_PUBLIC_SIGNALR_URL;
        const apiUrl = `${apiBase}/CTarchivos/download-image?url=${encodeURIComponent(src)}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          mode: "cors",
          cache: "no-store"
        });

        if (response.ok) {
          const cargaOk = await probarCargaImagen(apiUrl);
          if (cargaOk) return apiUrl;
        }
      } catch (err) {
        console.warn("GET vía API falló:", err);
      }

      // ❌ Si nada funcionó
      return null;
    } catch (err) {
      console.warn("Error validando imagen:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  {/* 2.2.3 Prueba si la imagen es descargable */}
  const probarCargaImagen = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // para detectar CORS válido
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url + (url.includes("?") ? "&" : "?") + "cb=" + Date.now(); // cache-busting
    });
  };

  {/* 2.2.4 Se inicia la transaferencia de imagenes al cropper */}
  const procesarImagenes = () => {
    if (seleccionadas.length === 0) {
      alert("No has seleccionado ninguna imagen.");
      return;
    }

    setBuscador(false);

    // clonar seleccionadas a la cola
    colaRef.current = [...seleccionadas];
    abrirSiguiente();
  };

  {/* 2.2.5 Continua la siguiente imagen y libera aquellas que fueron procesadas */}
  const abrirSiguiente = () => {
    if (colaRef.current.length === 0) return;

    const siguiente = colaRef.current.shift();
    setSeleccionadas((prev) => prev.filter((s) => s !== siguiente));

    setLoading(true);
    setImagenOriginal(siguiente);
    setIsCropperOpen(true);
  };
  
  {/* 2.4 Eventos y atajos para la busqueda */}
  useEffect(() => {
    setTimeout(() => {
      const btnLimpiar = document.querySelector(".gsst_a");
      const input = document.getElementById("gsc-i-id1");
      const btn = document.querySelector(".gsc-search-button.gsc-search-button-v2");

      if (input) {     
        input.addEventListener("keydown", handleKeyDown);
        input.addEventListener("click", handleClick2);
      }

      if (btn) {
        btn.addEventListener("click", handleClick);
      }

      if(btnLimpiar){
        btnLimpiar.addEventListener("click",() => {setBuscador(false), LimpiezaManual()})
      }

      return () => {
        if (input) input.removeEventListener("keydown", handleKeyDown);input.removeEventListener("keydown", handleClick);
        if (btn) btn.removeEventListener("click", handleClick);
        if (btnLimpiar) btn.removeEventListener("click", () => {setBuscador(false), LimpiezaManual()})
      };
    
    }, 1500);
  }, [handleKeyDown]);

  {/* 2.5 Descarga de la api de google */}
  useEffect(() => {
    if (!document.getElementById("google-cse-script"))
    {
      const script = document.createElement("script");
      script.id = "google-cse-script";
      script.src = "https://cse.google.com/cse.js?cx=36e3a22a36ee94c5d";
      script.async = true;
      document.body.appendChild(script);
    }

    document.addEventListener("click", handleClick3);
    return () => document.removeEventListener("click", handleClick3);
  }, []);

  {/* 3 Seccion del modal de imagenes */}
  const [modalImagenesAbierto, setModalImagenesAbierto] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);
  const [principalMode, setPrincipalMode] = useState(null);

  {/* 3.1 Marcado de principales */}
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

  {/* 3.2 Generacion del evento pegar en el modal de imagenes*/}
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

  {/* 3.3 Bloque del fondo y el scrollal abrir el panel */}
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

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

  {/* 4 Seccion de pdf */}
  const [pdfUrl, setPdfUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [archivoFicha, setArchivoFicha] = useState(null);

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

  const handleVerFicha = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    } else {
      alert("No hay ficha técnica disponible.");
    }
  };

  {/* 5 Manejo de modals y ventanas */}
  const [ventanas, setVentanas] = useState({
    marca: false,
    categoria: false,
    unidad: false
  });
  
  {/* Abrir Ventana */}
  const abrirVentana = (tipo) =>
  setVentanas((prev) => ({ ...prev, [tipo]: true }));
  
  {/* Cerrar Ventana */}
  const cerrarVentana = async (tipo) => {
    await recargarDatos(tipo);
    setVentanas((prev) => ({ ...prev, [tipo]: false }));
  };

  {/* Cerrar Modals */}
  const CerrarModals =()=> {
    if (isCropperOpen) {
      // Paso 1: cerrar cropper
      setIsCropperOpen(false);
      setImagenOriginal(null);
    } else if (modalImagenesAbierto) {
      // Paso 2: si ya no hay cropper pero sí modal, cerrar modal
      setModalImagenesAbierto(false);
    } else {
      setVentanas((prev) => ({ ...prev, marca: false }));
      setVentanas((prev) => ({ ...prev, categoria: false }));
      setVentanas((prev) => ({ ...prev, unidad: false }));
    }
  };

  {/* 6 Bloque principal del producto */}

  {/* 6.1 Declaracion de estados */}
  const [productoCompleto, setProductoCompleto] = useState(null);
  const [formulario, setFormulario] = useState(null);

  const [marcas, setMarcas] = useState([]);

  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  const [unidades, setUnidades] = useState([]);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  
  {/* 6.2 Carga inicial de datos */}
  useEffect(() => {
    async function cargarDatos() {
      const [cats, marcasData, unidadesData] = await Promise.all([
        obtenerCategoriasAxios(),
        obtenerMarcasAxios(),
        obtenerUnidades(),
      ]);

      setCategorias(cats);
      setMarcas(marcasData);
      setUnidades(unidadesData);
    }
  
    cargarDatos();
  }, []);

  {/* 6.3 Actualizacion de datos (se usa en caso de haber creado una nueva marca, categoria o un nuevo producto) */}
  const recargarDatos = async (tipo) => {
    if (tipo === 'unidad') {
      const unidadesActualizadas = await obtenerUnidades();
      setUnidades(unidadesActualizadas);
    } else if (tipo === 'categoria') {
      const categoriasActualizadas = await obtenerCategoriasAxios();
      setCategorias(categoriasActualizadas);
    } else if (tipo === 'marca') {
      const marcasActualizadas = await obtenerMarcasAxios();
      setMarcas(marcasActualizadas);
    }
  };

  {/* 6.4 Carga de todos los datos de producto */}
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

        setProductoCompleto(productoCompleto);

      } catch (error) {

      } finally {
        setCargando(false);
      }
    }
    fetchData();
  }, [producto]);

  {/* 6.5 Carga de las imagenes */}
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
                idImagenProducto: img.idImagen,
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
      setImagenesOriginales(imagenesCargadas.map(img => ({ ...img })));
    };

    if (productoCompleto?.imagenes?.length > 0) {
      cargarImagenes();
    }
  }, [productoCompleto]);

  {/* 6.6 Atualizar el formulario */}
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  {/* 7 Validacion de cambios */}

  {/* 7.1 se modifico la informacion principal */}
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

  {/* 7.2 se modificaron las imagenes */}
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

  {/* 7.3 se modifico la ficha tecnica */}
  const seModificoFicha = () => archivoFicha !== null;

  {/* 7.4 se modificaron las categorias */}
  const seModificaronCategorias = () => {
    const originales = (productoCompleto.categoria ?? []).map(c => c.id_categoria).sort();
    const actuales = (formulario.categorias ?? []).map(c => c.id_categoria).sort();
    return JSON.stringify(originales) !== JSON.stringify(actuales);
  };

  {/* 7.5 se modificaron las unidades */}
  const seModificaronUnidades = () => {
    const originales = (productoCompleto.unidad ?? []).map(u => u.id_unidad).sort();
    const actuales = (formulario.unidades ?? []).map(u => u.id_unidad).sort();
    return JSON.stringify(originales) !== JSON.stringify(actuales);
  };

  {/* 7.6 validacion general */}
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

  {/* 7.7 Creacion de un objeto con los campos que cambiaron */}
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

    const imagenesCambiadas = imagenes.filter(img => {
      const original = imagenesOriginales.find(o => o.idImagenProducto === img.idImagenProducto);
      if (!original) return true;
      return (
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
      cambios.Categoria = formulario.categorias.map(c => ({
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

  {/* 7.8 LLamada a la api con los campos que cambiaron*/}
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
    try {
      const response = await editarProducto(formulario.idProducto, cambios);

      if (response.valorConsulta === "1") {
        alert("Producto editado correctamente "+ response.valorConsulta);
      }
      else {
        alert("Error al editar el producto: " + response.mensajeConsulta+ " " + response.valorConsulta);
      }
      if (onCancel) onCancel();
    }
    catch (error) {
      alert("Hubo un error al editar el producto");
    }
    finally {
      setGuardando(false); // ⛔ Desbloquea el botón
    }
  };

  {/* 2.3 Pasar nombre del producto al input de google */}
  useEffect(() => {
    const inputggg = document.getElementById("gsc-i-id1");

    if (inputggg) {
      inputggg.value = formulario.nombre;
    }
  },[modalImagenesAbierto]);;

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
              id="nombre"
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

                {/* Envolvemos en label para que al hacer click se active el input */}
                <label className="aspect-square w-full border rounded bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer">
                  {(() => {
                    const img1 = imagenes.find(img => img.principalTipo === 1);
                    return img1 ? (
                      <img
                        src={img1.imagenUrlTemporal}
                        className="object-contain w-full h-full"
                        alt="Imagen Principal 1"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No asignada</span>
                    );
                  })()}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleAgregarImagen(e, 1)}
                  />
                </label>
              </div>

              {/* Imagen Principal 2 */}
              <div className="flex flex-col items-center w-[180px]">
                <label className="block mb-1 font-semibold text-center">Imagen Principal 2</label>
                <label className="aspect-square w-full border rounded bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer">
                  {(() => {
                    const img2 = imagenes.find(img => img.principalTipo === 2);
                    return img2 ? (
                      <img
                        src={img2.imagenUrlTemporal}
                        className="object-contain w-full h-full"
                        alt="Imagen Principal 2"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No asignada</span>
                    );
                  })()}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleAgregarImagen(e, 2)} // ⬅ principalTipo = 2
                  />
                </label>
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

          {/* Input para ficha técnica (crear/editar) */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold">Nueva Ficha Técnica (opcional)</label>
            <div className="flex gap-4 items-center w-full">
              {/* Input oculto */}
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="fileUpload"
                ref={fileInputRef}
              />

              {/* Botón subir PDF */}
              <label
                htmlFor="fileUpload"
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 text-center truncate"
              >
                {archivoFicha ? archivoFicha.name : "Subir PDF"}
              </label>

              {/* Botón Visualizar */}
              <button
                type="button"
                className="h-10 w-10 flex items-center justify-center bg-blue-500 text-white rounded hover:bg-blue-600 transition"
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
                className="h-10 w-10 flex items-center justify-center bg-red-500 text-white rounded hover:bg-red-600 transition"
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
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Marca</label>

            <div className="flex items-center gap-2">
              <select
                name="idMarca"
                value={formulario.idMarca}
                onChange={handleChange}
                className="flex-1 border border-gray-300 rounded p-2"
              >
                <option value="">Selecciona una marca</option>
                {marcas.map((marca) => (
                  <option key={marca.id_marcas} value={marca.id_marcas}>
                    {marca.nombre}
                  </option>
                ))}
              </select>

              <button
                onClick={() => abrirVentana('marca')}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                title="Agregar nueva marca"
              >
                +
              </button>
            </div>

            {/* Modal flotante */}
            {ventanas.marca && (
              <FloatingWindow
                title="Nueva Marca"
                tipo="marca"
                onClose={() => cerrarVentana('marca')}
              />
            )}
          </div>

          {/* Categoría */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Categorías</label>

            {/* Chips de categorías seleccionadas */}
            {formulario.categorias.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formulario.categorias.map((cat) => (
                  <span key={cat.id_categoria} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center">
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
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Select + botón en línea */}
            <div className="flex items-center gap-2">
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
                className="flex-1 border border-gray-300 rounded p-2"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>

              <button
                onClick={() => abrirVentana('categoria')}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                title="Agregar nueva categoría"
              >
                +
              </button>
            </div>

            {/* Modal flotante */}
            {ventanas.categoria && (
              <FloatingWindow
                title="Nueva Categoría"
                tipo="categoria"
                onClose={() => cerrarVentana('categoria')}
              />
            )}
          </div>

          {/* Unidad */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Unidades de medida</label>

            {/* Chips de unidades seleccionadas */}
            {formulario.unidades.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formulario.unidades.map((unidad) => (
                  <span key={unidad.id_unidad} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm flex items-center">
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
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Select + botón en línea */}
            <div className="flex items-center gap-2">
              <select
                value={unidadSeleccionada}
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
                  setUnidadSeleccionada(""); // Resetear select
                }}
                className="flex-1 border border-gray-300 rounded p-2"
              >
                <option value="">Selecciona una unidad</option>
                {unidades.map((u) => (
                  <option key={u.id_unidad} value={u.id_unidad}>
                    {u.nombre}
                  </option>
                ))}
              </select>

              <button
                onClick={() => abrirVentana('unidad')}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                title="Agregar nueva unidad"
              >
                +
              </button>
            </div>

            {/* Modal flotante para agregar nueva unidad */}
            {ventanas.unidad && (
              <FloatingWindow
                title="Nueva Unidad de Medida"
                tipo="unidad"
                onClose={() => cerrarVentana('unidad')}
              />
            )}
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-4 mt-6">
        <Button
          onClick={async () => {
            await handleGuardarCambios();
            onFinalizar();
          }}
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
      <div
        id="CampoModal"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            CerrarModals();
          }
        }}
        className={` fixed inset-0 z-50 flex items-center justify-center backdrop-blur-none bg-black/20 transition-opacity duration-300 ease-in-out ${modalImagenesAbierto ? "" : "hidden"}`}
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
          <div className="flex flex-col md:flex-row md:items-center border-b border-gray-200 pb-2 mb-4 gap-4">
            {/* Título */}
            <h3 className="text-xl font-bold flex items-center gap-4 text-gray-800 text-center md:text-left justify-center md:justify-start">
              Imágenes del Producto
            </h3>

            {/* Botón Procesar */}
            <div
              className={`flex justify-center transition-all duration-500 ease-in-out overflow-hidden ${
                buscador ? "w-auto opacity-100" : "w-0 h-0 opacity-0"
              }`}
            >
              <button
                id="BtnProcesar"
                onClick={() => procesarImagenes()}
                className="h-10 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md font-medium transition"
              >
                Procesar imágenes
              </button>
            </div>

            {/* Bloque buscador */}
            <div
              className="h-full w-full md:flex-1 flex transition-all duration-500 ease-in-out"
            >
              <div
                className={`w-full max-w-md mx-auto transition-transform duration-700 ease-in-out ${
                  buscador ? "translate-x-0" : "-translate-x-[0%]"
                }`}
              >
                <div id="Buscador" className="gcse-searchbox" />
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-row gap-2 w-full md:w-auto justify-end md:ml-auto">
              <div
                className={`flex gap-2 transition-all duration-500 ease-in-out overflow-hidden ${
                  buscador ? "w-0 opacity-0 scale-90" : "w-auto opacity-100 scale-100"
                }`}
              >
                <button
                  onClick={() => setPrincipalMode(1)}
                  className="h-10 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium transition"
                >
                  Principal 1
                </button>
                <button
                  onClick={() => setPrincipalMode(2)}
                  className="h-10 px-4 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium transition"
                >
                  Principal 2
                </button>
              </div>

              {/* Botón cerrar siempre visible */}
              <button
                onClick={() => {
                setModalImagenesAbierto(false); 
                setBuscador(false);}}
                className="h-10 w-10 flex items-center justify-center bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-lg font-bold transition"
              >
                &times;
              </button>
            </div>
          </div>
          <div
            className={`mb-5 transition-all duration-500 ease-in-out overflow-y-auto ${
              buscador ? "h-[600px]" : "h-[0px]"
            }`}
          >
            <div className="gcse-searchresults"></div>
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

      {/* Loader global */}
      <CropperModal
        imagenOriginal={imagenOriginal}
        isOpen={isCropperOpen}
        onClose={() => {
          setIsCropperOpen(false);
          setImagenOriginal(null);
        }}
        onCropped={handleImagenCortada}
        onReady={() => setLoading(false)}
        ancho={550}
        alto={550}
      />
      
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white ml-4">Cargando imagen...</p>
        </div>
      )}
    </div>
  );
}
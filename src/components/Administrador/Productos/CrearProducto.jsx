"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Trash2} from "lucide-react";
import CropperModal from "@/components/Administrador/CropperModal";
import FloatingWindow from "@/components/Administrador/FloatingWindow";
import { obtenerCategoriasAxios, obtenerMarcasAxios, obtenerUnidades, crearProducto } from "@/lib/api";

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
3.3     Bloque del fondo y el scroll al abrir el panel 
4       Seccion de pdf 
5       Seccion del atajos de ventanas 
6       Bloque principal del producto 
6.1     Declaracion de estados 
6.2     Carga inicial de datos 
6.3     Actualizacion de datos (se usa en caso de haber creado una nueva marca, categoria o un nuevo producto) 
6.4     Atualizar el formulario 
6.5     Verificacion de campos y llamada a la api para registrar el producto 

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

export default function CrearProducto({ onCancel }) {

  {/* Seccion de manejo de imagenes */}
  const [imagenes, setImagenes] = useState([]);
  const [imagenOriginal, setImagenOriginal] = useState(null);
  const [historialIndex, setHistorialIndex] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [guardando, setGuardando] = useState(false);

  {/* 1.1.1 Agregar imagen */}
  const handleAgregarImagen = (event, tipo) => {
    if(imagenes.length < 5)
    {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        tipoPrincipalRef.current = tipo;
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
      event.target.value = "";
    }else{
      alert("los productos solo pueden tener hasta 5 imagenes")
    }
    event.target.value = "";
  };

  {/* 1.1.2 Manejo de imagen cortada */}
  const handleImagenCortada = (blob) => {
    const tipo = tipoPrincipalRef.current;
    if(imagenes.length<=5)
    {
      const urlTemporal = URL.createObjectURL(blob);
      const nuevaImagen = {
        idImagenProducto: Math.floor(Math.random() * 100000),
        imagenBlob: blob,
        imagenUrlTemporal: urlTemporal,
        urlImagen: "",
        principalTipo: tipo, // puede ser 1, 2 o null
      };

      let nuevoEstado;

      if (tipo === 1 || tipo === 2) {
        // Reemplazar solo la imagen del tipo correspondiente
        const estadoFiltrado = imagenes.filter(img => img.principalTipo !== tipo);
        nuevoEstado = [...estadoFiltrado, nuevaImagen];
      } else {
        // Agregar sin eliminar las demás
        nuevoEstado = [...imagenes, nuevaImagen];
      }

      guardarEnHistorial(nuevoEstado);
      setImagenes(nuevoEstado);
    }else{
      alert("se alcalzo el maximo de imagenes producto")
    }
    if (colaRef.current.length > 0) {
      abrirSiguiente();
    } else {
      setIsCropperOpen(false);
    }
  };

  {/* 1.1.3 Eliminar Imagen */}
  const handleEliminarImagen = (id) => {
    const nuevoEstado = imagenes.filter(img => img.idImagenProducto !== id);
    guardarEnHistorial(nuevoEstado);
    setImagenes(nuevoEstado);
  };

  {/* 1.1.4 Historial para el control de imagenes */}
  const guardarEnHistorial = (nuevoEstado) => {
    const nuevoHistorial = historial.slice(0, historialIndex + 1);
    nuevoHistorial.push(nuevoEstado);
    setHistorial(nuevoHistorial);
    setHistorialIndex(nuevoHistorial.length - 1);
  };

  useEffect(() => {
    totalRef.current = imagenes.length;
  }, [imagenes]);

  {/* 2 Buscador de google */}

  const [buscador, setBuscador] = useState(false);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const colaRef = useRef([]);
  const [loading,setLoading] = useState(false);
  const fallidasRef = useRef(new Set());
  const colaPendientesRef = useRef([]);
  const totalRef = useRef(0);

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
    },200)
  };

  {/* 2.2 Procesamiento de imagenes resultado */}

  {/* 2.2.1 Selecciona las imagenes del resultado del buscador al dar click sobre ellas */}
  const handleClick3 = (e) => {
    const targetDiv = e.target.closest(
      ".gsc-imageResult.gsc-imageResult-popup.gsc-result"
    );
    if (!targetDiv) return;

    const imgGrande = targetDiv.querySelector("img.gs-imagePreview");
    const srcGrande = imgGrande?.src || null;
    if (!srcGrande) return;

    if (fallidasRef.current.has(srcGrande)) {
      alert("⚠️ Esta imagen ya fue descartada, elige otra.");
      return;
    }

    if (targetDiv.classList.contains("seleccionada")) {
      targetDiv.classList.remove("seleccionada");
      setSeleccionadas((prev) => prev.filter((s) => s !== srcGrande));
      return;
    }

    if (totalRef.current >= 5) {
      alert("⚠️ Solo puedes seleccionar hasta 5 imágenes.");
      return;
    }

    // Marcar como cargando
    targetDiv.classList.add("cargando");

    // Agregar a la cola de pendientes
    colaPendientesRef.current.push({ src: srcGrande, el: targetDiv });

    // Arrancar el worker si no está en curso
    procesarCola();
  };

  const procesarCola = async () => {
    if (imagenes.length + colaPendientesRef.current.length + seleccionadas.length >= 5) {
      alert("⚠️ Solo puedes seleccionar hasta 5 imágenes.");
      return;
    }

    while (colaPendientesRef.current.length > 0) {
      const { src, el } = colaPendientesRef.current[0];

      const urlFinal = await validarImagen(src);

      if (urlFinal) {
        el.classList.remove("cargando");
        el.classList.add("seleccionada");
        setSeleccionadas((prev) => {
          const nuevo = [...prev, urlFinal];
          totalRef.current = imagenes.length + nuevo.length;
          return nuevo;
        });
      } else {
        el.classList.remove("cargando");
        el.classList.add("Error");
        fallidasRef.current.add(src);
      }

      // sacar el primero de la cola
      colaPendientesRef.current.shift();
    }
  };

  {/* 2.2.2 Inicia el panel de cargando y procesa la imagen */}
  const validarImagen = async (src) => {
    if (imagenes.length + colaPendientesRef.current.length + seleccionadas.length >= 5) {
      alert("⚠️ Solo puedes seleccionar hasta 5 imágenes.");
      return;
    }

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
    if (colaPendientesRef.current.length > 0) {
      alert("⚠️ Espera a que terminen de procesarse todas las imágenes.");
      return;
    }

    if (imagenes.length + seleccionadas.length > 5) {
      alert("⚠️ El máximo permitido es 5 imágenes en total.");
      return;
    }

    if (seleccionadas.length === 0) {
      alert("No has seleccionado ninguna imagen.");
      return;
    }

    // ✅ ya está libre
    setBuscador(false);
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

  {/* 2.3 Pasar nombre del producto al input de google */}

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
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [principalMode, setPrincipalMode] = useState(1);
  const tipoPrincipalRef = useRef(null);
  const [modalImagenesAbierto, setModalImagenesAbierto] = useState(false);  
  const [arrastrando, setArrastrando] = useState(false);

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

    guardarEnHistorial(nuevoEstado);
    setImagenes(nuevoEstado);
    setPrincipalMode(null);
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

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
    
  }, [modalImagenesAbierto]);

  {/* 3.3 Bloque del fondo y el scroll al abrir el panel */}
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
  const [archivoFicha, setArchivoFicha] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Por favor, selecciona un PDF válido.");
      e.target.value = "";
      return;
    }

    setArchivoFicha(file);
  };

  {/* 5 Seccion del atajos de ventanas */}
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
      setIsCropperOpen(false);
      setImagenOriginal(null);
    } else if (modalImagenesAbierto) {
      setModalImagenesAbierto(false);
    } else {
      setVentanas((prev) => ({ ...prev, marca: false }));
      setVentanas((prev) => ({ ...prev, categoria: false }));
      setVentanas((prev) => ({ ...prev, unidad: false }));
    }
  };

  {/* 6 Bloque principal del producto */}

  {/* 6.1 Declaracion de estados */}
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  const [marcas, setMarcas] = useState([]);

  const [unidades, setUnidades] = useState([]);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState("");

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

  {/* 6.4 Atualizar el formulario */}
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const inputggg = document.getElementById("gsc-i-id1");
    if (inputggg) {
      inputggg.value = formulario.nombre;
    }
  },[modalImagenesAbierto]);;

  {/* 6.5 Verificacion de campos y llamada a la api para registrar el producto */}
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
    ) {
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
      if (datosProducto.categoria.length >= 1 && datosProducto.unidad.length >= 1) {
        const response = await crearProducto(datosProducto);
        if (response.ValorConsulta === "1" || response.valorConsulta === "1") {
          alert("Producto creado correctamente");
          if (onCancel) onCancel();
        } else {
          alert("Error al crear producto: " + response.mensajeConsulta);
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
      <h2 className="text-2xl font-bold mb-6">Crear Producto</h2>
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
                  onChange={(e) => handleAgregarImagen(e, 2)}
                />
              </label>
            </div>
          </div>
        </div>
        
        {/* Boton para abrir las imagenes */}
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
          <div className="flex gap-4 items-center w-full">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="fileUpload"
              ref={fileInputRef}
            />

            {/* Botón subir PDF → ocupa todo el espacio libre */}
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

          {ventanas.marca && (
            <FloatingWindow
              title="Nueva Marca"
              tipo="marca"
              onClose={() => {cerrarVentana('marca'); CerrarModals();}}
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
              onClose={() => {cerrarVentana('categoria'); CerrarModals();}}
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
                setUnidadSeleccionada("");
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

          {/* Modal flotante */}
          {ventanas.unidad && (
            <FloatingWindow
              title="Nueva Unidad de Medida"
              tipo="unidad"
              onClose={() => {cerrarVentana('unidad'); CerrarModals();}}
            />
          )}
        </div>
      </div>

      {/* Botones finales */}
      <div className="flex gap-4 mt-6">
        {/* Boton guardado */}
        <Button
          onClick={handleGuardarProducto}
          disabled={guardando}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          {guardando ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
        {/* Boton Cancelar o cerrar */}
        <Button
          onClick={onCancel}
          className="bg-gray-400 text-white hover:bg-gray-500"
        >
          Cancelar
        </Button>
      </div>

      {/* Modal Imágenes */}
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

              {/* Botón cerrado de modal*/}
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

      {/* Carga para las imagenes de google */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white ml-4">Cargando imagen...</p>
        </div>
      )}
    </div>
  );
}

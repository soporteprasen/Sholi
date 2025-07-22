import axios from "axios";

{/* Apis de listados/Obtencion */ }

// Obtener productos Principales
export const obtenerProductos = async () => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/listarProductosPrincipales",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        Token: 'TOKENSUPERSECRETO',
        Vista: ""
      }
    }
    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener productos con descuento
export const obtenerProductosConDescuento = async () => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/ListarProductosDescuento",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        Token: "TOKENSUPERSECRETO",
      }
    }
    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Obtener lista de productos para el administrador
export const obtenerProductosAdmin = async () => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/listarProductos",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        Token: 'TOKENSUPERSECRETO',
      }
    }
    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//obtener productos filtrados
export const obtenerProductosFiltrados = async (id_marca, id_categoria, orden, orden2, desde, cantidad) => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/ListarProductosFiltrados",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        Token: "TOKENSUPERSECRETO",
        Id_marca: id_marca,
        Id_categoria: id_categoria,
        Orden: orden,
        Orden2: orden2,
        Desde: desde,
        Cantidad: cantidad,
      }
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerCoincidenciasBuscador = async (contenido, desde, cantidad, orden, orden2) => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/BuscadorIndex",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        token: "TOKENSUPERSECRETO",
        contenido: contenido,
        desde: desde,
        cantidad: cantidad,
        orden: orden,
        orden2: orden2,
      }
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error en obtenerCoincidenciasBuscador:", error);
    throw error;
  }
};

//obtener producto por ID
export const obtenerProductoPorId = async (idProducto) => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/ListarProductoxID",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        Token: "TOKENSUPERSECRETO",
        Id_producto: idProducto,
      },
      withCredentials: true
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//obtener producto por slug
export const obtenerProductoPorSlug = async (slug) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/ListarProductoPorSlug",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Token: "TOKENSUPERSECRETO",
        NombreSlug: slug,
      }),
      next: {
        revalidate: 60,
      },
    }
  );

  if (!res.ok) throw new Error("Error al obtener el producto");

  return res.json();
};

// Recorrer imagenes por url de la carpeta
export const RecorrerCarpetaImagenes = async (UrlCarpeta) => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/ListarImagenes",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        Token: "TOKENSUPERSECRETO",
        UrlImagen: UrlCarpeta,
      },
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

//traer imagen
export const ObtenerImagenProducto = async (urlRelativa) => {
  if (!urlRelativa || urlRelativa.trim() === "") {
    urlRelativa = "Default.webp";
  }
  try {
    const response = await axios({
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/imagen/" + urlRelativa,
      method: "GET",
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener Archivo Ficha
export const ObtenerArchivoFicha = async (urlRelativa) => {
  try {
    const response = await axios({
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/archivoFicha/" + urlRelativa,
      method: "GET",
      responseType: "blob", // 👈 para recibir como archivo
    });

    return response.data; // Devuelve el blob de PDF
  } catch (error) {
    throw error;
  }
};

// Obtener categorías de productos
export async function obtenerCategorias() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SIGNALR_URL}/CTproductos/listarCategoriasProductos`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Token: "TOKENSUPERSECRETO",
      }),
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) throw new Error("Error al obtener categorías");

  return res.json();
}

// Obtener Producto relacionados
export const ObtenerProductoRelacionados = async (idProducto) => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/BuscarProductoRelacionados",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        Token: "TOKENSUPERSECRETO",
        Id_producto: idProducto
      },
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Obtener marcas de productos
export async function obtenerMarcas() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SIGNALR_URL}/CTproductos/listarMarcasProductos`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Token: "TOKENSUPERSECRETO",
      }),
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) throw new Error("Error al obtener marcas");

  return res.json();
}

// Traer mensaje Wsp
export const obtenerMensajesWsp = async () => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/TraerMensajeWsp",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        Token: "TOKENSUPERSECRETO",
      },
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Traer unidades de medida
export const obtenerUnidades = async () => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/listarUnidadesMedida",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        Token: "TOKENSUPERSECRETO",
      },
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

{/* Apis de creación/registro */ }

// Crear producto
export const crearProducto = async (datosProducto) => {
  try {
    const formData = new FormData();

    formData.append("Token", "TOKENSUPERSECRETO");

    for (const key in datosProducto) {
      const valor = datosProducto[key];

      if (key === "archivoFicha" && valor instanceof File) {
        formData.append("ArchivoFicha", valor);
      } else if (key === "imagenes") {
        const imagenesFiltradas = valor.filter(img =>
          img.urlImagen?.trim() !== "" || img.NombreArchivo?.trim() !== ""
        );
        formData.append("Imagenes", JSON.stringify(imagenesFiltradas));
      } else if (key.startsWith("imagenArchivo_") && valor instanceof Blob) {
        formData.append(key, valor, key + ".webp");
      } else if (["categoria", "unidad"].includes(key.toLowerCase())) {
        formData.append(key, JSON.stringify(valor));
      } else {
        formData.append(key, valor);
      }
    }

    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/crearProducto",
      method: "POST",
      data: formData,
      withCredentials: true,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Crear marca
export const crearMarca = async (datosMarca) => {
  try {
    const formData = new FormData();

    formData.append("Token", "TOKENSUPERSECRETO");

    for (const key in datosMarca) {
      const valor = datosMarca[key];

      if (key === "imagenes") {
        formData.append("Imagenes", JSON.stringify(valor));
      } else if (key.startsWith("imagenArchivo_") && valor instanceof Blob) {
        formData.append(key, valor, key + ".webp");
      } else {
        formData.append(key, valor);
      }
    }

    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/guardarCrearMarca",
      method: "POST",
      data: formData,
      withCredentials: true,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error al crear la marca:", error);
    throw error;
  }
};

// Crear categoría
export const crearCategoria = async (datosCategoria) => {
  try {
    const formData = new FormData();

    formData.append("Token", "TOKENSUPERSECRETO");

    for (const key in datosCategoria) {
      const valor = datosCategoria[key];

      if (key === "Imagenes") {
        formData.append("Imagenes", JSON.stringify(valor));
      } else if (key.startsWith("imagenArchivo_") && valor instanceof Blob) {
        formData.append(key, valor, key + ".webp");
      } else {
        formData.append(key, valor);
      }
    }

    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/guardarCrearCategoria",
      method: "POST",
      data: formData,
      withCredentials: true,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    throw error;
  }
};

// Crear unidad de medida
export const crearUnidadMedida = async (datosUnidad) => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/guardarCrearUnidadMedida",
      method: "POST",
      data: {
        ...datosUnidad,
        Token: "TOKENSUPERSECRETO",
      },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error al crear la unidad de medida:", error);
    throw error;
  }
};

// Crear producto
export const registrarProducto = async (producto) => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/guardarCrearProducto", // Reemplaza con el endpoint correcto si es distinto
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        Token: "TOKENSUPERSECRETO",
        Codigo: producto.codigo,
        Nombre: producto.nombre,
        Descripcion: producto.descripcion,
        Precio: parseFloat(producto.precio),
        Descuento: parseFloat(producto.descuento),
        Stock: parseFloat(producto.stock),
        NombreSlug: "",
        UrlImagen1: producto.urlImagen1,
        UrlImagen2: producto.urlImagen2,
        Marca: producto.marca,
        Categoria: producto.categoria,
        MensajeConsulta: "",
        ValorConsulta: "",
      },
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

{/* Apis de edicion/modificación */ }

// Editar mensajes Wsp
export const editarMensajeWsp = async (mensajeProducto, mensajeGlobal, Numero) => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/CambiarMensajewsp",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        Token: "TOKENSUPERSECRETO",
        MensajeProducto: mensajeProducto,
        MensajeGlobal: mensajeGlobal,
        Numero: Numero,
      },
      withCredentials: true
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Editar producto
export const editarProducto = async (idProducto, cambios) => {
  try {
    const formData = new FormData();

    formData.append("Token", "TOKENSUPERSECRETO");
    formData.append("Id_producto", idProducto);

    // 🔁 Agrega dinámicamente los campos modificados
    for (const key in cambios) {
      const valor = cambios[key];

      if (key === "archivoFicha" && valor instanceof File) {
        formData.append("ArchivoFicha", valor);
      } else if (key === "imagenes") {
        formData.append("Imagenes", JSON.stringify(valor));
      }
      else if (key.startsWith("imagenArchivo_") && valor instanceof Blob) {
        formData.append(key, valor, key + ".webp");
      }
      else if (["categoria", "unidad", "imageneseliminadas"].includes(key.toLowerCase())) {
        formData.append(capitalizarPrimeraLetra(key), JSON.stringify(valor));
      } else {
        formData.append(capitalizarPrimeraLetra(key), valor);
      }
    }

    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/editarProducto",
      method: "POST",
      data: formData,
      withCredentials: true,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Editar Categoria
export const editarCategoria = async (formData) => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/EditarCategoria",
      method: "POST",
      data: formData,
      withCredentials: true
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Editar Categoria
export const editarMarca = async (formData) => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/EditarMarca",
      method: "POST",
      data: formData,
      withCredentials: true
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Editar Unidad
export const editarUnidadMedida = async (data) => {
  const config = {
    url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/EditarUnidadMedida",
    method: "POST",
    data,
    withCredentials: true,
  };
  const response = await axios(config);
  return response.data;
};

const capitalizarPrimeraLetra = (texto) => {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

{/* Apis de eliminación */ }

export const EliminarProducto = async (idProducto) => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/eliminarProducto",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        Token: "TOKENSUPERSECRETO",
        Id_producto: idProducto,
      },
      withCredentials: true,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const EliminarCategoria = async (id_categoria, imagen_categoria) => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/EliminarCategoria",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        Token: "TOKENSUPERSECRETO",
        Id_categoria: id_categoria.toString(),
        Imagen_categoria: imagen_categoria
      },
      withCredentials: true,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EliminarMarca = async (id_marca, imagen_marca) => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/EliminarMarca",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        Token: "TOKENSUPERSECRETO",
        Id_marcas: id_marca.toString(),
        Imagen_marca: imagen_marca
      },
      withCredentials: true,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EliminarUnidad = async (id_unidad) => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTproductos/EliminarUnidadMedida",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        Token: "TOKENSUPERSECRETO",
        Id_unidad: id_unidad
      },
      withCredentials: true,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

{/* Apis relacionados al usuario */ }

// Login
export const Login = async (usuario, clave) => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTusuario/BuscarUsuario",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        Token: "TOKENSUPERSECRETO",
        UsuarioNombre: usuario,
        Clave: clave,
      },
      withCredentials: true
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
}

//logout
export const logout = async () => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTusuario/logout",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {},
      withCredentials: true
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
};

//Verificar sesión
export const verificarSesion = async () => {
  try {
    const config = {
      url: process.env.NEXT_PUBLIC_SIGNALR_URL + "/CTusuario/perfil",
      method: "GET",
      withCredentials: true
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return null;
    }

    console.error("Error al verificar sesión:", error);
    throw error;
  }
};



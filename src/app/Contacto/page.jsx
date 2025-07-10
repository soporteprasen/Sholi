"use client";
import React from "react";
import Head from "next/head";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  MessageSquare,
} from "lucide-react";
import Contenido from "@/components/Contenido";
import PreguntasFrecuentes from "@/components/PreguntasFrecuentes";

export default function Contacto() {
  return (
    <>
      <Head>
        <title>Contáctanos | Prasen</title>
        <meta
          name="description"
          content="Ponte en contacto con Prasen. Encuentra nuestra dirección en Lima, Perú, número de teléfono, correo electrónico y horario de atención. ¡Estamos listos para ayudarte!"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://tusitio.com/contacto" />
      </Head>

      <>
        <div className="max-w-screen-xl mx-auto px-4 py-5">
          <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">Contáctanos</h1>

          {/* Texto introductorio SEO-friendly */}
          <p className="text-sm text-gray-600 text-center max-w-2xl mx-auto mb-6">
            En <strong>Prasen</strong> ofrecemos soluciones tecnológicas de alta calidad. 
            Si deseas realizar consultas, solicitar cotizaciones o conocer más sobre nuestros productos, 
            puedes contactarnos directamente. Estamos ubicados en Lima, Perú, y atendemos a nivel nacional.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Información de contacto */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Información de contacto</h2>

              <div className="space-y-4 text-gray-700 text-sm">
                <p className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-500" />
                  <span><strong>Dirección:</strong> Av. Los Próceres 123, Lima, Perú</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-indigo-500" />
                  <span><strong>Teléfono:</strong> +51 987 654 321</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-500" />
                  <span><strong>Correo:</strong> contacto@miempresa.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  <span><strong>Horario:</strong> Lunes a Viernes de 9:00 a.m. a 6:00 p.m.</span>
                </p>

                <div className="pt-2">
                  <p className="font-semibold text-gray-800">Síguenos en redes sociales:</p>
                  <div className="flex gap-4 pt-2">
                    <a href="#" className="flex items-center gap-1 text-indigo-600 hover:underline">
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </a>
                    <a href="#" className="flex items-center gap-1 text-indigo-600 hover:underline">
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                    <a href="#" className="flex items-center gap-1 text-indigo-600 hover:underline">
                      <MessageSquare className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa de Google */}
            <div className="rounded-xl overflow-hidden shadow-md border">
              <iframe
                title="Ubicación en Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d244.0391003811622!2d-77.04959144447903!3d-11.861459069859247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2spe!4v1751927449526!5m2!1ses-419!2spe"
                width="100%"
                height="400"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <PreguntasFrecuentes />
        </div>
      </>
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import signUpUser from "../../../lib/auth/signUpUser";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/SupabaseClient";

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push("/");
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage("Por favor, completa todos los campos");
      return;
    }

    const result = await signUpUser(name, email, password);
    if (result?.error) {
      setMessage(result.error);
    } else {
      setMessage("Usuario creado exitosamente");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  };

  if (loading) return null;
  return (
    <div className="h-screen flex justify-center items-center w-full bg-hover">
      <div className="bg-background flex flex-col items-center px-6 lg:px-12 rounded-md max-w-[400px] w-[90%]">
        <Image
          src="/images/logo.png"
          alt="logo"
          width={500}
          height={500}
          className="h-11 w-11 mt-6"
        />
        <h2 className="text-2xl font-bold text-white my-2 mb-8 text-center">
          Regístrate en Spotify
        </h2>
        <form onSubmit={handleSignup}>
          {message && (
            <p className="bg-primary font-semibold text-center mb-4 py-1">
              {message}
            </p>
          )}
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Nombre"
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="text"
            placeholder="Correo electrónico"
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Contraseña"
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />
          <button className="bg-primary py-3 rounded-full w-full font-bold cursor-pointer mb-6">
            Continuar
          </button>
          <div className="text-secondary-text text-center my-6">
            <span>¿Ya tienes una cuenta?</span>
            <Link
              href="/login"
              className="ml-2 text-white underline hover:text-primary"
            >
              Inicia Sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

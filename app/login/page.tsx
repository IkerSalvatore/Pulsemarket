import { Suspense } from "react";
import { signIn } from "@/auth";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const MENSAJES: Record<string, string> = {
  AccessDenied: "No se concedió el acceso. Intenta de nuevo.",
  OAuthCallbackError: "No se pudo completar el inicio de sesión. Intenta de nuevo.",
  Configuration: "Hay un problema de configuración del servidor de login.",
};

async function MensajeError({ searchParams }: { searchParams: SearchParams }) {
  const { error } = await searchParams;
  if (!error) return null;

  const codigo = Array.isArray(error) ? error[0] : error;
  const mensaje = MENSAJES[codigo] ?? "No se pudo iniciar sesión. Intenta de nuevo.";

  return (
    <p
      role="alert"
      className="mb-4 rounded-md border border-red-500 bg-red-50 p-3 text-sm text-red-700"
    >
      {mensaje}
    </p>
  );
}

export default function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-semibold">Iniciar sesión en PulseMarket</h1>

        <Suspense fallback={null}>
          <MensajeError searchParams={searchParams} />
        </Suspense>

        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-md border px-4 py-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Continuar con GitHub
          </button>
        </form>
      </div>
    </main>
  );
}

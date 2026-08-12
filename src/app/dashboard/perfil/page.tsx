import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/dashboard/profile-form";

export const revalidate = 0;

export default async function PerfilPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });

  return (
    <div className="max-w-lg rounded-3xl border border-border-soft p-6">
      <h2 className="mb-1 font-display text-lg font-bold">Mi perfil</h2>
      <p className="mb-6 text-sm text-foreground/55">
        Mantén tus datos actualizados para una mejor coordinación de tus pedidos.
      </p>
      <ProfileForm
        name={user?.name ?? ""}
        email={user?.email ?? ""}
        phone={user?.phone ?? ""}
      />
    </div>
  );
}

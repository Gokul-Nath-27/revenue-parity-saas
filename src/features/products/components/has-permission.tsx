import { catchError } from "@/lib/utils";
import { canCreateProduct } from "@/permissions";



export async function HasPermission({ children, fallback }: { children: React.ReactNode, fallback: React.ReactNode }) {
  const { error, data } = await catchError(canCreateProduct());
  if (error || !data) return fallback;
  return children;
}

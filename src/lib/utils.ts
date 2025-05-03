import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function catchError<T>(
  promise: Promise<T>
): Promise<{ error: Error | undefined; data: T | undefined }> {
  try {
    const data = await promise;
    return { error: undefined, data };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { error, data: undefined };
  }
}

export const generateIntials = (name: string) => {
  const nameParts = name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  const firstNameInitial = firstName.charAt(0).toUpperCase();
  const lastNameInitial = lastName ? lastName.charAt(0).toUpperCase() : '';

  return `${firstNameInitial}${lastNameInitial}`;
};

export function removeTrailingSlash(path: string) {
  return path.replace(/\/$/, "")
}

export function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}
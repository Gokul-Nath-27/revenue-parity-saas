import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function catchError<T>(promise: Promise<T>): Promise<[undefined, T] | [Error]> {
  return promise
    .then((data): [undefined, T] => [undefined, data])
    .catch((error): [Error] => [error]);
}
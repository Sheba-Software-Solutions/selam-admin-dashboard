import { useCallback } from "react";

type ToastVariant = "default" | "destructive" | "success" | "info";

interface ToastOptions {
    title: string;
    description?: string;
    variant?: ToastVariant;
}

type ToastFn = (options: ToastOptions) => void;

export function useToast(): ToastFn {
    // Replace this with your actual toast implementation (e.g., context, library, etc.)
    const toast = useCallback((options: ToastOptions) => {
        // Example: log to console, replace with your UI logic
        console.log("Toast:", options);
        // You can integrate with a toast library here
        // e.g., toastLib.show(options)
    }, []);

    return toast;
}
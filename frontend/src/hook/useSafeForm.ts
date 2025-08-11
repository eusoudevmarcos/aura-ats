import {
  FieldValues,
  useForm,
  useFormContext,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";

type Mode = "context" | "independent";

interface Props<T extends FieldValues> {
  mode: Mode;
  debug?: boolean;
  useFormProps?: Partial<UseFormProps<T>>;
}

export function useSafeForm<T extends FieldValues>({
  useFormProps,
  debug = false,
  mode = "context",
}: Props<T>) {
  if (mode === "context") {
    try {
      const ctx = useFormContext<T>();
      if (debug) console.log("[useSafeForm] Usando contexto");
      return ctx;
    } catch {
      if (debug) console.log("[useSafeForm] Sem contexto, criando local");
      return useForm<T>();
    }
  }

  if (debug) console.log("[useSafeForm] Criando independente");
  return useForm<T>(useFormProps as Partial<UseFormProps<T>>);
}

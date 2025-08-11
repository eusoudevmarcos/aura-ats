/* eslint-disable react-hooks/rules-of-hooks */
import {
  FieldValues,
  useForm,
  useFormContext,
  UseFormProps,
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
  let ctx: ReturnType<typeof useForm<T>> | undefined;
  const localForm = useForm<T>(useFormProps as Partial<UseFormProps<T>>);

  try {
    ctx = useFormContext<T>();
  } catch {
    ctx = undefined;
  }

  if (debug) {
    console.info(
      `[useSafeForm] ${
        mode === "context" ? "Modo contexto" : "Modo independente"
      }`
    );
  }

  if (mode === "context" && ctx) {
    return { ...ctx, mode };
  }

  return localForm;
}

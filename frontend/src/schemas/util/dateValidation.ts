import z from "zod";

export const zDateValidate = z
  .string("Data invalida")
  .nullable()
  .refine(
    (val) => {
      if (val === null || val === "") return true;

      const [year, month, day] = val.split("-").map(Number);

      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return false;
      }

      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() === year &&
        date.getMonth() + 1 === month &&
        date.getDate() === day
      );
    },
    {
      message: "Data inválida ou no formato incorreto (DD/MM/YYYY).",
    }
  );

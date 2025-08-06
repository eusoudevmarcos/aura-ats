import { PlusIcon } from "@/components/icons";
import VagasForm from "@/components/Vagas/VagasForm";
import VagasList from "@/components/Vagas/VagasList";
import AtividadeLayout from "@/layout/AtividadesLayout";
import { useState } from "react";

export default function Vagas() {
  return (
    <AtividadeLayout>
      <VagasList />
    </AtividadeLayout>
  );
}

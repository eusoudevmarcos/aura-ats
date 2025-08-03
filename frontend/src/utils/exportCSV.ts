import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function mostrarValor(valor: any): string {
  if (
    valor === null ||
    valor === undefined ||
    (typeof valor === "string" && valor.trim() === "")
  ) {
    return "N/A";
  }
  return valor;
}

// Função utilitária para exportar CSV
export function exportToCSV(data: any) {
  // Monta as linhas do CSV
  let csv = "";
  // Dados pessoais
  csv +=
    "Nome,CPF,RG,Sexo,Data de Nascimento,Nome da Mãe,Falecido,Aposentado,Bolsa Família\n";
  csv +=
    [
      mostrarValor(data.name),
      mostrarValor(data.cpf),
      mostrarValor(data.rg),
      data.gender === "F"
        ? "Feminino"
        : data.gender === "M"
        ? "Masculino"
        : "N/A",
      mostrarValor(data.birthday),
      mostrarValor(data.mother_name),
      data.possibly_dead === null || data.possibly_dead === undefined
        ? "N/A"
        : data.possibly_dead
        ? "Sim"
        : "Não",
      data.retired === null || data.retired === undefined
        ? "N/A"
        : data.retired
        ? "Sim"
        : "Não",
      data.bolsa_familia === null || data.bolsa_familia === undefined
        ? "N/A"
        : data.bolsa_familia
        ? "Sim"
        : "Não",
    ].join(",") + "\n\n";

  // Profissão e Renda
  csv += "CBO,CBO Descrição,Renda Estimada\n";
  csv +=
    [
      mostrarValor(data.cbo_code),
      mostrarValor(data.cbo_description),
      mostrarValor(data.estimated_income),
    ].join(",") + "\n\n";

  // PEP
  csv += "PEP,Tipo de PEP\n";
  csv +=
    [
      data.pep === null || data.pep === undefined
        ? "N/A"
        : data.pep
        ? "Sim"
        : "Não",
      data.pep ? mostrarValor(data.pep_type) : "",
    ].join(",") + "\n\n";

  // Endereços
  csv += "Endereços\n";
  if (data.addresses && data.addresses.length > 0) {
    csv += "Tipo,Rua,Numero,Complemento,Bairro,Cidade,Estado,CEP,Prioridade\n";
    data.addresses.forEach((addr: any) => {
      csv +=
        [
          mostrarValor(addr.type),
          mostrarValor(addr.street),
          mostrarValor(addr.number),
          mostrarValor(addr.complement),
          mostrarValor(addr.neighborhood),
          mostrarValor(addr.city),
          mostrarValor(addr.district),
          mostrarValor(addr.postal_code),
          mostrarValor(addr.priority),
        ].join(",") + "\n";
    });
  } else {
    csv += "Nenhum endereço cadastrado.\n";
  }
  csv += "\n";

  // Telefones Celulares
  csv += "Telefones Celulares\n";
  if (data.mobile_phones && data.mobile_phones.length > 0) {
    csv += "DDD,Número,Prioridade,Data CDR,Data Hot,WhatsApp,CPC\n";
    data.mobile_phones.forEach((phone: any) => {
      csv +=
        [
          mostrarValor(phone.ddd),
          mostrarValor(phone.number),
          mostrarValor(phone.priority),
          mostrarValor(phone.cdr_datetime),
          mostrarValor(phone.hot_datetime),
          mostrarValor(phone.whatsapp_datetime),
          mostrarValor(phone.cpc_datetime),
        ].join(",") + "\n";
    });
  } else {
    csv += "Nenhum celular cadastrado.\n";
  }
  csv += "\n";

  // Telefones Fixos
  csv += "Telefones Fixos\n";
  if (data.land_lines && data.land_lines.length > 0) {
    csv += "DDD,Número,Prioridade,Data CDR,Data Hot,WhatsApp,CPC\n";
    data.land_lines.forEach((phone: any) => {
      csv +=
        [
          mostrarValor(phone.ddd),
          mostrarValor(phone.number),
          mostrarValor(phone.priority),
          mostrarValor(phone.cdr_datetime),
          mostrarValor(phone.hot_datetime),
          mostrarValor(phone.whatsapp_datetime),
          mostrarValor(phone.cpc_datetime),
        ].join(",") + "\n";
    });
  } else {
    csv += "Nenhum telefone fixo cadastrado.\n";
  }
  csv += "\n";

  // E-mails
  csv += "E-mails\n";
  if (data.emails && data.emails.length > 0) {
    csv += "E-mail,Prioridade\n";
    data.emails.forEach((email: any) => {
      csv +=
        [mostrarValor(email.email), mostrarValor(email.priority)].join(",") +
        "\n";
    });
  } else {
    csv += "Nenhum e-mail cadastrado.\n";
  }
  csv += "\n";

  // Familiares
  csv += "Familiares\n";
  if (data.family_datas && data.family_datas.length > 0) {
    csv += "Nome,CPF,Descrição\n";
    data.family_datas.forEach((fam: any) => {
      csv +=
        [
          mostrarValor(fam.name),
          mostrarValor(fam.cpf),
          mostrarValor(fam.description),
        ].join(",") + "\n";
    });
  } else {
    csv += "Nenhum familiar cadastrado.\n";
  }
  csv += "\n";

  // Empresas Relacionadas
  csv += "Empresas Relacionadas\n";
  if (data.related_companies && data.related_companies.length > 0) {
    csv += "CNPJ,Razão Social,Nome Fantasia,Situação Cadastral\n";
    data.related_companies.forEach((company: any) => {
      csv +=
        [
          mostrarValor(company.cnpj),
          mostrarValor(company.company_name),
          mostrarValor(company.trading_name),
          mostrarValor(company.registry_situation),
        ].join(",") + "\n";
    });
  } else {
    csv += "Nenhuma empresa relacionada cadastrada.\n";
  }
  csv += "\n";

  // Baixar arquivo
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "dados_pessoa.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Função utilitária para exportar PDF
export async function exportToPDF(cardRef: React.RefObject<HTMLDivElement>) {
  if (!cardRef.current) return;
  const input = cardRef.current;
  // Usa html2canvas para capturar o conteúdo
  const canvas = await html2canvas(input, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Calcula a proporção para caber na página
  const imgProps = {
    width: canvas.width,
    height: canvas.height,
  };
  const ratio = Math.min(
    pageWidth / imgProps.width,
    pageHeight / imgProps.height
  );
  const pdfWidth = imgProps.width * ratio;
  const pdfHeight = imgProps.height * ratio;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("dados_pessoa.pdf");
}

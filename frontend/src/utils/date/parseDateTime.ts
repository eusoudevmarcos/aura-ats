// parseDateTime: recebe "DD/MM/YYYY" e "HH:mm" e retorna Date ou null
function parseDateTime(dateStr: string, timeStr: string): Date | null {
  const m = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, dayS, monthS, yearS] = m;
  const [hhS, mmS] = timeStr.split(':');
  if (!hhS || !mmS) return null;

  const day = Number(dayS);
  const month = Number(monthS); // 1-12
  const year = Number(yearS);
  const hh = Number(hhS);
  const mm = Number(mmS);

  const d = new Date(year, month - 1, day, hh, mm, 0, 0);
  return Number.isNaN(d.getTime()) ? null : d;
}

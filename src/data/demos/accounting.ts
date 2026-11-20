/**
 * Accounting platform demo: sample portfolio and review findings.
 * Texts of the demo, kept out of the component so they can be edited
 * without touching the markup. Sample data only.
 */
export const accountingCopy = {
  es: {
    import: 'Importar Excel de ejemplo',
    file: 'cartera_noviembre.xlsx',
    filter: 'Solo con pendientes',
    review: 'Correr revisión',
    caption: 'Cartera de clientes',
    cols: ['Cliente', 'Pendiente', 'Vence'],
    empty: 'Importe la hoja para ver la cartera.',
    rows: [
      ['Ferretería El Roble', 'Faltan 2 documentos', '15 nov'],
      ['Taller JR', 'IVA del mes', '15 nov'],
      ['Soda La Esquina', 'Al día', '—'],
      ['Agroservicios Pital', 'Faltan facturas de compra', '18 nov'],
      ['Clínica Veterinaria Norte', 'Al día', '—'],
    ],
    findings_title: 'Hallazgos de la revisión',
    findings: [
      { tone: 'bad', level: 'Crítico', text: 'Taller JR: clave de comprobante repetida en compras.' },
      { tone: 'warn', level: 'Advertencia', text: 'Agroservicios Pital: IVA de compras distinto del monto declarado.' },
    ],
    loaded: 'Se importaron 5 clientes.',
  },
  en: {
    import: 'Import sample Excel',
    file: 'portfolio_november.xlsx',
    filter: 'Only pending',
    review: 'Run review',
    caption: 'Client portfolio',
    cols: ['Client', 'Pending', 'Due'],
    empty: 'Import the sheet to see the portfolio.',
    rows: [
      ['El Roble Hardware', '2 documents missing', 'Nov 15'],
      ['JR Garage', 'Monthly VAT', 'Nov 15'],
      ['La Esquina Diner', 'Up to date', '—'],
      ['Pital Farm Supply', 'Purchase invoices missing', 'Nov 18'],
      ['North Vet Clinic', 'Up to date', '—'],
    ],
    findings_title: 'Review findings',
    findings: [
      { tone: 'bad', level: 'Critical', text: 'JR Garage: repeated receipt key in purchases.' },
      { tone: 'warn', level: 'Warning', text: 'Pital Farm Supply: purchase VAT differs from the declared amount.' },
    ],
    loaded: '5 clients imported.',
  },
} as const;

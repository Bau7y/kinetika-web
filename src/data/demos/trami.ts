/**
 * TramiMuniSC demo: sample declaration checklist and steps.
 * Texts of the demo, kept out of the component so they can be edited
 * without touching the markup. Sample data only.
 */
export const tramiCopy = {
  es: {
    title: 'Declaración de bienes inmuebles',
    docs_label: 'Documentos',
    docs: ['Formulario de declaración lleno', 'Documento de identidad', 'Datos de la propiedad'],
    steps: ['Documentos recibidos', 'En revisión', 'Presentado', 'Resuelto por la municipalidad'],
    advance: 'Avanzar trámite',
    restart: 'Reiniciar demo',
    missing: 'Faltan documentos para avanzar.',
    status: 'Estado',
  },
  en: {
    title: 'Property declaration',
    docs_label: 'Documents',
    docs: ['Declaration form filled in', 'ID document', 'Property details'],
    steps: ['Documents received', 'Under review', 'Filed', 'Decided by the municipality'],
    advance: 'Move forward',
    restart: 'Restart demo',
    missing: 'Some documents are missing.',
    status: 'Status',
  },
} as const;

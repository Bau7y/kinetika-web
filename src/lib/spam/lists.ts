/**
 * Word lists for the form filter. Edit freely: matching is accent-, case-
 * and leetspeak-insensitive (see text.ts). Adapted to what Kinetika sells:
 * websites, SEO and digital tools are on-topic here, not spam.
 */

/** Insults and profanity (Spanish, Costa Rican slang, English). */
export const OFFENSIVE = [
  'hijueputa', 'jueputa', 'hijo de puta', 'malparido', 'malparida', 'puta', 'puto', 'mierda', 'pendejo', 'pendeja',
  'culero', 'cabron', 'imbecil', 'estupido', 'estupida', 'idiota', 'zorra', 'verga', 'chupamela', 'mamon',
  'fuck', 'fucking', 'motherfucker', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'retard',
] as const;

/** Typical unsolicited-offer vocabulary. One hit flags for review, two reject. */
export const SPAM_TERMS = [
  'crypto', 'bitcoin', 'forex', 'casino', 'apuestas', 'betting', 'viagra', 'cialis', 'prestamo inmediato', 'loan offer',
  'backlinks', 'guest post', 'link building', 'rank your website', 'first page of google', 'increase your sales',
  'click here', 'unsubscribe', 'investment opportunity', 'oportunidad de inversion', 'make money', 'ganar dinero',
  'outsourcing team', 'offshore developers', 'white label',
] as const;

/** URL shorteners hide where a link goes: a strong spam signal. */
export const SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'cutt.ly', 'rebrand.ly', 'shorturl.at'] as const;

/** Throwaway inbox providers. */
export const DISPOSABLE_DOMAINS = [
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.info', 'sharklasers.com', '10minutemail.com', 'temp-mail.org',
  'tempmail.com', 'tempmail.net', 'yopmail.com', 'yopmail.net', 'trashmail.com', 'getnada.com', 'dispostable.com',
  'maildrop.cc', 'throwawaymail.com', 'fakeinbox.com', 'mintemail.com', 'mohmal.com', 'emailondeck.com', 'tempail.com',
] as const;

/** Vocabulary of the products. Used only when the visitor wrote free text without picking an option. */
export const TOPIC_TERMS = [
  // Spanish
  'sitio', 'pagina', 'web', 'tienda', 'negocio', 'empresa', 'restaurante', 'soda', 'pedido', 'menu', 'cocina',
  'whatsapp', 'cliente', 'contador', 'contabilidad', 'despacho', 'hacienda', 'iva', 'factura', 'excel', 'tramite',
  'municipalidad', 'bienes inmuebles', 'patente', 'cotizacion', 'precio', 'demo', 'sistema', 'aplicacion',
  // English
  'website', 'site', 'store', 'business', 'company', 'restaurant', 'order', 'kitchen', 'customer', 'client',
  'accountant', 'accounting', 'tax', 'invoice', 'procedure', 'quote', 'price', 'system', 'app',
] as const;

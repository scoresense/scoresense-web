/**
 * Dados da empresa ScoreSense
 * Utilizados em todo o site para branding e contato
 */

export const COMPANY_DATA = {
  name: "ScoreSense",
  tagline: "Soluções em Crédito",
  logo: "/manus-storage/scoresense_logo_full_336de191.png",
  symbol: "/manus-storage/scoresense_simbolo_8fb572fa.png",
  
  // Contato
  phone: "047 20181873",
  email: "comercial@scoresense.com.br",
  
  // Endereço
  address: {
    street: "R. Benjamin Constant, 2455 - Sala 1",
    neighborhood: "Glória",
    city: "Joinville",
    state: "SC",
    zipCode: "89217-301",
    fullAddress: "R. Benjamin Constant, 2455 - Sala 1 - Glória, Joinville - SC, 89217-301",
  },
  
  // Redes Sociais
  social: {
    linkedin: "https://www.linkedin.com/in/scoresense-solu%C3%A7%C3%B5es-395941412/",
    instagram: "https://www.instagram.com/scoresensesolucoes/",
  },
  
  // Horário de Funcionamento
  businessHours: {
    weekday: "Segunda a Sexta",
    time: "8h às 18h",
  },
};

/**
 * Formata o telefone para link WhatsApp
 */
export function getWhatsAppLink(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/55${cleanPhone}`;
}

/**
 * Formata o telefone para link de chamada
 */
export function getPhoneLink(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  return `tel:+55${cleanPhone}`;
}

/**
 * Formata o e-mail para link mailto
 */
export function getEmailLink(email: string): string {
  return `mailto:${email}`;
}

/**
 * Formata o endereço para link Google Maps
 */
export function getGoogleMapsLink(address: string): string {
  const encodedAddress = encodeURIComponent(address);
  return `https://maps.google.com/?q=${encodedAddress}`;
}

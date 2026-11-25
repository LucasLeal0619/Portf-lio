/**
 * config.js — contatos e documentos editáveis em um único lugar.
 *
 * Campos vazios ('') NÃO são exibidos no site: nenhum botão quebrado,
 * nenhum link apontando para lugar nenhum.
 */
window.PORTFOLIO_CONFIG = {
  linkedin: 'https://www.linkedin.com/in/lucas-leal-5221542a2',

  email: 'lucaseduleal@gmail.com',

  // Caminho relativo do currículo em PDF (em assets/documents/).
  // Se 'en' ficar vazio, a versão em português é usada também no idioma inglês.
  resume: {
    pt: 'assets/documents/Curriculo_Lucas_Leal.pdf',
    en: ''
  }
};

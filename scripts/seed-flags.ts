// Script para pré-carregar perguntas de bandeiras na BD do Supabase
// Executar com: npx tsx scripts/seed-flags.ts

const flagQuestions = [
  // Bandeiras europeias
  { text: "De que país é esta bandeira?", options: ["Portugal", "Espanha", "França", "Itália"], correct_option: 0, image_url: "https://flagcdn.com/w320/pt.png", country_code: "PT" },
  { text: "De que país é esta bandeira?", options: ["Espanha", "Portugal", "México", "França"], correct_option: 0, image_url: "https://flagcdn.com/w320/es.png", country_code: "ES" },
  { text: "De que país é esta bandeira?", options: ["França", "Reino Unido", "Alemanha", "Bélgica"], correct_option: 0, image_url: "https://flagcdn.com/w320/fr.png", country_code: "FR" },
  { text: "De que país é esta bandeira?", options: ["Alemanha", "Bélgica", "Suíça", "Áustria"], correct_option: 0, image_url: "https://flagcdn.com/w320/de.png", country_code: "DE" },
  { text: "De que país é esta bandeira?", options: ["Itália", "Espanha", "França", "Roménia"], correct_option: 0, image_url: "https://flagcdn.com/w320/it.png", country_code: "IT" },
  { text: "De que país é esta bandeira?", options: ["Reino Unido", "Irlanda", "Austrália", "Nova Zelândia"], correct_option: 0, image_url: "https://flagcdn.com/w320/gb.png", country_code: "GB" },
  { text: "De que país é esta bandeira?", options: ["Holanda", "Bélgica", "Luxemburgo", "Dinamarca"], correct_option: 0, image_url: "https://flagcdn.com/w320/nl.png", country_code: "NL" },
  { text: "De que país é esta bandeira?", options: ["Bélgica", "Holanda", "Alemanha", "França"], correct_option: 0, image_url: "https://flagcdn.com/w320/be.png", country_code: "BE" },
  { text: "De que país é esta bandeira?", options: ["Suíça", "Áustria", "Bélgica", "Liechtenstein"], correct_option: 0, image_url: "https://flagcdn.com/w320/ch.png", country_code: "CH" },
  { text: "De que país é esta bandeira?", options: ["Áustria", "Suíça", "Alemanha", "Hungria"], correct_option: 0, image_url: "https://flagcdn.com/w320/at.png", country_code: "AT" },
  
  // Bandeiras americanas
  { text: "De que país é esta bandeira?", options: ["Brasil", "Portugal", "Argentina", "Espanha"], correct_option: 0, image_url: "https://flagcdn.com/w320/br.png", country_code: "BR" },
  { text: "De que país é esta bandeira?", options: ["Estados Unidos", "México", "Canadá", "Austrália"], correct_option: 0, image_url: "https://flagcdn.com/w320/us.png", country_code: "US" },
  { text: "De que país é esta bandeira?", options: ["México", "Espanha", "Itália", "França"], correct_option: 0, image_url: "https://flagcdn.com/w320/mx.png", country_code: "MX" },
  { text: "De que país é esta bandeira?", options: ["Canadá", "Estados Unidos", "Reino Unido", "França"], correct_option: 0, image_url: "https://flagcdn.com/w320/ca.png", country_code: "CA" },
  { text: "De que país é esta bandeira?", options: ["Argentina", "Uruguai", "Paraguai", "Brasil"], correct_option: 0, image_url: "https://flagcdn.com/w320/ar.png", country_code: "AR" },
  
  // Outras bandeiras
  { text: "De que país é esta bandeira?", options: ["Japão", "China", "Coreia do Sul", "Vietname"], correct_option: 0, image_url: "https://flagcdn.com/w320/jp.png", country_code: "JP" },
  { text: "De que país é esta bandeira?", options: ["China", "Japão", "Índia", "Indonésia"], correct_option: 0, image_url: "https://flagcdn.com/w320/cn.png", country_code: "CN" },
  { text: "De que país é esta bandeira?", options: ["Coreia do Sul", "Japão", "China", "Singapura"], correct_option: 0, image_url: "https://flagcdn.com/w320/kr.png", country_code: "KR" },
  { text: "De que país é esta bandeira?", options: ["Índia", "Paquistão", "Bangladesh", "Sri Lanka"], correct_option: 0, image_url: "https://flagcdn.com/w320/in.png", country_code: "IN" },
  { text: "De que país é esta bandeira?", options: ["Austrália", "Nova Zelândia", "Reino Unido", "Fiji"], correct_option: 0, image_url: "https://flagcdn.com/w320/au.png", country_code: "AU" },
  { text: "De que país é esta bandeira?", options: ["Rússia", "Ucrânia", "Bielorrússia", "Cazaquistão"], correct_option: 0, image_url: "https://flagcdn.com/w320/ru.png", country_code: "RU" },
];

console.log("📝 Flag questions prepared:", flagQuestions.length);
console.log("Run this in Supabase SQL editor or use the upsert API to insert these questions.");
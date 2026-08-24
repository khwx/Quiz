import type { Question } from "@/types";

const countryMap: Record<string, string> = {
  // Europa
  portugal: "pt",
  espanha: "es",
  franca: "fr",
  italia: "it",
  alemanha: "de",
  "reino unido": "gb",
  "reino unido (uk)": "gb",
  inglaterra: "gb",
  suica: "ch",
  austria: "at",
  belgica: "be",
  holanda: "nl",
  "paises baixos": "nl",
  dinamarca: "dk",
  noruega: "no",
  suecia: "se",
  finlandia: "fi",
  islandia: "is",
  irlanda: "ie",
  polonia: "pl",
  ucrania: "ua",
  russia: "ru",
  grecia: "gr",
  turquia: "tr",
  "turquia (kiye)": "tr",
  hungria: "hu",
  romenia: "ro",
  bulgaria: "bg",
  "republica checa": "cz",
  chequia: "cz",
  eslovaquia: "sk",
  eslovenia: "si",
  croacia: "hr",
  servia: "rs",
  bosnia: "ba",
  "bosnia e herzegovina": "ba",
  albania: "al",
  chipre: "cy",
  malta: "mt",
  estonia: "ee",
  letonia: "lv",
  lituania: "lt",
  bielorrussia: "by",
  moldavia: "md",
  monaco: "mc",
  vaticano: "va",
  "sao marino": "sm",
  andorra: "ad",
  liechtenstein: "li",
  luxemburgo: "lu",
  kosovo: "xk",
  montenegro: "me",
  "macedonia do norte": "mk",

  // Américas
  brasil: "br",
  "estados unidos": "us",
  "estados unidos (eua)": "us",
  canada: "ca",
  mexico: "mx",
  argentina: "ar",
  chile: "cl",
  colombia: "co",
  venezuela: "ve",
  equador: "ec",
  peru: "pe",
  bolivia: "bo",
  paraguai: "py",
  uruguai: "uy",
  cuba: "cu",
  jamaica: "jm",
  haiti: "ht",
  "republica dominicana": "do",
  "costa rica": "cr",
  panama: "pa",
  guatemala: "gt",
  honduras: "hn",
  "el salvador": "sv",
  nicaragua: "ni",
  belize: "bz",
  guiana: "gy",
  suriname: "sr",

  // Ásia e Oceânia
  china: "cn",
  japao: "jp",
  "coreia do sul": "kr",
  "coreia do norte": "kp",
  india: "in",
  paquistao: "pk",
  bangladesh: "bd",
  "sri lanka": "lk",
  srilanka: "lk",
  nepal: "np",
  butao: "bt",
  tailandia: "th",
  vietname: "vn",
  vietnam: "vn",
  laos: "la",
  camboja: "kh",
  malasia: "my",
  singapura: "sg",
  indonesia: "id",
  filipinas: "ph",
  brunei: "bn",
  mianmar: "mm",
  myanmar: "mm",
  afeganistao: "af",
  irao: "ir",
  iraque: "iq",
  siria: "sy",
  libano: "lb",
  jordania: "jo",
  israel: "il",
  palestina: "ps",
  "arabia saudita": "sa",
  iemen: "ye",
  oma: "om",
  "emirados arabes unidos": "ae",
  qatar: "qa",
  catar: "qa",
  barem: "bh",
  kuwait: "kw",
  cazaquistao: "kz",
  uzbequistao: "uz",
  turquemenistao: "tm",
  quirguistao: "kg",
  tajiquistao: "tj",
  australia: "au",
  "nova zelandia": "nz",
  fiji: "fj",

  // África e Outros
  angola: "ao",
  mocambique: "mz",
  "cabo verde": "cv",
  "sao tome e principe": "st",
  guine: "gn",
  "guine-bissau": "gw",
  egito: "eg",
  marrocos: "ma",
  argelia: "dz",
  tunisia: "tn",
  libia: "ly",
  sudao: "sd",
  etiopia: "et",
  quenia: "ke",
  tanzania: "tz",
  "africa do sul": "za",
  nigeria: "ng",
  gana: "gh",
  senegal: "sn",
  madagascar: "mg",
  camaroes: "cm",
  zimbabue: "zw",
};

export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getFlagCode(question: Question): string | null {
  if (!question) return null;

  // 1. Try image_url
  if (question.image_url) {
    const matchSvg = question.image_url.match(/\/flags\/([a-z]{2})\.svg/i);
    if (matchSvg) return matchSvg[1].toLowerCase();

    const matchCdn = question.image_url.match(/flagcdn\.com\/.*?\/([a-z]{2})\.(svg|png)/i);
    if (matchCdn) return matchCdn[1].toLowerCase();
  }

  // 2. If it's a flag category or question
  const category = normalizeString(question.category || "");
  const isFlagRelated = category.includes("bandeira") || category.includes("flag");

  if (isFlagRelated || question.image_url || category) {
    // Check correct option
    if (question.correct_option != null && question.options?.[question.correct_option]) {
      const opt = normalizeString(question.options[question.correct_option]);
      if (countryMap[opt]) {
        return countryMap[opt];
      }
    }

    // Check all options
    if (question.options) {
      for (const option of question.options) {
        const normOpt = normalizeString(option);
        if (countryMap[normOpt]) {
          return countryMap[normOpt];
        }
      }
    }

    // Check question text / hint / explanation
    const textToCheck = normalizeString(
      `${question.text} ${question.metadata?.hint || ""} ${question.metadata?.explanation || ""}`
    );

    for (const [country, code] of Object.entries(countryMap)) {
      if (textToCheck.includes(country)) {
        return code;
      }
    }
  }

  return null;
}

export function getFlagUrl(question: Question): string | null {
  const code = getFlagCode(question);
  if (code) {
    return `/flags/${code}.svg`;
  }
  return question.image_url || null;
}

# 🎮 Family Quiz Game

Bem-vindo ao **Family Quiz**, uma experiência de jogo interativa estilo "Kahoot" para animar as tuas festas e reuniões familiares!

![Quiz Banner](https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=2070&auto=format&fit=crop)

## ✨ Funcionalidades

- **📺 Modo TV (Host)**: O ecrã principal que mostra as perguntas, cronómetro e classificações.
- **📱 Modo Jogador**: Entra com o teu telemóvel usando um PIN, escolhe o teu nome e avatar.
- **🤖 Perguntas AI**: Gera perguntas infinitas sobre qualquer tema usando Inteligência Artificial.
- **⚡ Realtime**: Sincronização instantânea entre todos os dispositivos.
- **🏆 Pódio**: Celebra os vencedores com animações e música!

## 🛠️ Tecnologias Usadas

Este projeto foi construído com as tecnologias mais modernas:

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), React 19, TypeScript
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) & Framer Motion (para animações suaves)
- **Backend & Realtime**: [Supabase](https://supabase.com/)
- **AI**: Google Gemini (via Vercel AI SDK)
- **Icons**: Lucide React

## 🚀 Como Começar

### 1. Clonar o Repositório
```bash
git clone https://github.com/khwx/Quiz.git
cd Quiz
```

### 2. Configurar Variáveis de Ambiente
Cria um ficheiro `.env.local` na raiz do projeto e adiciona as tuas chaves:

```env
NEXT_PUBLIC_SUPABASE_URL=a_tua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=a_tua_key_supabase
NEXT_PUBLIC_GEMINI_API_KEY=a_tua_api_key_google
```

### 3. Configurar a Base de Dados
Executa o script SQL disponível em `migration_fix.sql` no teu painel do Supabase para criar as tabelas necessárias.

### 4. Instalar e Correr
```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) e diverte-te!

## 📝 Licença

Este projeto é de código aberto. Sente-te à vontade para contribuir!

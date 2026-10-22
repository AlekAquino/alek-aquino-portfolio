'use strict';
const ALEK_CATALOG_DATA = Object.freeze({
  "company": {
    "name": "Alek Aquino Soluções Digitais",
    "official_url": "https://alekaquinosolucoesdigitais.com/",
    "whatsapp_phone": "5548991155774",
    "contact_label": "Encaminhar pelo WhatsApp",
    "collection": {
      "id": "odontologia",
      "name": "Odontologia",
      "niche": "Odontologia",
      "type": "Site institucional"
    },
    "brand": {
      "logo": "assets/brand/logo-alek-transparent-480.webp",
      "favicon": "assets/brand/alek-aquino.ico"
    },
    "palette": {
      "background": "#050505",
      "background_warm": "#0a0907",
      "surface": "#0e0c08",
      "text": "#f4eee1",
      "muted": "#aaa294",
      "gold": "#d89b29",
      "gold_bright": "#ffc95c"
    },
    "examples_base_url": "https://alekaquinosolucoesdigitais.com/exemplos/odontologia/",
    "gallery_published": true
  },
  "models": [
    {
      "id": "01",
      "name": "Essência",
      "path": "modelos/01-essencia",
      "collection": "Odontologia",
      "concept": "Pessoas no centro. Cuidados apresentados por fotografias e relação com a equipe.",
      "motion": "Entrada coordenada e escala discreta da fotografia ao rolar.",
      "version": "0.2.0"
    },
    {
      "id": "02",
      "name": "Clareira",
      "path": "modelos/02-clareira",
      "collection": "Odontologia",
      "concept": "Fotografia em profundidade, caminhos por necessidade e menu contextual de cuidados.",
      "motion": "Entrada coordenada, fotografia em profundidade durante a rolagem e painéis ancorados com Floating UI; alternativa estática e movimento reduzido.",
      "version": "0.2.0"
    },
    {
      "id": "03",
      "name": "Origem",
      "path": "modelos/03-origem",
      "collection": "Odontologia",
      "concept": "História e presença. Capítulos fotográficos e leitura editorial.",
      "motion": "Revelação de recortes fotográficos e galeria manual.",
      "version": "0.2.0"
    },
    {
      "id": "04",
      "name": "Vértice",
      "path": "modelos/04-vertice",
      "collection": "Odontologia",
      "concept": "Tudo ao seu alcance. Índice lateral e diretório com descrição e contexto.",
      "motion": "Índice com links reais e respostas de foco e hover.",
      "version": "0.2.0"
    },
    {
      "id": "05",
      "name": "Nobile",
      "path": "modelos/05-nobile",
      "collection": "Odontologia",
      "concept": "Ambiente em fotografia ampla, navegação centrada e ensaios de cuidados em vinho profundo.",
      "motion": "Título650ms, menu180ms e galeria PhotoSwipe ampliável com fade240ms/fechamento200ms; zero duração em movimento reduzido.",
      "version": "0.2.0"
    },
    {
      "id": "06",
      "name": "Prisma",
      "path": "modelos/06-prisma",
      "collection": "Odontologia",
      "concept": "Molar em vidro verde, fundo em profundidade, exploração de cuidados e navegação compacta em material óptico.",
      "motion": "Liquid Glass no cabeçalho, submenu e controles da galeria; entrada coordenada, alternativa CSS, menos transparência e movimento reduzido.",
      "version": "0.2.0"
    },
    {
      "id": "07",
      "name": "Fluxo",
      "path": "modelos/07-fluxo",
      "collection": "Odontologia",
      "concept": "Um percurso de três encontros, fotografia contextual e navegação contínua; áreas apresentadas em faixas de leitura.",
      "motion": "Scrollama acompanha três capítulos no desktop; fotos em fluxo no celular, em telas baixas, sem JS ou com movimento reduzido. Sem prender a rolagem.",
      "version": "0.2.0"
    },
    {
      "id": "08",
      "name": "Elo",
      "path": "modelos/08-elo",
      "collection": "Odontologia",
      "concept": "Acolhimento familiar em ameixa e pétala, dois grupos de navegação e entradas por necessidade.",
      "motion": "Título coordenado, grupos nativos de navegação e galeria Splide manual apenas na clínica; sem autoplay/loop e deslocamento zero com movimento reduzido.",
      "version": "0.2.0"
    },
    {
      "id": "09",
      "name": "Conecta",
      "path": "modelos/09-conecta",
      "collection": "Odontologia",
      "concept": "Busca local de nove destinos, navegação por tarefa e fotografia contextual em cobalto e lavanda.",
      "motion": "Diálogo de busca e resultados respondem às ações; menu/FAQ e estados de foco, sem autoplay ou rolagem capturada.",
      "version": "0.2.0"
    },
    {
      "id": "10",
      "name": "Lume",
      "path": "modelos/10-lume",
      "collection": "Odontologia",
      "concept": "Fotografia em luz natural, leitura em linho, menu nativo e explorador de cuidados.",
      "motion": "Menu/abas e lista de perguntas respondem às ações. AutoAnimate local com ciclo de vida corrigido apenas na primeira visita, suspenso fora da tela/redução/aba oculta.",
      "version": "0.2.0"
    },
    {
      "id": "11",
      "name": "Quintal",
      "path": "modelos/11-quintal",
      "collection": "Odontologia",
      "concept": "Um quintal de papel ilustrado, navegação em capítulos e cuidados apresentados à família.",
      "motion": "Pequeno personagem dental original em Lottie, uma entrada finita e repetição por escolha; menu/abas/FAQ e alternativa estática com movimento reduzido.",
      "version": "0.2.0"
    },
    {
      "id": "12",
      "name": "Ritmo",
      "path": "modelos/12-ritmo",
      "collection": "Odontologia",
      "concept": "Cartaz em azul e amarelo, navegação direta em faixa e caminhos de cuidado em painéis expansíveis.",
      "motion": "Tipografia em entrada curta, painéis de cuidados nativos e formulário local com JustValidate; nenhuma animação contínua ou envio.",
      "version": "0.2.0"
    },
    {
      "id": "13",
      "name": "Contorno",
      "path": "modelos/13-contorno",
      "collection": "Odontologia",
      "concept": "Geometria em verde mineral, fotografia em campo aberto e navegação inferior flutuante; explorador de cuidados com resposta coordenada.",
      "motion": "Anime.js WAAPI anima a mudança de área, sem loop. Indicador e painel respondem à seleção; fallback estático, teclado e movimento reduzido.",
      "version": "0.2.0"
    },
    {
      "id": "14",
      "name": "Acervo",
      "path": "modelos/14-acervo",
      "collection": "Odontologia",
      "concept": "Um caderno de cuidado em ardósia e papel, navegação editorial e busca no texto real das nove páginas.",
      "motion": "Entrada suave de leitura, botões e busca local Pagefind por assunto; sem autoplay e sem deslocamentos em movimento reduzido.",
      "version": "0.2.0"
    },
    {
      "id": "15",
      "name": "Abraço",
      "path": "modelos/15-abraco",
      "collection": "Odontologia",
      "concept": "Álbum familiar em lavanda e linho, fotografia à esquerda e histórias de cuidado em pares; navegação de assuntos sempre disponível.",
      "motion": "Galeria Embla manual na clínica, sem autoplay/loop; navegação horizontal por assunto no celular e alternativas estáticas.",
      "version": "0.2.0"
    },
    {
      "id": "16",
      "name": "Atlas",
      "path": "modelos/16-atlas",
      "collection": "Odontologia",
      "concept": "Atlas em petróleo e areia: índice de navegação que expande a página, diretório de nove assuntos com filtros/ordenação e guias de leitura.",
      "motion": "Abertura curta, resposta dos controles e filtro List.js local sobre tópicos existentes, sem autoplay ou conteúdo gerado por consulta.",
      "version": "0.2.0"
    },
    {
      "id": "17",
      "name": "Bairro",
      "path": "modelos/17-bairro",
      "collection": "Odontologia",
      "concept": "Uma casa de bairro em terracota e verde, navegação por cuidados/visita e exploração de ambientes em esquema conceitual original.",
      "motion": "Fotografia com moldura durante a rolagem quando suportada, controles e esquema Leaflet manual na clínica; sem autoplay, localização ou mapa remoto.",
      "version": "0.2.0"
    },
    {
      "id": "18",
      "name": "Forma",
      "path": "modelos/18-forma",
      "collection": "Odontologia",
      "concept": "Capa editorial em preto e branco, ensaio fotográfico em três quadros, índice em diálogo e cuidados em páginas de leitura.",
      "motion": "GLightbox local amplia somente imagens verificadas da Forma, com teclado, limites e foco; entradas curtas e alternativa sem movimento.",
      "version": "0.2.0"
    },
    {
      "id": "19",
      "name": "Acesso",
      "path": "modelos/19-acesso",
      "collection": "Odontologia",
      "concept": "Informação à mão: abertura orientada a tarefas, navegação prioritária em duas faixas e consulta de destinos com sugestões locais.",
      "motion": "Botões com resposta curta, sugestões por teclado e imagens em entrada discreta; sem autoplay e alternativa estática.",
      "version": "0.2.0"
    },
    {
      "id": "20",
      "name": "Horizonte",
      "path": "modelos/20-horizonte",
      "collection": "Odontologia",
      "concept": "Horizonte costeiro, navegação compacta em três grupos, capa fotográfica ampla e três áreas de cuidado em faixas.",
      "motion": "Panzoom manual explora uma fotografia plana na clínica; botões e moldura respondem ao uso, sem autoplay, zoom por roda ou cena 360 fictícia.",
      "version": "0.2.0"
    },
    {
      "id": "21",
      "name": "Jardim",
      "path": "modelos/21-jardim",
      "collection": "Odontologia",
      "concept": "Arquitetura de jardim: navegação em pequeno índice de duas colunas, fotografia de ambiente que se torna um quadro e cuidados em mosaico de proporções consistentes.",
      "motion": "CSS View Timeline nativa transforma o campo fotográfico em quadro durante a rolagem; alternativa estática com redução ou falta de suporte, sem biblioteca adicional.",
      "version": "0.2.0"
    }
  ]
});

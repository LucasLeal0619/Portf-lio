# Lucas Leal — Portfólio

Portfólio profissional de **Lucas Eduardo Ferreira Leal**, desenvolvedor de software com foco em Back-end e Full Stack.

🔗 **https://lucasleal0619.github.io/Portf-lio/**

Construído só com **HTML, CSS e JavaScript**, sem frameworks, dependências ou etapa de build. O `index.html` funciona direto no navegador e no GitHub Pages.

---

## Recursos

- Tema escuro (padrão) e claro, com a preferência salva em `localStorage`
- Menu mobile acessível, rolagem suave e indicação da seção ativa
- Animações de entrada com `IntersectionObserver`; o conteúdo continua visível se o JS falhar
- Filtro de projetos por categoria e modal de estudo de caso (`<dialog>` nativo, com foco gerenciado)
- Barra de progresso de leitura e botão de voltar ao topo
- Botões de LinkedIn, e-mail (com cópia) e currículo, que só aparecem depois de configurados
- Respeita `prefers-reduced-motion`, funciona por teclado e tem estados de foco visíveis
- SEO: meta tags, Open Graph, dados estruturados `Person` (JSON-LD), `sitemap.xml` e `robots.txt`
- Fontes auto-hospedadas (Geist / Geist Mono), sem requisições a terceiros

## Estrutura

```text
Portf-lio/
├── index.html            # Conteúdo (fonte em português)
├── 404.html              # Página de erro do GitHub Pages
├── css/
│   ├── style.css         # Tokens de design, componentes e seções
│   ├── animations.css    # Animações e prefers-reduced-motion
│   └── responsive.css    # Ajustes por faixa de tela
├── js/
│   ├── config.js         # ← Seus dados editáveis (LinkedIn, e-mail, currículo, formação)
│   ├── main.js           # Tema, menu, filtros, modal, rolagem
│   └── animations.js     # Revelação na rolagem e efeito spotlight
├── assets/
│   ├── images/           # Foto, imagem Open Graph e futuras imagens de projetos
│   ├── icons/            # Favicons
│   ├── fonts/            # Geist e Geist Mono (SIL Open Font License)
│   └── documents/        # Currículo em PDF
├── robots.txt
├── sitemap.xml
├── .gitattributes        # Força LF (necessário para o hash da CSP)
└── .nojekyll
```

## Executar localmente

Não há nada para instalar. Escolha uma opção:

1. **Abrir direto:** dê dois cliques em `index.html`.
2. **Servidor local** (recomendado, porque se comporta igual ao GitHub Pages):

   ```bash
   # Python 3
   python -m http.server 8000
   # acesse http://localhost:8000
   ```

   A extensão **Live Server** do VS Code também funciona.

## Personalizar

### Contatos e currículo: `js/config.js`

LinkedIn, e-mail e currículo ficam em um único arquivo. Um campo vazio (`''`) **não aparece no site**, então não há botão quebrado nem link sem destino.

```js
window.PORTFOLIO_CONFIG = {
  linkedin: 'https://www.linkedin.com/in/lucas-leal-5221542a2',
  email: 'lucaseduleal@gmail.com',
  resume: 'assets/documents/Curriculo_Lucas_Leal.pdf'
};
```

- **Currículo:** o PDF fica em `assets/documents/Curriculo_Lucas_Leal.pdf`.
- **Privacidade:** a versão publicada do currículo não traz telefone. Ao substituir o PDF, mantenha fora dele os dados que não devem ficar públicos.
- **LinkedIn e Credly** também aparecem no array `sameAs` do JSON-LD no `<head>` do `index.html`. Se algum mudar, atualize nos dois lugares.

### Textos

O site é só em português. Os textos ficam direto no `index.html`; os poucos avisos gerados pelo JavaScript (menu, filtros, cópia do e-mail) ficam no objeto `TEXT`, no início de `js/main.js`.

### Projetos

Cada projeto é um `<article class="project">` dentro de `#projetos`:

- `data-tags="backend work"`: grupos usados pelos filtros (`backend`, `fullstack`, `work` = profissional e institucional, `personal`, `learning` = formação e hackathon). A contagem de cada filtro é calculada automaticamente;
- `.project__meta`: selos de **origem** (`badge--personal`, `badge--professional`, `badge--institutional`, `badge--academic`, `badge--hackathon`), de **modo de trabalho** (`badge--mode`: Individual / Colaborativo) e o período;
- `.kpis`: indicadores. Use apenas números confirmados e sempre ligados ao seu contexto;
- o bloco `<div class="case" id="case-ID" hidden>` guarda o conteúdo do modal: tipo, trabalho, período, problema, solução, **minha contribuição**, desafios, resultados e tecnologias. Inclua só as seções que tiverem informação real;
- o botão `data-case="ID"` abre o modal. Ele pode estar em qualquer parte da página, como o atalho para o Brazil Fund Access na Experiência.

Os projetos são apresentados como estudos de caso, sem links individuais de repositório ou demonstração. Essa é uma decisão do autor. O link geral do GitHub fica no card "Perfil no GitHub" e no contato.

As ilustrações dos cards são **SVGs esquemáticos**, não capturas de tela. Se no futuro houver imagens reais e autorizadas, use `assets/images/projetos/`.

### Formação e credenciais

- **Formação:** há um comentário no `index.html` com o modelo para acrescentar novas formações à timeline.
- **Credenciais:** cada item é um `<li class="card cred-card">` em `#credenciais`. O selo indica o tipo: `badge--study` (selo de curso), `badge--professional` (programa de residência) e `badge--institutional` (formação complementar).
- **Selos da AWS Academy:** no Credly, eles são *Training Badges* (conclusão de curso). Mantenha essa distinção e não os apresente como certificações AWS obtidas por exame.

### Competências

Cada linha de `.spec` traz a tecnologia e, quando confirmado, o contexto onde foi utilizada (`.spec__ctx`).

### Cores e tipografia

Os design tokens ficam no topo de `css/style.css` (`:root`, `[data-theme="dark"]` e `[data-theme="light"]`). A cor de destaque é definida por `--accent` / `--accent-strong`.

## Publicar no GitHub Pages

1. Envie os arquivos para a branch `main` do repositório `Portf-lio`.
2. No GitHub, abra **Settings → Pages**.
3. Em **Build and deployment**, selecione **Source: Deploy from a branch**.
4. Escolha a branch **`main`** e a pasta **`/ (root)`** e clique em **Save**.
5. Depois de alguns minutos, o site estará em `https://lucasleal0619.github.io/Portf-lio/`.

Os caminhos do `index.html` são relativos e funcionam dentro do subdiretório `/Portf-lio/`. O `404.html` usa caminhos absolutos (`/Portf-lio/...`) porque pode ser servido em qualquer rota. O arquivo `.nojekyll` impede o processamento pelo Jekyll.

> **robots.txt e sitemap em sites de projeto.** Os buscadores só leem o `robots.txt` na raiz do domínio (`https://lucasleal0619.github.io/robots.txt`), que pertence ao repositório `LucasLeal0619.github.io`, não a este. O `robots.txt` daqui é inofensivo, mas não tem efeito. Para indexar o sitemap, envie `https://lucasleal0619.github.io/Portf-lio/sitemap.xml` pelo Google Search Console.

> Se o nome do repositório ou o domínio mudar, atualize as URLs absolutas em `index.html` (canonical, Open Graph e JSON-LD), `404.html`, `robots.txt` e `sitemap.xml`.

## Segurança (Content Security Policy)

O `index.html` declara uma CSP restritiva: só aceita scripts, estilos, fontes e imagens do próprio site, e nenhum formulário ou conexão externa. O único script inline, que aplica o tema antes da pintura, é autorizado pelo seu hash SHA-256.

**Se editar esse script inline**, recalcule o hash e atualize a meta tag `Content-Security-Policy`:

```bash
python -c "import re,hashlib,base64;s=open('index.html',encoding='utf-8').read();m=re.search(r'<script>(.*?)</script>',s,re.S);print('sha256-'+base64.b64encode(hashlib.sha256(m.group(1).encode()).digest()).decode())"
```

Se o hash não bater, o navegador bloqueia o script. O site continua utilizável, mas no tema escuro e sem os recursos que dependem dele. O `.gitattributes` mantém as quebras de linha em LF para que o hash seja o mesmo no Windows e no GitHub Pages.

## Decisões técnicas

| Decisão | Motivo |
| --- | --- |
| Todo o conteúdo escrito no HTML | A página é indexável e legível sem JavaScript |
| Animações ocultam elementos só quando o JS confirma o `IntersectionObserver` | Se o script falhar, nada fica invisível |
| `content-visibility: auto` nas seções | Reduziu o tempo de bloqueio no mobile de cerca de 1 s para menos de 200 ms (Lighthouse, CPU 4× mais lenta) |
| `<dialog>` nativo no modal | Foco preso, tecla Esc e backdrop já são nativos e acessíveis |
| Fontes auto-hospedadas | Nenhuma requisição a terceiros; permite uma CSP só com `'self'` |
| Ilustrações SVG esquemáticas | Representam funcionalidades informadas sem fingir ser capturas de tela reais |
| Competências com "onde usei" em vez de porcentagens | Contexto verificável no lugar de uma métrica sem base |

## Licenças

- Código: uso pessoal do autor.
- Fontes [Geist](https://vercel.com/font) e Geist Mono: SIL Open Font License 1.1.

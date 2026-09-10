# Código Binário - Assets para Website

Arquivos prontos para uso em sites, favicon e identidade visual.

## Arquivos principais

### Logo completo (identidade)
| Arquivo | Uso recomendado |
|---------|-----------------|
| `codigo-binario-transparent.png` | Logo principal (fundo transparente) |
| `codigo-binario-padded.png` | Logo com margem (melhor para headers) |
| `codigo-binario-exact.svg` | **SVG com fidelidade 100%** (imagem embutida) |
| `codigo-binario-logo.svg` | SVG vetorial aproximado (símbolo + texto) |
| `codigo-binario-square.png` | Versão quadrada base |

### Ícones / Favicon
| Arquivo | Tamanho | Uso |
|---------|---------|-----|
| `favicon.ico` | 16/32/48 | Favicon clássico (coloque na raiz do site) |
| `favicon.svg` | escalável | Favicon moderno (SVG) |
| `codigo-binario-icon.svg` | escalável | Ícone do símbolo (puro) |
| `codigo-binario-icon-16.png` | 16×16 | Favicon |
| `codigo-binario-icon-32.png` | 32×32 | Favicon / taskbar |
| `codigo-binario-icon-48.png` | 48×48 | Windows |
| `codigo-binario-icon-180.png` | 180×180 | Apple Touch Icon |
| `codigo-binario-icon-192.png` | 192×192 | Android / PWA |
| `codigo-binario-icon-512.png` | 512×512 | PWA / Splash |

## Como usar no HTML

```html
<!-- Favicon clássico -->
<link rel="icon" href="/favicon.ico" sizes="any">

<!-- Favicon SVG moderno -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" href="/codigo-binario-icon-180.png">

<!-- Logo no header -->
<img src="/codigo-binario-transparent.png" alt="Código Binário" height="60">

<!-- Ou usando o SVG de alta fidelidade -->
<img src="/codigo-binario-exact.svg" alt="Código Binário" height="60">
```

## Cores principais

- **Verde neon principal:** `#00FF9C` / `#00E676`
- **Verde mais escuro:** `#00C853`
- **Fundo escuro original:** quase preto (`#000000` ~ `#0A0F0A`)

## Recomendações

1. Use `codigo-binario-exact.svg` ou o PNG transparente quando precisar de **fidelidade visual total** (brilhos e detalhes do original).
2. Use os SVGs vetoriais (`codigo-binario-logo.svg` / `codigo-binario-icon.svg`) quando quiser escalabilidade perfeita e arquivo mais leve.
3. Coloque o `favicon.ico` na raiz do site (`/favicon.ico`).
4. Para PWA, declare também os ícones 192 e 512 no `manifest.json`.

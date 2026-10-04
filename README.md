# Qualidade Padrão para YouTube / Default Quality for YouTube

Extensão para Chrome que define a qualidade de vídeo padrão do YouTube (por exemplo, sempre 1080p ou a máxima disponível) e aplica em todo vídeo.

Chrome extension that sets the default YouTube video quality (e.g. always 1080p or the highest available) and applies it to every video.

## Recursos / Features

- Uma barra para todos os vídeos, ou (desligando "Mesma qualidade para todos") uma para cada tipo: comuns, ao vivo e músicas / One slider for all videos, or (turning off "Same quality for all videos") one per kind: regular, live and music.
- De 144p a 2160p (4K), "Máxima" ou "Automática" (o YouTube decide) / From 144p to 2160p (4K), "Max" or "Auto" (YouTube decides).
- Se o vídeo não tiver a qualidade escolhida, usa a mais alta disponível abaixo dela / If the video doesn't offer it, uses the highest one below.
- Funciona nos Shorts / Works on Shorts.
- Mudanças manuais durante o vídeo são respeitadas até o próximo vídeo / Manual changes are respected until the next video.
- Sem coleta de dados, sem servidor, sem código remoto / No data collection, no server, no remote code.

## Instalar para testar / Load for testing

1. Abra `chrome://extensions` e ative o **Modo do desenvolvedor**.
2. Clique em **Carregar sem compactação** e escolha esta pasta.

## Estrutura / Layout

| Arquivo | Função |
|---|---|
| `manifest.json` | Manifest V3; só a permissão `storage` e acesso a youtube.com |
| `content.js` | Lê as opções salvas e repassa à página |
| `main.js` | Roda na página (world MAIN) e usa a API do player para trocar a qualidade |
| `popup.html` / `popup.js` | Popup de configurações |
| `defaults.js` | Configurações padrão e links de apoio |
| `_locales/` | Textos em pt-BR e en |
| `store/` | Textos da Chrome Web Store e scripts para gerar imagens e o zip |
| `docs/` | Política de privacidade (GitHub Pages) |

## Gerar o zip da loja / Build the store package

```powershell
.\store\gerar-zip.ps1
```

O zip vai para `dist/` (ignorado pelo git). As imagens da loja são geradas por `store\gerar-imagens.ps1` (requer o Google Chrome).

## Privacidade / Privacy

Veja [docs/privacy.html](docs/privacy.html) · [docs/privacy-en.html](docs/privacy-en.html).

Esta extensão não é afiliada, endossada nem patrocinada pelo YouTube ou pelo Google. / This extension is not affiliated with, endorsed by or sponsored by YouTube or Google. YouTube is a trademark of Google LLC.

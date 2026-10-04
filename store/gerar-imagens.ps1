# Gera as imagens da Chrome Web Store (capturas 1280x800 e tile 440x280) em PT-BR e EN,
# usando o popup real com chrome.* simulado. Requer o Google Chrome instalado.
$ext    = Split-Path $PSScriptRoot -Parent
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$b      = Join-Path $env:TEMP 'ytquality-shots'
Remove-Item $b -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $b | Out-Null
Copy-Item "$ext\popup.html", "$ext\popup.js", "$ext\defaults.js" $b
Copy-Item "$ext\icons", "$ext\_locales" $b -Recurse
$utf8bom = New-Object Text.UTF8Encoding $true

# Simula chrome.* (i18n le os messages.json via XHR sincrono; idioma pelo ?l=)
$stub = @'
<script>
const P=new URLSearchParams(location.search), q=P.get('v')||'1', L=P.get('l')||'pt_BR';
const xhr=new XMLHttpRequest(); xhr.open('GET','_locales/'+L+'/messages.json',false); xhr.send();
const M=JSON.parse(xhr.responseText);
window.chrome={
 i18n:{getUILanguage(){return L==='en'?'en-US':'pt-BR'},
  getMessage(k,s){const m=M[k]; if(!m) return ''; let t=m.message;
   if(m.placeholders){for(const [n,p] of Object.entries(m.placeholders)){t=t.replace(new RegExp('\\$'+n+'\\$','gi'),(s||[])[parseInt(p.content.slice(1))-1]||'')}}
   return t}},
 storage:{
  sync:{get(d,cb){cb(Object.assign({},d,q==='1'?{sameQuality:true,qualityNormal:'hd1080'}:q==='2'?{sameQuality:false,qualityNormal:'hd1080',qualityLive:'hd720',qualityMusic:'large'}:{sameQuality:false,qualityNormal:'hd1080',qualityLive:'auto',qualityMusic:'auto'}))},set(){}},
  local:{get(d,cb){cb({})},set(){}}},
 runtime:{}};
</script>
'@
$html = [IO.File]::ReadAllText("$ext\popup.html", [Text.Encoding]::UTF8).Replace('<script src="defaults.js">', $stub + '<script src="defaults.js">')
[IO.File]::WriteAllText("$b\popup_stub.html", $html, $utf8bom)

$T = @{
  pt_BR = @{
    badge = 'Qualidade Padrão para YouTube'
    tile  = @('Qualidade Padrão para YouTube', 'Sempre na qualidade que você escolher')
    shots = @(
      @('Uma qualidade para todos os vídeos', 'Mova a barra, de 144p a 4K ou Máxima, e pronto. Chega de abrir em 360p.'),
      @('Ou uma para cada tipo de vídeo', 'Vídeos comuns, lives e músicas, cada um com a sua barra.'),
      @('Automática quando você preferir', 'Deixe o YouTube decidir em lives ou músicas e mantenha a sua escolha nos demais.'))
  }
  en = @{
    badge = 'Default Quality for YouTube'
    tile  = @('Default Quality for YouTube', 'Always at the quality you choose')
    shots = @(
      @('One quality for all videos', 'Move the slider, from 144p to 4K or Max, and you are done. No more starting at 360p.'),
      @('Or one for each kind of video', 'Regular videos, live streams and music, each with its own slider.'),
      @('Auto when you prefer', 'Let YouTube decide on live streams or music and keep your choice on the rest.'))
  }
}
$heights = @(220, 335, 335)

function Page($lang, $i) {
  $s = $T[$lang]; $h = $heights[$i]; $title = $s.shots[$i][0]; $sub = $s.shots[$i][1]; $v = $i + 1
@"
<!doctype html><meta charset="utf-8"><style>
html,body{margin:0;width:1280px;height:800px;overflow:hidden;font-family:Roboto,Segoe UI,Arial,sans-serif;color:#fff}
body{background:linear-gradient(135deg,#d32f2f 0%,#7f1d1d 55%,#212121 100%);display:flex;align-items:center;justify-content:space-between;padding:0 90px;box-sizing:border-box}
.t{max-width:620px} h1{font-size:60px;line-height:1.08;margin:0 0 24px;font-weight:700} p{font-size:28px;margin:0;opacity:.92;line-height:1.35}
.badge{display:inline-block;background:rgba(255,255,255,.18);padding:8px 18px;border-radius:20px;font-size:20px;margin-bottom:26px}
.f{width:372px;height:${h}px;border-radius:14px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.55);flex:none;transform:scale(1.12);transform-origin:center}
iframe{border:0;width:372px;height:${h}px;display:block}
</style><body><div class="t"><div class="badge">$($s.badge)</div><h1>$title</h1><p>$sub</p></div>
<div class="f"><iframe src="popup_stub.html?v=$v&l=$lang"></iframe></div></body>
"@
}
function Tile($lang) {
  $s = $T[$lang]
@"
<!doctype html><meta charset="utf-8"><style>
html,body{margin:0;width:440px;height:280px;overflow:hidden;font-family:Roboto,Segoe UI,Arial,sans-serif;color:#fff}
body{background:linear-gradient(135deg,#d32f2f,#7f1d1d 60%,#212121);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
img{width:110px;height:110px} h1{font-size:30px;margin:14px 20px 4px} p{margin:0;font-size:17px;opacity:.9}
</style><body><img src="icons/icon128.png"><h1>$($s.tile[0])</h1><p>$($s.tile[1])</p></body>
"@
}

function Snap($name, $w, $h, $dest) {
  & $chrome --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files --force-device-scale-factor=1 `
    "--window-size=$w,$h" --virtual-time-budget=3000 "--screenshot=$dest" "file:///$($b.Replace('\','/'))/$name.html" | Out-Null
}

foreach ($lang in 'pt_BR', 'en') {
  $out = Join-Path $ext "store\imagens\$lang"
  New-Item -ItemType Directory -Force $out | Out-Null
  for ($i = 0; $i -lt 3; $i++) {
    [IO.File]::WriteAllText("$b\shot_${lang}_$i.html", (Page $lang $i), $utf8bom)
    Snap "shot_${lang}_$i" 1280 800 "$out\captura-$($i + 1)-1280x800.png"
  }
  [IO.File]::WriteAllText("$b\tile_$lang.html", (Tile $lang), $utf8bom)
  Snap "tile_$lang" 440 280 "$out\tile-pequeno-440x280.png"
}
Get-ChildItem "$ext\store\imagens" -Recurse -File | Select-Object FullName, Length

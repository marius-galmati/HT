# Hight Textiles — Website (Astro + Tailwind + GSAP)

## Rulare locală
1. Instalați Node.js 20+ (nodejs.org)
2. În folderul proiectului: `npm install` apoi `npm run dev` → http://localhost:4321

## Deploy pe Dokploy (recomandat)
Proiectul include `Dockerfile` + `nginx.conf` — build multi-stage (Node 22 → nginx), testat local.

1. Urcați proiectul într-un repo Git (GitHub/GitLab) accesibil serverului Dokploy
2. În Dokploy: **Create Application** → sursă **Git** → selectați repo-ul și branch-ul
3. **Build Type: Dockerfile** (calea implicită `./Dockerfile` e corectă)
4. Container port: **80**
5. La **Domains** adăugați `hightextiles.ro` (+ `www`) cu HTTPS/Let's Encrypt activat
6. **Deploy** — site-ul e static, nu are nevoie de variabile de mediu sau volume

DNS: un record **A** pentru `hightextiles.ro` (și `www`) către IP-ul serverului Dokploy.

## Alternativă gratuită (Cloudflare Pages sau Vercel)
- Creați cont gratuit → "New project" → încărcați acest folder (sau conectați un repo Git)
- Build command: `npm run build` · Output directory: `dist`
- Conectați domeniul (hightextiles.ro) din panoul platformei — instrucțiunile DNS sunt afișate acolo

## Înainte de lansare (importante)
1. FORMULARUL: în `src/components/pages/Contact.astro` înlocuiți `action="#"` cu endpoint-ul real
   (cel mai simplu: cont gratuit formspree.io → copiați URL-ul formularului)
2. DATE DE CONTACT: adăugați telefon + e-mail real în footer (`src/layouts/Base.astro`) și pe pagina Contact
3. FOTOGRAFII: înlocuiți casetele "Fotografie din atelier · în curând" (componenta `PhotoSlot`) cu imagini reale
   după sesiunea foto — orice imagine se adaugă în `public/` și se referențiază simplu
4. DOMENIU: verificați și cumpărați hightextiles.ro (registrar acreditat ROTLD, ex. rotld.ro → lista registrari)
   și opțional hightextiles.eu; .com este deja luat de altcineva
5. Adresa site-ului este setată în `astro.config.mjs` (site: https://hightextiles.ro) — schimbați dacă alegeți alt domeniu

## Capturi de previzualizare
Folderul `preview/` conține capturi generate automat (script: `node shot.js`)

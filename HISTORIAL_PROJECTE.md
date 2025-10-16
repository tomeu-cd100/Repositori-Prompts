# Historial del Projecte - Biblioteca de Prompts

Documentació completa de totes les peticions i implementacions realitzades durant el desenvolupament del projecte.

---

## 1. Creació inicial del projecte

**Petició**: "crea una carpeta anomenada repositori-prompts"

**Acció**: Creació de la carpeta base del projecte.

---

## 2. Canvi de directori

**Petició**: "entra a la carpeta"

**Acció**: Navegació al directori `repositori-prompts`.

---

## 3. Definició del projecte complet

**Petició**:
> "treballaré amb github. hem de crear un aplicatiu web que es pugui executar desde github i en qualsevol navegador en HTML, serparat el css i javascript. Amb un arxiu json, allà on guardarem els prompts, que estarà dintre d'una subcarpeta anomenada data. l'aplicatiu que generarem, serà un gestor i biblioteca de prompts. l'usuari podrà organitzar les targetes per carpetes amb la funció d'arrosegar i deixar anar. Cada targeta té un títol, una descripció i un botó de copiar al portapapers. les carpetes es poden organitzar i editar amb un doble click. S'ha de poder editar les tarjetes amb un doble clic i organitzar-ho amb drag drop. la interfície ha de ser senzilla i minimalista. Amb un click ha de poser-se obrir la finestre i copiar el prompt. La descripció del prompt ha de tenir molta capacitat. Tota la interfície ha de ser en català. Crea una etiqueta de Paperera, allà on vagin tots els prompts esborrats. En cas de voler-ho esborrar definivament, primer han de passaar per la paperera. Si vull recuperar el promp de la paperera, afegix una opció de recuperar i demana en quina categoria s'ha de posar. El botó de restaurar ha de demanar-me quina categoria de les que hi ha el vull posar i treure el prompt de la categoria paperera. A més vull que el que estan a la categoria paperera no apareguin a la categoria tots. Només els vull veure si vaig a la categoria paperera. Quan restauro de la paperera, a part de les categories que hi ha , vull que em permeti afegir una categoria nova. si et falten dades fes-me les preguntes que claguin."

**Respostes a les preguntes de clarificació**:
1. **Estructura de carpetes/categories**: Sí, correcte
2. **Drag & Drop**: Sí a tot
3. **Edició amb doble clic**: Ha de poder fer tot
4. **Categories inicials**: Només "Tots" i "Paperera"
5. **Esborrat definitiu**: Amb botó "Esborrar definitivament" a la Paperera
6. **Persistència**: Botó de "Desar"
7. **Interfície**: Decideix tu (elegant)

**Accions**:
- Creació de l'estructura de carpetes (`data/`)
- Creació de `data/prompts.json` amb dades inicials
- Creació de `index.html` amb tota l'estructura HTML
- Creació de `styles.css` amb disseny minimalista i elegant
- Creació de `script.js` amb tota la funcionalitat

**Funcionalitats implementades**:
- Gestió completa de prompts (crear, editar, esborrar)
- Categories personalitzables
- Drag & drop per moure prompts i reordenar categories
- Sistema de paperera amb restauració
- Modal per restaurar amb opció de crear categoria nova
- Copiar al portapapers amb un clic
- Interfície 100% en català
- Disseny responsive
- Notificacions toast

---

## 4. Inicialització del repositori Git

**Petició**: "puja tu els fitxer al repositori"

**Accions**:
- `git init`
- `git add .`
- Commit inicial amb missatge descriptiu
- Intent de crear repositori amb GitHub CLI (error: gh no instal·lat)

---

## 5. Instal·lació de GitHub CLI

**Petició**: "1" (opció per instal·lar GitHub CLI)

**Acció**: Intent d'instal·lació de `winget install GitHub.cli` (requeria confirmació interactiva).

---

## 6. Confirmació d'instal·lació

**Petició**: "tot ja està instlalat"

**Acció**: Intent de crear repositori amb `gh` (error: comando no trobat al bash).

---

## 7. Proporcionar usuari de GitHub

**Petició**: "tomeu-cd100"

**Accions**:
- Instruccions per crear el repositori manualment a GitHub
- Espera de confirmació

---

## 8. Confirmació de repositori creat

**Petició**: "ja està creat"

**Accions**:
- `git remote add origin`
- `git branch -M main`
- `git push -u origin main`
- Instruccions per activar GitHub Pages

---

## 9. Problema de persistència

**Petició**: "quan refresco la pàgina s'esborren les categories i els prompts afegits, com ho puc arreglar"

**Accions**:
- Implementació de `localStorage` per persistència local
- Modificació de `loadData()` per carregar des de localStorage
- Modificació de `saveToLocalStorage()` per desar automàticament
- Afegir `saveToLocalStorage()` a totes les operacions CRUD
- Canvi del botó "Desar" a "Exportar JSON"
- Actualització del missatge toast
- Commit i push dels canvis

**Funcionalitat afegida**:
- Dades guardades automàticament al navegador
- Persistència entre sessions
- Botó d'exportació per còpies de seguretat

---

## 10. Necessitat de sincronització multi-dispositiu

**Petició**: "però jo vull poder-ho emprar en diferents ordinadors i navegadors, no vull dependre d'un sol ordinador o navegador. necessito que estigui les dades guardades a github"

**Explicació**: Solució amb GitHub API i Personal Access Token.

---

## 11. Confirmació de token disponible

**Petició**: "tinc el token"

**Accions**:
- Modificació de `script.js` per usar GitHub API
- Afegit configuració `GITHUB_CONFIG`
- Implementació de `checkGitHubToken()`
- Implementació de `loadFromGitHub()`
- Implementació de `saveToGitHub()`
- Modificació de `saveToLocalStorage()` per desar a GitHub
- Afegit modal de configuració del token a `index.html`
- Creació de funcions: `openTokenModal()`, `closeTokenModal()`, `saveToken()`, `clearToken()`
- Canvi del botó "Exportar JSON" a "⚙️ Configuració"
- Commit i push de la integració GitHub API

**Funcionalitats afegides**:
- Sincronització automàtica amb GitHub
- Carrega de dades des de GitHub API
- Desar automàtic a GitHub a cada canvi
- Modal de configuració per gestionar el token
- Suport multi-dispositiu
- Historial de commits automàtics
- Notificacions de sincronització

---

## 12. Confirmació de funcionament

**Petició**: "perfecte ara si que funciona"

**Resposta**: Confirmació de totes les funcionalitats implementades i suggeriments de millores futures.

---

## 13. Export de la documentació

**Petició**: "exporta tota la feina a un arxiu markdown i ho guardes a la carpeta"

**Accions**:
- Creació de `README.md` amb documentació completa:
  - Característiques del projecte
  - Guia d'ús pas a pas
  - Instruccions per obtenir token de GitHub
  - Explicació de totes les funcionalitats
  - Estructura del projecte
  - Format de dades JSON
  - Configuració tècnica
  - Solució de problemes
  - Millores futures
- `git pull --rebase` (per sincronitzar canvis remots)
- Commit i push del README

---

## 14. Export de l'historial de peticions

**Petició**: "Esporta a markdown tots els prompts que t'he fet"

**Acció**: Creació d'aquest document (`HISTORIAL_PROJECTE.md`) amb totes les peticions i accions realitzades.

---

## Resum del projecte

### Tecnologies utilitzades
- HTML5
- CSS3 (amb variables CSS)
- JavaScript (ES6+)
- GitHub API
- localStorage API
- Clipboard API

### Fitxers creats
1. `index.html` - Estructura HTML amb modals
2. `styles.css` - Estils minimalistes i responsive
3. `script.js` - Lògica amb integració GitHub API
4. `data/prompts.json` - Dades inicials
5. `README.md` - Documentació completa
6. `HISTORIAL_PROJECTE.md` - Aquest document

### Funcionalitats principals
- ✅ Gestió de prompts (CRUD)
- ✅ Categories personalitzables
- ✅ Drag & drop
- ✅ Sistema de paperera
- ✅ Copiar al portapapers
- ✅ Sincronització GitHub
- ✅ Multi-dispositiu
- ✅ Interfície en català
- ✅ Responsive design
- ✅ Persistència automàtica

### Enllaços
- **Repositori**: https://github.com/tomeu-cd100/repositori-prompts
- **Aplicatiu**: https://tomeu-cd100.github.io/repositori-prompts/
- **Commits**: https://github.com/tomeu-cd100/repositori-prompts/commits/main

---

**Data de creació**: 16 d'octubre de 2025
**Creat amb**: Claude Code 🤖

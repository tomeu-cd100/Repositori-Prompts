# Biblioteca de Prompts

Aplicatiu web per gestionar i organitzar prompts amb sincronització automàtica a GitHub.

## 🎯 Característiques

- **Gestió de prompts**: Crea, edita i organitza els teus prompts
- **Categories personalitzables**: Organitza prompts per categories amb drag & drop
- **Sistema de paperera**: Esborra i restaura prompts de forma segura
- **Sincronització GitHub**: Les dades es guarden automàticament al repositori
- **Multi-dispositiu**: Accedeix a les teves dades des de qualsevol navegador
- **Interfície minimalista**: Disseny net i elegant en català
- **Copiar al portapapers**: Copia prompts amb un sol clic

## 🚀 Com utilitzar-lo

### 1. Crear un token de GitHub

Per sincronitzar les dades, necessites un Personal Access Token de GitHub:

1. Ves a [github.com/settings/tokens](https://github.com/settings/tokens)
2. Clica "Generate new token" → "Generate new token (classic)"
3. Dona-li un nom: `repositori-prompts`
4. Marca només el permís **`repo`** (accés complet al repositori)
5. Clica "Generate token"
6. **Copia el token** (només el veuràs una vegada)

### 2. Configurar l'aplicatiu

1. Obre l'aplicatiu: [https://tomeu-cd100.github.io/repositori-prompts/](https://tomeu-cd100.github.io/repositori-prompts/)
2. Apareixerà un modal demanant el token
3. Enganxa el token i clica "Desar"
4. Les dades es carregaran automàticament

### 3. Utilitzar des d'un altre dispositiu

1. Obre l'aplicatiu al nou dispositiu
2. Clica el botó "⚙️ Configuració"
3. Introdueix el mateix token de GitHub
4. Les teves dades es sincronitzaran automàticament

## 📖 Funcionalitats

### Gestió de prompts

- **Afegir prompt**: Clica "+ Afegir Prompt"
- **Editar prompt**: Fes doble clic sobre la targeta del prompt
- **Copiar prompt**: Clica el botó "📋 Copiar" per copiar al portapapers
- **Esborrar prompt**: Doble clic → Botó "🗑️ Esborrar" (va a la paperera)
- **Moure prompt**: Arrossega la targeta a una altra categoria

### Gestió de categories

- **Afegir categoria**: Clica "+ Nova Categoria"
- **Editar categoria**: Fes doble clic sobre el nom de la categoria
- **Reordenar categories**: Arrossega categories per canviar l'ordre
- **Esborrar categoria**: Doble clic → "🗑️ Esborrar Categoria" (només si està buida)

### Paperera

- Els prompts esborrats van automàticament a la categoria "Paperera"
- **Restaurar prompt**: A la paperera, clica "♻️ Restaurar" i selecciona la categoria
- **Crear categoria nova**: Quan restaures, pots crear una categoria nova
- **Esborrar definitivament**: A la paperera, clica "🗑️ Esborrar" (irreversible)

### Sincronització

- Tots els canvis es guarden automàticament a GitHub
- Cada modificació crea un commit al repositori
- Notificació de confirmació: "✓ Desat a GitHub correctament"

## 🛠️ Estructura del projecte

```
repositori-prompts/
├── index.html          # HTML principal
├── styles.css          # Estils minimalistes
├── script.js           # Funcionalitat amb GitHub API
├── data/
│   └── prompts.json    # Dades inicials (sobreescrites per GitHub)
└── README.md           # Aquest fitxer
```

## 📦 Format de dades (JSON)

```json
{
  "categories": [
    {
      "id": "tots",
      "name": "Tots",
      "order": 0,
      "special": true
    },
    {
      "id": "paperera",
      "name": "Paperera",
      "order": 999,
      "special": true
    },
    {
      "id": "custom_id",
      "name": "Nom de la categoria",
      "order": 1,
      "special": false
    }
  ],
  "prompts": [
    {
      "id": "id_1234567890_abc123",
      "title": "Títol del prompt",
      "description": "Descripció completa del prompt...",
      "categoryId": "custom_id",
      "deleted": false,
      "createdAt": "2025-10-16T12:00:00Z"
    }
  ]
}
```

## 🔧 Configuració tècnica

### GitHub API

L'aplicatiu utilitza l'API de GitHub per:

- **Carregar dades**: `GET /repos/{owner}/{repo}/contents/{path}`
- **Desar dades**: `PUT /repos/{owner}/{repo}/contents/{path}`

### Configuració (script.js)

```javascript
const GITHUB_CONFIG = {
    owner: 'tomeu-cd100',
    repo: 'repositori-prompts',
    filePath: 'data/prompts.json',
    branch: 'main'
};
```

## 🎨 Disseny

- **Colors**: Paleta de blaus (#4a6fa5) amb tons neutres
- **Tipografia**: System fonts (Apple, Segoe UI, Roboto)
- **Responsive**: Funciona en mòbil, tauleta i escriptori
- **Animacions**: Transicions suaves i feedback visual

## 🔒 Seguretat

- El token es guarda al **localStorage** del navegador
- Només tu tens accés al token
- El token es pot esborrar amb "🗑️ Esborrar Token"
- Comunicació segura amb GitHub via HTTPS

## ⚙️ Funcionalitats avançades

### Drag & Drop

- Arrossega prompts entre categories
- Arrossega prompts a la paperera per esborrar-los
- Reordena categories arrossegant-les

### Categories especials

- **Tots**: Mostra tots els prompts (excepte els de la paperera)
- **Paperera**: Mostra només els prompts esborrats

## 📝 Commits automàtics

Cada canvi genera un commit a GitHub amb el missatge:

```
Actualitzar prompts des de l'aplicació web
```

Pots veure l'historial complet a:
`https://github.com/tomeu-cd100/repositori-prompts/commits/main`

## 🐛 Solució de problemes

### No es carreguen les dades

1. Verifica que el token sigui correcte
2. Assegura't que el token tingui permisos `repo`
3. Comprova la connexió a internet
4. Obre la consola del navegador (F12) per veure errors

### Error desant a GitHub

- **"Error desant a GitHub"**: Token invàlid o sense permisos
- **"Cal configurar el token"**: Afegeix el token a Configuració

### Les dades no es sincronitzen

- Assegura't d'usar el mateix token a tots els dispositius
- Refresca la pàgina per carregar els canvis més recents

## 🚀 Millores futures

Possibles funcionalitats a afegir:

- [ ] Cercar prompts per text
- [ ] Filtrar per categories
- [ ] Importar/exportar categories
- [ ] Etiquetes per als prompts
- [ ] Mode fosc
- [ ] Compartir prompts amb altres usuaris
- [ ] Estadístiques d'ús
- [ ] Duplicar prompts
- [ ] Plantilles de prompts

## 📄 Llicència

Aquest projecte és de codi obert. Pots utilitzar-lo, modificar-lo i compartir-lo lliurement.

## 🤝 Contribucions

Si vols millorar l'aplicatiu:

1. Fes un fork del repositori
2. Crea una branca amb les teves millores
3. Envia un pull request

## 📧 Suport

Si tens preguntes o problemes, obre un issue al repositori de GitHub.

---

**Creat amb** [Claude Code](https://claude.com/claude-code) 🤖

**Data de creació**: Octubre 2025

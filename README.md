# Planning Poker Application

Jednoduchá aplikace pro Planning Poker s následujícími funkcemi:

## Funkce

- **Karty**: 0.1, 0.25, 0.5, 1, 2
- **Vytvoření stolu**: Vytvoří unikátní URL pro pozvání dalších hráčů
- **Výběr avatara**: Hráči si vyberou emoji avatar (Pepe style)
- **Real-time hlasování**: WebSocket komunikace pro okamžitou aktualizaci
- **Odhalení karet**: Zobrazení všech hlasů současně
- **Reset hlasování**: Nové kolo hlasování

## Spuštění pomocí Docker

```bash
docker compose up -d --build
```

Aplikace bude dostupná na: http://localhost:3000

## Spuštění bez Dockeru

1. Nainstalujte závislosti:
```bash
npm install
```

2. Spusťte server:
```bash
npm start
```

Aplikace bude dostupná na: http://localhost:3000

## Použití

1. Otevřete http://localhost:3000
2. Klikněte na "Vytvořit nový stůl"
3. Zadejte své jméno a vyberte avatar
4. Zkopírujte odkaz a sdílejte ho s ostatními hráči
5. Všichni hráči vyberou kartu
6. Klikněte na "Odhalit karty" pro zobrazení výsledků
7. Klikněte na "Nové hlasování" pro další kolo

## Technologie

- **Backend**: Node.js, Express, WebSocket (ws)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Deployment**: Docker

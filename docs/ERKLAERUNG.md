# Der Code erklärt

Diese Datei erklärt, wie die Wetter-App aufgebaut ist und warum.
Sie hilft auch, das Projekt in einem Bewerbungsgespräch zu erklären.

## Ablauf

1. Die Seite lädt. `index.html` bindet erst `config.js` (Schlüssel), dann `main.js` (Logik) ein.
2. `firstCall()` prüft, ob ein Schlüssel da ist, und bestimmt die Start-Stadt.
3. `getWeatherData(stadt)` fragt die Wetterdaten bei OpenWeatherMap ab.
4. `fillData(wetter)` schreibt die Daten in die Seite und wählt den Hintergrund.
5. Tippt der Nutzer eine Stadt ein und drückt Enter, laufen Schritt 3 und 4 erneut.

## Was ist eine API?

Eine API ist eine Adresse im Internet, die Daten statt einer Webseite liefert.
Die App ruft zum Beispiel diese Adresse auf:

```
https://api.openweathermap.org/data/2.5/weather?q=Bremerhaven&units=metric&appid=SCHLUESSEL
```

- `q` ist die Stadt.
- `units=metric` liefert Grad Celsius.
- `appid` ist der API-Schlüssel. Damit erkennt der Anbieter, wer anfragt.

Die Antwort kommt als JSON, ein Textformat für Daten. Ausschnitt:

```json
{
  "name": "Bremerhaven",
  "sys": { "country": "DE" },
  "main": { "temp": 7.8, "temp_max": 10.2, "temp_min": 4.7 },
  "weather": [{ "main": "Clouds", "description": "broken clouds" }],
  "wind": { "speed": 4.6 },
  "cod": 200
}
```

Deshalb steht im Code `weather.main.temp` oder `weather.weather[0].description`: Das sind die Wege durch dieses Objekt.

## main.js

**`fetch` und `async`/`await`:** `fetch(url)` schickt die Anfrage. Die Antwort braucht Zeit, deshalb liefert `fetch` ein „Promise“ (ein Versprechen auf ein späteres Ergebnis).
`await` wartet auf dieses Ergebnis, ohne die Seite zu blockieren. `await` darf nur in Funktionen stehen, die mit `async` markiert sind.

**`res.json()`** wandelt den Antworttext in ein JavaScript-Objekt um.

**`encodeURIComponent(city)`** macht aus „Frankfurt am Main“ `Frankfurt%20am%20Main`. Leerzeichen und Umlaute sind in einer URL sonst nicht erlaubt.

**Fehlerbehandlung, drei Fälle:**

| Fall                     | Woran erkannt                       | Meldung                        |
|--------------------------|-------------------------------------|--------------------------------|
| Stadt gibt es nicht      | `cod` ist 404                       | „City … was not found.“        |
| Anderer Fehler der API   | `cod` ist nicht 200 (z. B. 401)     | Fehlertext der API             |
| Kein Internet            | `fetch` wirft einen Fehler → `catch`| „Could not load …“             |

`Number(result.cod)` ist nötig, weil die API den Code bei Erfolg als Zahl (`200`) und bei Fehlern als Text (`"404"`) schickt.

**`textContent`** schreibt reinen Text in ein Element. Im Gegensatz zu `innerHTML` kann dabei kein fremdes HTML eingeschleust werden. Das ist wichtig, weil die Daten von einem fremden Server kommen.

**`hidden`:** Die Wetterkarte ist am Anfang versteckt und wird erst gezeigt, wenn Daten da sind.

**`HOT_FROM = 18`:** Die Grenze für den warmen Hintergrund steht als benannte Konstante oben im Code und nicht als bloße Zahl mitten in einer Bedingung.

## Die API-Schlüssel

In der ersten Version standen die Schlüssel direkt in `main.js` und damit öffentlich auf GitHub.
Jeder konnte sie kopieren und auf Kosten des Kontos benutzen.

Jetzt gilt:

- `config.js` enthält die echten Schlüssel und steht in `.gitignore`. Git lädt die Datei nicht hoch.
- `config.example.js` ist eine Vorlage ohne echte Schlüssel und liegt im Repository.
- Fehlt `config.js`, zeigt die App eine Meldung statt eines Fehlers.

Grenze dieser Lösung: Alles, was im Browser läuft, kann der Besucher sehen, auch den Schlüssel.
Wirklich geheim bleibt ein Schlüssel nur auf einem Server, der die Anfrage weiterleitet (ein „Proxy“).

## main.css

- **CSS-Variablen** (`--main-shadow`, `--light-glass`): Ein Wert wird einmal festgelegt und mehrfach benutzt.
- **`linear-gradient`**: Farbverläufe für den warmen und kalten Hintergrund. Es werden keine Bilddateien gebraucht.
- **`backdrop-filter: blur(...)`**: Der Glas-Effekt. Der Bereich hinter dem Element wird weichgezeichnet.
- **`@media (max-width: 480px)`**: Kleinere Schrift auf dem Handy.
- **`.visually-hidden`**: Die Beschriftung des Suchfelds ist unsichtbar, wird aber von Screenreadern vorgelesen.

## Mögliche Fragen im Gespräch

- **Warum steht der Schlüssel nicht im Code?** Öffentliche Schlüssel können missbraucht werden. Geheimnisse gehören in eine Konfigurationsdatei, die nicht versioniert wird, oder auf einen Server.
- **Was passiert bei einer falschen Stadt?** Die API antwortet mit Code 404, die App zeigt eine Meldung und behält die alten Daten.
- **Warum `async`/`await` statt `.then()`?** Beides funktioniert. Mit `await` liest sich der Code von oben nach unten, und Fehler lassen sich mit `try`/`catch` an einer Stelle abfangen.
- **Was würdest du als Nächstes verbessern?** Eine Vorhersage für mehrere Tage, Wetter-Symbole, Umschaltung zwischen Celsius und Fahrenheit, und ein kleiner Server, der den Schlüssel geheim hält.

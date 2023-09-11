# Zagadnienie biznesowe:
Aplikacja do przechowywania informacji na temat potworów stworzonych przez użytkowników do wykorzystania w grach D&D. Planowana jako zastęptwo za notatki dotyczące przeciwników oraz fizyczne kości do gry. Spełnia także funkcję łatwego środka wymiany ciekawych kreacji między użytkownikami. Celem aplikacji jest służenie jako narzędzie wspomagające dla osób prowadzących gry D&D a także graczy biorących w nich udział.

# Wymagania systemowe i funkcjonalne:
Aplikacja powinna mieć model serwer - klient z powodu potrzeby posiadania wspólnej bazy danych by móc służyć jako repozytorium potworów i innych istot widoczne dla wszystkich użytkowników. Konieczne jest wprowadzenie systemu logowania by było wiadome kto jest autorem danej kreacji. Autentykacja użytkowników zrealizowana zostanie za pomocą jwt a hasła będą hashowane przy pomocy biblioteki bcrypt. By zapewnić gładkie przejścia między elementami, po stronie klienta zastosowana zostanie biblioteka React.js. Strona serwera operować będzie na środowiku Node.js i używać Express.js do stwożenia odpowiednich endpointów swojego API, których klient będzie używał za pomocą biblioteki axios. Baza danych SQLite zostanie użyta do przechowywania informacji po stronie serwera ze wzglądu na łatwość w obsłudze i diagnostyce informacji zawartyh w bazie danych. Jeśli chodzi o funkcjonalność - aplikacja powinna pozwalać na rejestracje i logowanie. Zalogowani użytkownicy powinni mieć możliwość zmiany hasła, usunięcia konta, dodania nowego potwora wraz z formułami rzutu kośćmi, a także edycji i usuwania swoich kreacji. Każdy użytkownik, nawet niezalogowany powinien mieś dostęp do listy użytkowników aplikacji, z kąd powinny dostępne być listy kreacji każdego z użytkowników. Każdy użytkownik powinien mieć wgląd w każdą z kreacji i możliwość symulacji wykonania dowolnej formuły rzutu kośćmi posiadanej przez potwora przeglądanego właśnie przez użytkownika. Tylko właściciel danej kreacji powinien mieć możliwość jej edycji i usunięcia. Ewaluacja formuł powinna odbywać się po stronie klienta by zminimalizować opóźnienia i ociążenie serwera.

# Modelowanie zagadnienia:
Modele danych wymagane w tej aplikacji są niezwykle proste. Potrzebne są jedynie trzy tabelki w bazie danych.
```
Table: User
  Column: id (Type: INTEGER, PK: 1)
  Column: username (Type: VARCHAR(255), PK: 0)
  Column: password (Type: VARCHAR(255), PK: 0)
--------------------------------------------------
Table: Monster
  Column: id (Type: INTEGER, PK: 1)
  Column: name (Type: VARCHAR(255), PK: 0)
  Column: description (Type: TEXT, PK: 0)
  Column: str (Type: INTEGER, PK: 0)
  Column: dex (Type: INTEGER, PK: 0)
  Column: con (Type: INTEGER, PK: 0)
  Column: int (Type: INTEGER, PK: 0)
  Column: wis (Type: INTEGER, PK: 0)
  Column: cha (Type: INTEGER, PK: 0)
  Column: pb (Type: INTEGER, PK: 0)
  Column: userId (Type: INTEGER, PK: 0)
--------------------------------------------------
Table: Formula
  Column: id (Type: INTEGER, PK: 1)
  Column: name (Type: VARCHAR(255), PK: 0)
  Column: diceFormula (Type: VARCHAR(255), PK: 0)
  Column: monsterId (Type: INTEGER, PK: 0)
--------------------------------------------------
```
Relacje **User** do **Monster** i **Monster** do **Formula** to relacje jeden do N gdzie N jest dowolną liczbą naturalną łącznie z zerem. Jak widać **Monster** i **Formula** mają odpowiednie klucze obce umożliwiające te relacje. Zaimplementowane są także kaskady usunięć by uniknąć sytuacji gdzie element mający do czegoś należeć nie ma właściciela. Dobrze widać to we fragmencie kodu, który za to odpowiada:
```
const User = require('../models/user');
const Monster = require('../models/monster');
const Formula = require('../models/formula');

User.hasMany(Monster, { foreignKey: 'userId', onDelete: 'CASCADE' });
Monster.belongsTo(User, { foreignKey: 'userId' });

Monster.hasMany(Formula, { foreignKey: 'monsterId', onDelete: 'CASCADE' });
Formula.belongsTo(Monster, { foreignKey: 'monsterId' });
```

# Implementacja:
Standardowy model serwer - klient gdzie klient wysyła odpowiednie zapytania do API po stronie serwera. Endpointy po stronie serwera podzielone są na dwie grupy - powiazane z użytkownikami i powiązane z potworami. Pliki je zawierające można znaleźć w folderze **routes** po stronie backendu. Klient jedynie wysyła zapytania do serwera w zależności od akcji podjętych przez użytkownika i wyświetla dane, które dostał w odpowiedzi w formie graficznej. Serwer dokonuje odpowiednich operacji na bazie danych w zależności od nadchodzących zapytań i odsyła odpowiedzi zawierające odpowiednie dane. Jest jeden wyjątek od tego sposobu działania, który jest w sumie jedynym ciekawym elementem tej implementacji. Wykonywanie formuł rzutu kośćmi. Jest za to odpowiedzialne 5 funkcji obecnych w komponencie **MonsterDetails.js**:
```
function rollDice(num, faces) {
    let total = 0;
    for (let i = 0; i < num; i++) {
        total += Math.floor(Math.random() * faces) + 1;
    }
    return total;
}

function evaluateExpression(expression) {
    const validMathExpression = /^[\d+\-*/()\s]*$/;
    if (!validMathExpression.test(expression)) {
        throw new Error("Invalid formula detected.");
    }
    // eslint-disable-next-line no-eval
    return eval(expression);
}

function resolveDiceNotation(formula) {
    let result = formula.match(/(\d+|[^d]+)d(\d+|[^d]+)/);
        
    while(result) {
        const [full, left, right] = result;
        const rolls = parseInt(evaluateExpression(left), 10);
        const faces = parseInt(evaluateExpression(right), 10);
            
        formula = formula.replace(full, rollDice(rolls, faces));
            
        result = formula.match(/(\d+|[^d]+)d(\d+|[^d]+)/);
    }

    return formula;
}

function getSmallestParenthesesExpression(formula) {
    let regex = /\(([^()]+)\)/;
    return formula.match(regex);
}

function evaluateFormula(formula, stats) {
    const bonuses = {
        str: Math.floor(stats.str / 2) - 5,
        dex: Math.floor(stats.dex / 2) - 5,
        con: Math.floor(stats.con / 2) - 5,
        int: Math.floor(stats.int / 2) - 5,
        wis: Math.floor(stats.wis / 2) - 5,
        cha: Math.floor(stats.cha / 2) - 5,
        pb: stats.pb
    };
    
    for (let [key, value] of Object.entries(bonuses)) {
        const regex = new RegExp(`\\[${key}\\]`, 'g');
        formula = formula.replace(regex, value.toString());
    }
    
    let expr = getSmallestParenthesesExpression(formula);
    while(expr) {
        let resolved = resolveDiceNotation(expr[1]);
        formula = formula.replace(expr[0], evaluateExpression(resolved));
            
        expr = getSmallestParenthesesExpression(formula);
    }

    formula = resolveDiceNotation(formula);
    return evaluateExpression(formula);
}
```
Odpowiadają one za zastąpienie atrybutów takich jak **\[str\]** ich faktycznymi bonusami, evaluacje rzutów kośćmi, prykładowo **3d12**, i ostateczną ewaluacje wyrażenia gdy te elementy zostaną sprowadzone do wartości liczbowych. Przykłady poprawnych formuł:
```
Typowa formuła ataku w formacie obsługiwanym przez funkcję ewaluującą:
1d20 + [str] + [pb]

Coś trochę bardziej skomplikowanego:
([str] * 2)d([pb] + 1) + 2d(3d4)
```

# Podsumowanie:
Cel utworzenia aplikacji będącej narzędziem wspomagającym dla grup D&D został osiągnięty. Perspektywa rozwoju dla tego projektu to udostępnienie go na jakimś serwerze w chmurze tak by różne osoby zainteresowane dzieleniem się swoimi kreacjami mogły je udostępniać innym przy pomocy tej aplikacji. Szata graficzna aplikacji powinna zostać rozwinięta. Jedyne trudności napotkane podczas tworzenia aplikacji to trudności z czasem, niezwiązane z samą aplikacją i wynikające z prywanymi sprawami jej twórcy.
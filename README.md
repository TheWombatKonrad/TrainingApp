# TrainingApp

Träning: En applikation som låter användaren sätta ihop ett personligt träningsprogram utifrån en fördefinierad uppsättning övningar (armhävningar, sit-ups, etc.). Användaren kan se en sammanfattning av exempelvis hur lång tid träningsprogrammet tar att utföra eller hur många kalorier det bränner.

VG-funktionalitet: Läs upp övningarna i träningsprogrammet med Web Speech API (så att användaren inte behöver titta på skärmen) och sätt lämpliga pauser i uppläsningen utifrån antalet repetitioner och hur lång tid en repetition uppskattas ta.


- json med övningarna
- funktion för att lägga till övning i listan
- och ta bort övning i listan
- sammanfatting av tid
- hur intensiv blir träningen

localStorage
Web Speech API - lämpliga pauser

ÖVNING
- namn på övning
- beskrivning??
- svårighetsnivå
- bild??

FÄRDIGA TRÄNINGSPROGRAM




PROBLEMS
v-bind fungerar ej med object properties, måste defineras i data()

när vi tar bort från workout så tar vi bort den första av den typen från listan - hur ska vi göra för att ta bort den specifika vi tryckte på?

kan en ha watch om vi ska ha två timers, watch uppdateras inte medan metoder körs
måste lägga in raster i workoutlistan, kan inte bara vänta för då pausas stora timern också
en liten flick för att fälla ut beskrivning
lunge - push-ups bäst
göra så att break försvinner automatiskt när det är två i rad

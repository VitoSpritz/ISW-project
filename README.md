# ISW-project
Project for ISW exam
![Logo](./frontend/src/public/logo_good2.svg)
Made by Vito Paolo Potenza & Giorgio Zappoli

# Relazione di progetto

Lo scopo del progetto è stato quello di progettare e sviluppare una web app di chat a gruppi.

Nello specifico si tratta di un'applicazione in cui occorre creare un account, ognuno può creare le proprie stanze e partecipare a stanze già esistenti.
Quando si crea una **stanza** si diventa automaticamente il *proprietario*, avendo così tutti i privilegi quali *rimuovere i messaggi*, *sospendere utenti per un certo periodo di tempo* e *promuovere e rimuovere altri utenti a **moderatore** della camera*.
Ogni **moderatore** può solo eliminare messaggi e sospendere utenti.

## Tecnologie utilizzate

### Frontend

Per il frontend abbiamo utilizzato il framework **Vue.js e Vite** in aggiunta a **TypeScript**. Come librerie abbiamo utilizzato **Axios** per le chiamate Ajax e **socket.io** per la realizzazione del socket di connessione alle camere testuali. Per migliorare la scritta CSS abbiamo utilizzato **SASS** come estensione per una scrittura più facile e scorrevole.

### Backend

Per il backend invece, abbiamo utilizzato **TypeScript** come linguaggio di scripting, **Express** come framework backend per la gestione delle connessioni HTTP e per il routing. **Node.js** è stato utilizzato come motore lato server e **socket.io** per la gestione degli eventi delle chat, quali connessione degli utenti, creazione camere e gestione dei messaggi inviati.
Abbiamo utilizzato anche la libreria **bcrypt** per criptare le password, così da non salvarle in chiaro nel database.
Abbiamo anche gestito chiamate a database tramite la libreria **MySql2**, che ci ha permesso di salvare dati su un database relazionale **MySQL**, con il quale si effettuano periodicamente chiamate per il corretto funzionamento dell'applicazione.

### Criticità

Nella fase di sviluppo lato server, ci sono state diverse criticità nella gestione degli eventi del socket, risolte tramite accurate ricerche su forum e tramite la documentazione di [socket.io](https://socket.io/docs/v4/).

### Conclusione

Lo sviluppo dell'applicazione è stato fatto in modo *responsive*, seguendo il modello *mobile-first* e adottando i criteri di accessibilità dettati nello scorso corso di **Fondamenti di sistemi Web**.
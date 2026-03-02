# VehicleRentalSystem

Application de gestion de location de véhicules composée de trois parties :

| Partie         | Rôle                 | URL                     |
| -------------- | -------------------- | ----------------------- |
| **Backend**    | API REST Spring Boot | `http://localhost:8081` |
| **Backoffice** | Interface admin (BO) | `http://localhost:5173` |
| **Webapp**     | Portail client       | `http://localhost:5174` |

---

## Prérequis

- **Java 17+**
- **Maven** (ou utiliser `./mvnw` inclus)
- **Node.js 18+** et **npm**
- **MySQL / MariaDB** sur le port `3306` (ou MAMP sur `8889`)

---

## 1. Base de données

Démarrer MySQL/MariaDB, puis vérifier la configuration dans `application.properties` :

```
backend/src/main/resources/application.properties
```

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/vehiclerental?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=        # laisser vide si pas de mot de passe
```

> La base `vehiclerental` est créée automatiquement au premier démarrage du backend.

---

## 2. Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

Le serveur démarre sur **`http://localhost:8081`**.

### Endpoints principaux

| Méthode  | URL                      | Description                   |
| -------- | ------------------------ | ----------------------------- |
| `GET`    | `/vehicles`              | Liste tous les véhicules      |
| `POST`   | `/vehicles`              | Ajouter un véhicule           |
| `DELETE` | `/vehicles/{id}`         | Supprimer un véhicule         |
| `GET`    | `/vehicles/{id}/rentals` | Locations d'un véhicule       |
| `POST`   | `/vehicles/{id}/rent`    | Louer (admin, par customerId) |
| `POST`   | `/vehicles/{id}/book`    | Réserver (portail client)     |
| `GET`    | `/customers`             | Liste tous les clients        |
| `POST`   | `/customers`             | Ajouter un client             |
| `DELETE` | `/customers/{id}`        | Supprimer un client           |
| `GET`    | `/rentals`               | Liste toutes les locations    |
| `GET`    | `/rentals/vehicle/{id}`  | Locations d'un véhicule       |

---

## 3. Backoffice (Admin)

```bash
cd backoffice
npm install      # première fois uniquement
npm run dev
```

Ouvre **`http://localhost:5173`** dans le navigateur.

### Fonctionnalités

- **Véhicules** — Ajouter / supprimer des voitures, Vélos et camions. Cliquer sur 📅 pour voir le calendrier de disponibilité d'un véhicule.
- **Clients** — Ajouter / supprimer des clients.
- **Locations** — Voir toutes les locations avec dates et prix. Les locations terminées sont grisées. Cliquer sur une ligne pour voir le détail.

---

## 4. Webapp (Portail client)

```bash
cd webapp
npm install      # première fois uniquement
npm run dev
```

Ouvre **`http://localhost:5174`** dans le navigateur.

### Fonctionnalités

- **Accueil** — Page d'accueil avec aperçu des véhicules disponibles.
- **Catalogue** — Parcourir tous les véhicules, filtrer par type (Voiture / Vélo / Camion).
- **Réservation** — Cliquer sur "Réserver" sur un véhicule :
  1. Remplir **Nom**, **Email** et **Téléphone** (obligatoires)
  2. Choisir les dates de prise en charge et de retour
  3. Le calendrier montre les jours **loués** (rouge) et **disponibles** (vert)
  4. Le prix total est calculé automatiquement
  5. Confirmer la réservation

> Si une date est déjà réservée, le système bloque la réservation avec un message d'erreur.

---

## 5. Lancer tout en même temps

Ouvrir **3 terminaux** :

```bash
# Terminal 1 — Backend
cd backend && ./mvnw spring-boot:run

# Terminal 2 — Backoffice
cd backoffice && npm run dev

# Terminal 3 — Webapp
cd webapp && npm run dev
```

---

## Structure du projet

```
vehiclerental/
├── backend/                        # API Spring Boot
│   └── src/main/java/com/vehiclerental/
│       ├── controller/             # VehicleController, CustomerController, RentalController
│       ├── model/                  # Vehicle (abstract), Car, Bike, Truck, Customer, Rental
│       ├── service/                # Logique métier + validation des dates
│       └── repository/             # JPA repositories
├── backoffice/                     # Interface admin (React + Vite + Tailwind)
│   └── src/
│       ├── pages/                  # VehiclesPage, CustomersPage, RentalsPage
│       └── components/             # VehicleCalendar
└── webapp/                         # Portail client (React + Vite + Tailwind)
    └── src/
        ├── pages/
        │   └── client/             # HomePage, CatalogPage, BookingPage
        └── components/             # ClientNavbar
```

---

## Types de véhicules

| Type               | Champs spécifiques      | Calcul du prix                   |
| ------------------ | ----------------------- | -------------------------------- |
| **Voiture** (CAR)  | Nombre de portes        | `prix/jour × jours`              |
| **Vélo** (BIKE)    | Électrique (oui/non)    | `prix/jour × jours × 0.9` (-10%) |
| **Camion** (TRUCK) | Capacité de charge (kg) | `prix/jour × jours + 50€`        |

-- =============================================================
-- Données de test - VehicleRentalSystem
-- Exécuté après la création du schéma par Hibernate (ddl-auto=update)
-- INSERT IGNORE évite les doublons au redémarrage
-- =============================================================

-- Vehicles (table parent)
INSERT IGNORE INTO vehicle (id, brand, base_price_per_day, dtype) VALUES
    (1, 'Toyota Corolla',  50.00,  'CAR'),
    (2, 'Renault Clio',    40.00,  'CAR'),
    (3, 'Trek FX3',        20.00,  'BIKE'),
    (4, 'Cowboy C4',       25.00,  'BIKE'),
    (5, 'Volvo FH16',     100.00,  'TRUCK'),
    (6, 'Mercedes Actros', 120.00, 'TRUCK');

-- Cars (table enfant)
INSERT IGNORE INTO car (id, number_of_doors) VALUES
    (1, 4),
    (2, 5);

-- Bikes (table enfant)
INSERT IGNORE INTO bike (id, electric) VALUES
    (3, false),
    (4, true);

-- Trucks (table enfant)
INSERT IGNORE INTO truck (id, load_capacity) VALUES
    (5, 5000.0),
    (6, 8000.0);

-- Customers
INSERT IGNORE INTO customer (id, name, email, phone_number) VALUES
    (1, 'Jean Dupont',   'jean.dupont@email.com',   '0612345678'),
    (2, 'Marie Martin',  'marie.martin@email.com',  '0687654321'),
    (3, 'Paul Bernard',  'paul.bernard@email.com',  '0698765432');

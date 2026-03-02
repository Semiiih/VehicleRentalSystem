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

-- Rentals (locations avec dates variées pour le calendrier)
INSERT IGNORE INTO rental (id, start_date, end_date, total_price, customer_id, vehicle_id) VALUES
    (1, '2026-03-01', '2026-03-05', 200.00, 1, 1),
    (2, '2026-03-10', '2026-03-15', 240.00, 2, 1),
    (3, '2026-03-03', '2026-03-07', 180.00, 1, 2),
    (4, '2026-03-20', '2026-03-25', 90.00,  3, 3),
    (5, '2026-04-01', '2026-04-10', 250.00, 2, 4),
    (6, '2026-03-08', '2026-03-12', 500.00, 3, 5),
    (7, '2026-03-15', '2026-03-20', 720.00, 1, 6);

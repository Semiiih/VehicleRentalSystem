package com.vehiclerental.service;

import com.vehiclerental.model.Customer;
import com.vehiclerental.model.Rental;
import com.vehiclerental.model.Vehicle;
import com.vehiclerental.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;
    private final VehicleService vehicleService;
    private final CustomerService customerService;

    public Rental createRental(Customer customer, Vehicle vehicle, LocalDate startDate, LocalDate endDate) {
        // Validation des dates
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Les dates de début et de fin sont obligatoires");
        }
        if (!endDate.isAfter(startDate)) {
            throw new IllegalArgumentException("La date de fin doit être après la date de début");
        }
        if (startDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("La date de début ne peut pas être dans le passé");
        }

        // Vérification de la disponibilité du véhicule
        List<Rental> conflicts = rentalRepository.findOverlapping(vehicle.getId(), startDate, endDate);
        if (!conflicts.isEmpty()) {
            Rental conflict = conflicts.get(0);
            throw new IllegalStateException(
                    "Le véhicule " + vehicle.getBrand() + " est déjà loué du " +
                    conflict.getStartDate() + " au " + conflict.getEndDate() +
                    ". Veuillez choisir d'autres dates.");
        }

        int days = (int) ChronoUnit.DAYS.between(startDate, endDate);
        Rental rental = new Rental();
        rental.setCustomer(customer);
        rental.setVehicle(vehicle);
        rental.setStartDate(startDate);
        rental.setEndDate(endDate);
        rental.setTotalPrice(vehicle.calculateRentalPrice(days));
        return rentalRepository.save(rental);
    }

    public Rental createRentalByIds(Long vehicleId, Long customerId, LocalDate startDate, LocalDate endDate) {
        Vehicle vehicle = vehicleService.findById(vehicleId);
        Customer customer = customerService.findById(customerId);
        return createRental(customer, vehicle, startDate, endDate);
    }

    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    public List<Rental> getRentalsByVehicleId(Long vehicleId) {
        return rentalRepository.findByVehicleId(vehicleId);
    }
}

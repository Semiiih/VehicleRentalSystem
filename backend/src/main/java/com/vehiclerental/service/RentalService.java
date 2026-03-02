package com.vehiclerental.service;

import com.vehiclerental.model.Customer;
import com.vehiclerental.model.Rental;
import com.vehiclerental.model.Vehicle;
import com.vehiclerental.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;
    private final VehicleService vehicleService;
    private final CustomerService customerService;

    public Rental createRental(Customer customer, Vehicle vehicle, int days) {
        Rental rental = new Rental();
        rental.setCustomer(customer);
        rental.setVehicle(vehicle);
        rental.setStartDate(LocalDate.now());
        rental.setEndDate(LocalDate.now().plusDays(days));
        rental.setTotalPrice(vehicle.calculateRentalPrice(days));
        return rentalRepository.save(rental);
    }

    public Rental createRentalByIds(Long vehicleId, Long customerId, int days) {
        Vehicle vehicle = vehicleService.findById(vehicleId);
        Customer customer = customerService.findById(customerId);
        return createRental(customer, vehicle, days);
    }

    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }
}

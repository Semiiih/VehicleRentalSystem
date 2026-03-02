package com.vehiclerental.controller;

import com.vehiclerental.model.Customer;
import com.vehiclerental.model.Rental;
import com.vehiclerental.model.Vehicle;
import com.vehiclerental.service.CustomerService;
import com.vehiclerental.service.RentalService;
import com.vehiclerental.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;
    private final RentalService rentalService;
    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(vehicleService.createVehicle(vehicle));
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    // Admin: location par customerId
    @PostMapping("/{id}/rent")
    public ResponseEntity<Rental> rentVehicle(
            @PathVariable Long id,
            @RequestParam Long customerId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        Rental rental = rentalService.createRentalByIds(id, customerId, startDate, endDate);
        return ResponseEntity.ok(rental);
    }

    // Client: location avec infos client dans le body
    @PostMapping("/{id}/book")
    public ResponseEntity<Rental> bookVehicle(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String phone = body.get("phoneNumber");
        String start = body.get("startDate");
        String end = body.get("endDate");

        if (name == null || name.isBlank()) throw new IllegalArgumentException("Le nom est obligatoire");
        if (email == null || email.isBlank()) throw new IllegalArgumentException("L'email est obligatoire");
        if (phone == null || phone.isBlank()) throw new IllegalArgumentException("Le numéro de téléphone est obligatoire");
        if (start == null || end == null) throw new IllegalArgumentException("Les dates sont obligatoires");

        Customer customer = customerService.findOrCreateByEmail(name, email, phone);
        Vehicle vehicle = vehicleService.findById(id);
        Rental rental = rentalService.createRental(customer, vehicle, LocalDate.parse(start), LocalDate.parse(end));
        return ResponseEntity.ok(rental);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}

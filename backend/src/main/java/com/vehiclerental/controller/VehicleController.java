package com.vehiclerental.controller;

import com.vehiclerental.model.Rental;
import com.vehiclerental.model.Vehicle;
import com.vehiclerental.service.RentalService;
import com.vehiclerental.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;
    private final RentalService rentalService;

    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(vehicleService.createVehicle(vehicle));
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    @PostMapping("/{id}/rent")
    public ResponseEntity<Rental> rentVehicle(
            @PathVariable Long id,
            @RequestParam Long customerId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        Rental rental = rentalService.createRentalByIds(id, customerId, startDate, endDate);
        return ResponseEntity.ok(rental);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}

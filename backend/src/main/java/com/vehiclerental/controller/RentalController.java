package com.vehiclerental.controller;

import com.vehiclerental.model.Rental;
import com.vehiclerental.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @GetMapping
    public ResponseEntity<List<Rental>> getAllRentals() {
        return ResponseEntity.ok(rentalService.getAllRentals());
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<Rental>> getRentalsByVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(rentalService.getRentalsByVehicleId(vehicleId));
    }
}

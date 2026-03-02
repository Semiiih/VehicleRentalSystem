package com.vehiclerental.service;

import com.vehiclerental.exception.ResourceNotFoundException;
import com.vehiclerental.model.Vehicle;
import com.vehiclerental.repository.RentalRepository;
import com.vehiclerental.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final RentalRepository rentalRepository;

    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle findById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
    }

    public double rentVehicle(Long id, int days) {
        return findById(id).calculateRentalPrice(days);
    }

    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = findById(id);
        rentalRepository.deleteAll(rentalRepository.findByVehicleId(id));
        vehicleRepository.delete(vehicle);
    }
}

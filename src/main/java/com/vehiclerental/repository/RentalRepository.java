package com.vehiclerental.repository;

import com.vehiclerental.model.Rental;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findByVehicleId(Long vehicleId);
}

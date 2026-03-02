package com.vehiclerental.repository;

import com.vehiclerental.model.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findByVehicleId(Long vehicleId);

    @Query("SELECT r FROM Rental r WHERE r.vehicle.id = :vehicleId " +
           "AND r.startDate < :endDate AND r.endDate > :startDate")
    List<Rental> findOverlapping(@Param("vehicleId") Long vehicleId,
                                 @Param("startDate") LocalDate startDate,
                                 @Param("endDate") LocalDate endDate);
}

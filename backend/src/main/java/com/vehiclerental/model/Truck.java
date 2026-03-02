package com.vehiclerental.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "truck")
@DiscriminatorValue("TRUCK")
@Getter
@Setter
@NoArgsConstructor
public class Truck extends Vehicle {

    private double loadCapacity;

    private static final double EXTRA_CHARGE = 50.0;

    @Override
    public double calculateRentalPrice(int days) {
        // Fixed extra charge for trucks
        return getBasePricePerDay() * days + EXTRA_CHARGE;
    }
}

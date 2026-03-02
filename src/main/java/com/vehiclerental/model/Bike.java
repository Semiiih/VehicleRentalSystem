package com.vehiclerental.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bike")
@DiscriminatorValue("BIKE")
@Getter
@Setter
@NoArgsConstructor
public class Bike extends Vehicle {

    private boolean electric;

    @Override
    public double calculateRentalPrice(int days) {
        // 10% discount for bikes
        return getBasePricePerDay() * days * 0.9;
    }
}

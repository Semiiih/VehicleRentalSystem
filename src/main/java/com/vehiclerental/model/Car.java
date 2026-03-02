package com.vehiclerental.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "car")
@DiscriminatorValue("CAR")
@Getter
@Setter
@NoArgsConstructor
public class Car extends Vehicle {

    private int numberOfDoors;

    @Override
    public double calculateRentalPrice(int days) {
        return getBasePricePerDay() * days;
    }
}

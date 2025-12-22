package com.campimove.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ratings")
public class TravelRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public String motoristName;

    public Double rating;

    public TravelRating(String travel, Double rating) {
        this.motoristName = travel;
        this.rating = rating;
    }

}

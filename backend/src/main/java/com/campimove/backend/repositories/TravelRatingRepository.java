package com.campimove.backend.repositories;

import com.campimove.backend.entities.Transport;
import com.campimove.backend.entities.TravelRating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravelRatingRepository extends JpaRepository<TravelRating, Long> {
    TravelRating[] findAllByMotoristName(String motoristName);
}

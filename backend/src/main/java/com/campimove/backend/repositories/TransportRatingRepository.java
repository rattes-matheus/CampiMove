package com.campimove.backend.repositories;

import com.campimove.backend.entities.TransportRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface TransportRatingRepository extends JpaRepository<TransportRating, Long> {
    List<TransportRating> findByTransportId(Long transportId);
    Optional<TransportRating> findByTransportIdAndUserId(Long transportId, Long userId);
    List<TransportRating> findByUserId(Long userId);
    Long countByTransportId(Long transportId);

    @Query("SELECT AVG(tr.rating) FROM TransportRating tr WHERE tr.transport.id = :transportId")
    Double calculateAverageRatingByTransportId(@Param("transportId") Long transportId);
}
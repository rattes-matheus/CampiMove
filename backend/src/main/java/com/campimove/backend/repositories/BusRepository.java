package com.campimove.backend.repositories;

import com.campimove.backend.entities.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface BusRepository extends JpaRepository<Bus, Long> {
    Optional<Bus> findByPlate(String plate);
    List<Bus> findByActiveTrue();
    List<Bus> findByDriverId(Long driverId);

    @Query("SELECT b FROM Bus b WHERE b.plate LIKE %:search% OR b.company LIKE %:search% OR b.model LIKE %:search%")
    List<Bus> searchBuses(@Param("search") String search);

    @Query("SELECT COUNT(b) FROM Bus b WHERE b.active = true")
    long countActiveBuses();
}
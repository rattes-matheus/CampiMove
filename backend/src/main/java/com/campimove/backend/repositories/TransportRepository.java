package com.campimove.backend.repositories;

import com.campimove.backend.entities.Transport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransportRepository extends JpaRepository<Transport, Long> {
    Transport findByMotorist(String motorist);
}

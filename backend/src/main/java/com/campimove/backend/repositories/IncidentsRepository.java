package com.campimove.backend.repositories;

import com.campimove.backend.entities.Incident;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncidentsRepository extends JpaRepository<Incident, Long> {
}
package com.campimove.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.campimove.backend.entity.Motorista;

public interface MotoristaRepository extends JpaRepository<Motorista, Long> {
}

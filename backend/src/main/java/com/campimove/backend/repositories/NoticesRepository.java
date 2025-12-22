package com.campimove.backend.repositories;

import com.campimove.backend.entities.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NoticesRepository extends JpaRepository<Notice, Long> {
    @Query("""
        SELECT n FROM Notice n
        WHERE n.active = true
        ORDER BY 
          CASE n.priority
            WHEN 'HIGH' THEN 1
            WHEN 'MEDIUM' THEN 2
            WHEN 'LOW' THEN 3
          END,
          n.date DESC
    """)
    List<Notice> findActiveOrdered();
}
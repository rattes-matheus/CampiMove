package com.campimove.backend.repositories;

import com.campimove.backend.entities.UserReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserReportRepository extends JpaRepository<UserReport,Long> {
    boolean existsByReporterIdAndUserid(Long reporterId, Long userid);
}

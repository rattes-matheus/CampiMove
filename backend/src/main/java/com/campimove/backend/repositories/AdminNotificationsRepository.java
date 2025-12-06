package com.campimove.backend.repositories;

import com.campimove.backend.entities.AdminNotification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminNotificationsRepository extends JpaRepository<AdminNotification, Long> {
}

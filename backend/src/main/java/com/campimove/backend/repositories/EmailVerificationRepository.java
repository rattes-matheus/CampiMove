package com.campimove.backend.repositories;

import com.campimove.backend.entities.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    EmailVerification findByEmail(String email);
    EmailVerification findByCode(String code);
}

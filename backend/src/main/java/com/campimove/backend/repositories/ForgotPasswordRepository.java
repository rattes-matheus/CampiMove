package com.campimove.backend.repositories;

import com.campimove.backend.entities.ForgotPassword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ForgotPasswordRepository extends JpaRepository<ForgotPassword, Long> {
  Optional<ForgotPassword> findByToken(String token);
}

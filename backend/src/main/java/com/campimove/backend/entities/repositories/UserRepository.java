package com.campimove.backand.entities.repositories;

import java.util.Optional;
import com.campimove.backand.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
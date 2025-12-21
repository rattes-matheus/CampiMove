package com.campimove.backend.repositories;

import com.campimove.backend.enums.Role;
import com.campimove.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    User findByEmail(String email);
    List<User> findByRole(Role role);

    @Query("SELECT u FROM User u WHERE u.licenseNumber = :licenseNumber")
    User findByLicenseNumber(@Param("licenseNumber") String licenseNumber);

    @Query("SELECT u FROM User u WHERE u.role = 'DRIVER' AND u.active = true")
    List<User> findActiveDrivers();
}
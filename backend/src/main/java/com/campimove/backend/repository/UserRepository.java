package com.campimove.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campimove.backend.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
}

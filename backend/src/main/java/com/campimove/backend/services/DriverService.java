package com.campimove.backend.services;

import com.campimove.backend.dtos.DriverRequestDTO;
import com.campimove.backend.dtos.DriverResponseDTO;
import com.campimove.backend.entities.User;
import com.campimove.backend.enums.Role;
import com.campimove.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DriverService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public DriverResponseDTO createDriver(DriverRequestDTO dto) {
        // 1. Verifica se e-mail já existe
        if (userRepository.existsByEmail(dto.email())) {
            throw new RuntimeException("Erro: Este e-mail já está cadastrado.");
        }

        // 2. Verifica se CNH já existe
        if (userRepository.findByLicenseNumber(dto.licenseNumber()) != null) {
            throw new RuntimeException("Erro: Esta CNH já está cadastrada.");
        }

        // 3. Cria a entidade preenchendo TODOS os campos
        User driver = new User();
        driver.setName(dto.name());
        driver.setEmail(dto.email());
        driver.setPassword(passwordEncoder.encode(dto.password()));
        driver.setRole(Role.DRIVER); // Define como motorista
        driver.setActive(true);
        driver.setVerified(true);

        // Campos específicos da Migration V18 (MUITO IMPORTANTE)
        driver.setPhone(dto.phone());
        driver.setLicenseNumber(dto.licenseNumber());
        driver.setLicenseCategory(dto.licenseCategory());
        driver.setAge(dto.age());
        driver.setRating(0.0);

        // 4. Salva no banco
        User savedDriver = userRepository.save(driver);

        return convertToResponseDTO(savedDriver);
    }

    private DriverResponseDTO convertToResponseDTO(User driver) {
        return new DriverResponseDTO(
                driver.getId(),
                driver.getName(),
                driver.getEmail(),
                driver.getPhone(),
                driver.getLicenseNumber(),
                driver.getRating(),
                driver.getProfilePictureUrl(),
                driver.isActive()
        );
    }
}
package com.campimove.backend.services;

import com.campimove.backend.dtos.BusDTO;
import com.campimove.backend.dtos.CreateBusDTO;
import com.campimove.backend.dtos.UpdateBusDTO;
import com.campimove.backend.entities.Bus;
import com.campimove.backend.entities.User;
import com.campimove.backend.repositories.BusRepository;
import com.campimove.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private UserRepository userRepository;

    public List<BusDTO> getAllBuses() {
        return busRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BusDTO> getActiveBuses() {
        return busRepository.findByActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BusDTO getBusById(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ônibus não encontrado com ID: " + id));
        return convertToDTO(bus);
    }

    @Transactional
    public BusDTO createBus(CreateBusDTO dto) {
        if (busRepository.findByPlate(dto.plate()).isPresent()) {
            throw new RuntimeException("Placa já cadastrada: " + dto.plate());
        }

        Bus bus = new Bus();
        bus.setPlate(dto.plate().toUpperCase());
        bus.setCompany(dto.company());
        bus.setCapacity(dto.capacity());
        bus.setModel(dto.model());
        bus.setYear(dto.year());
        bus.setActive(true);

        if (dto.driverId() != null) {
            User driver = userRepository.findById(dto.driverId())
                    .orElseThrow(() -> new RuntimeException("Motorista não encontrado com ID: " + dto.driverId()));
            bus.setDriver(driver);
        }

        Bus savedBus = busRepository.save(bus);
        return convertToDTO(savedBus);
    }

    @Transactional
    public BusDTO updateBus(Long id, UpdateBusDTO dto) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ônibus não encontrado com ID: " + id));

        if (dto.plate() != null && !dto.plate().isEmpty()) {
            busRepository.findByPlate(dto.plate())
                    .ifPresent(existingBus -> {
                        if (!existingBus.getId().equals(id)) {
                            throw new RuntimeException("Placa já cadastrada: " + dto.plate());
                        }
                    });
            bus.setPlate(dto.plate().toUpperCase());
        }

        if (dto.company() != null) bus.setCompany(dto.company());
        if (dto.capacity() != null) bus.setCapacity(dto.capacity());
        if (dto.model() != null) bus.setModel(dto.model());
        if (dto.year() != null) bus.setYear(dto.year());
        if (dto.active() != null) bus.setActive(dto.active());

        if (dto.driverId() != null) {
            User driver = userRepository.findById(dto.driverId())
                    .orElseThrow(() -> new RuntimeException("Motorista não encontrado com ID: " + dto.driverId()));
            bus.setDriver(driver);
        } else {
            bus.setDriver(null);
        }

        Bus updatedBus = busRepository.save(bus);
        return convertToDTO(updatedBus);
    }

    private BusDTO convertToDTO(Bus bus) {
        return new BusDTO(
                bus.getId(),
                bus.getPlate(),
                bus.getCompany(),
                bus.getCapacity(),
                bus.getModel(),
                bus.getYear(),
                bus.getActive(),
                bus.getDriver() != null ? bus.getDriver().getId() : null,
                bus.getDriver() != null ? bus.getDriver().getName() : null
        );
    }
}
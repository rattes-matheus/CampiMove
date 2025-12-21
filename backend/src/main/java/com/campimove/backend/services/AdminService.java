package com.campimove.backend.services;

import com.campimove.backend.entities.User;
import com.campimove.backend.enums.Role;
import com.campimove.backend.repositories.BusRepository;
import com.campimove.backend.repositories.TransportRepository;
import com.campimove.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private TransportRepository transportRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        long activeDrivers = userRepository.findByRole(Role.DRIVER)
                .stream()
                .filter(User::isActive)
                .count();
        long totalBuses = busRepository.count();
        long activeBuses = busRepository.countActiveBuses();
        long totalTransports = transportRepository.count();
        long activeTransports = transportRepository.findAll()
                .stream()
                .filter(t -> t.isActive())
                .count();

        Double averageTransportRating = transportRepository.findAll()
                .stream()
                .filter(t -> t.getAverageRating() != null && t.getAverageRating() > 0)
                .mapToDouble(t -> t.getAverageRating())
                .average()
                .orElse(0.0);

        stats.put("totalUsers", totalUsers);
        stats.put("activeDrivers", activeDrivers);
        stats.put("totalBuses", totalBuses);
        stats.put("activeBuses", activeBuses);
        stats.put("totalTransports", totalTransports);
        stats.put("activeTransports", activeTransports);
        stats.put("averageTransportRating", averageTransportRating);
        stats.put("totalReports", 0L);

        return stats;
    }
}
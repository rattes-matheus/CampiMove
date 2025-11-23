package com.campimove.backend.services;

import com.campimove.backend.dtos.UserReportResponseDTO;
import com.campimove.backend.entities.User;
import com.campimove.backend.entities.UserReport;
import com.campimove.backend.repositories.UserReportRepository;
import com.campimove.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {
    @Autowired
    private UserReportRepository userReportRepository;

    @Autowired
    private UserRepository userRepository;

    public List<UserReportResponseDTO> listReports(){
        return userReportRepository.findAll().stream().map(report -> {
            User driver = userRepository
                    .findById(report.getUserid())
                    .orElse(null);

            String driverName = driver != null ? driver.getName() : "Usuário desconhecido";

            return new UserReportResponseDTO(
                    report.getId(),
                    report.getUserid(),
                    driverName,
                    report.getReport_text()
            );
        }).toList();
    }

    public void ignoreReport(Long id){
        userReportRepository.deleteById(id);
    }

    public void disableUser (Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(false);
        userRepository.save(user);
    }

    public void disableUserFromReport(Long userId, Long reportId) {
        disableUser(userId);
        ignoreReport(reportId);
    }
}

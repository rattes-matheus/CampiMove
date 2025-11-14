package com.campimove.backend.services;

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

    public List<UserReport> listReports(){
        return userReportRepository.findAll();
    }

    public void ignoreReport(Long id){
        userReportRepository.deleteById(id);
    }

    public void deleteUser (Long userId, Long reportId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);

        ignoreReport(reportId);
    }
}

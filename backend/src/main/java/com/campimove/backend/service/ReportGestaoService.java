package com.campimove.backend.service;

import com.campimove.backend.dto.ReportRequest;
import com.campimove.backend.entities.Report;
import com.campimove.backend.repository.ReportRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ReportGestaoService {

    private final ReportRepository repository;

    public ReportGestaoService(ReportRepository repository) {
        this.repository = repository;
    }

    public Report criar(ReportRequest request) {
        Report report = new Report(
                request.getUserId(),
                request.getType(),
                request.getDescription(),
                request.getRoute()
        );
        return repository.save(report);
    }

    public Report atualizar(Long id, ReportRequest request) {
        Optional<Report> optional = repository.findById(id);

        if (optional.isEmpty()) {
            throw new RuntimeException("Report não encontrado");
        }

        Report report = optional.get();
        report.setUserId(request.getUserId());
        report.setType(request.getType());
        report.setDescription(request.getDescription());
        report.setRoute(request.getRoute());

        return repository.save(report);
    }

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Report não encontrado");
        }
        repository.deleteById(id);
    }
}

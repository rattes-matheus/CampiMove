package com.campimove.backend.services;

import com.campimove.backend.entities.Report;
import com.campimove.backend.repositories.ReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReportConsultaService {

    private final ReportRepository repository;

    public ReportConsultaService(ReportRepository repository) {
        this.repository = repository;
    }

    public List<Report> listarTodos() {
        return repository.findAll();
    }

    public Optional<Report> buscarPorId(Long id) {
        return repository.findById(id);
    }
}

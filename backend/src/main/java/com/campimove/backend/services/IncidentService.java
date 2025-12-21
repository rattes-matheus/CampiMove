package com.campimove.backend.services;

import com.campimove.backend.dtos.IncidentRequestDTO;
import com.campimove.backend.dtos.IncidentResponseDTO;
import com.campimove.backend.entities.Incident;
import com.campimove.backend.entities.User;
import com.campimove.backend.enums.IncidentCategory;
import com.campimove.backend.enums.IncidentStatus;
import com.campimove.backend.repositories.IncidentsRepository;
import com.campimove.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

    @Service
    public class IncidentService {

        @Autowired
        private IncidentsRepository incidentsRepository;

        @Autowired
        private UserRepository userRepository;

        public Incident createIncident(IncidentRequestDTO formData) {

            Incident incident = new Incident(
                    formData.title(),
                    formData.full_description(),
                    formData.category(),
                    formData.reporter_id()
            );

            return incidentsRepository.save(incident);
        }

        public IncidentResponseDTO getIncidentDetails(Long id) {

            Incident incident = incidentsRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Incidente não encontrado"));

            User user = userRepository.findById(incident.getReporter_id())
                    .orElse(null);

            String reporterName = (user != null)
                    ? user.getName()
                    : "Usuário desconhecido";

            return new IncidentResponseDTO(
                    incident.getId(),
                    incident.getTitle(),
                    incident.getFull_description(),
                    formatSummary(incident),
                    translateCategory(incident.getCategory()),
                    incident.getReporter_id(),
                    reporterName,
                    incident.getCreated_at(),
                    incident.getStatus().name()
            );
        }


        public List<IncidentResponseDTO> getAllIncidents() {
            return incidentsRepository.findAll()
                    .stream()
                    .map(incident -> {

                        User user = userRepository.findById(incident.getReporter_id())
                                .orElse(null);

                        String reporterName = (user != null)
                                ? user.getName()
                                : "Usuário desconhecido";

                        return new IncidentResponseDTO(
                                incident.getId(),
                                incident.getTitle(),
                                incident.getFull_description(),
                                formatSummary(incident),
                                translateCategory(incident.getCategory()),
                                incident.getReporter_id(),
                                reporterName,
                                incident.getCreated_at(),
                                incident.getStatus().name()
                        );
                    })
                    .toList();
        }

        private String formatSummary(Incident incident) {
            String category = translateCategory(incident.getCategory());

            String title = incident.getTitle();
            String route = "";
            String time = "";

            if (title != null && title.contains(" - ")) {

                String[] parts = title.split(" - ");

                if (parts.length >= 3) {

                    String routeRaw = parts[1];
                    time = parts[2];

                    route = routeRaw
                            .replace("TO", " para ")
                            .replace("_", " ");
                }
            }

            return category + " | " + route + " - " + time;
        }

        public void deleteIncident(Long id) {
            if (!incidentsRepository.existsById(id)) {
                throw new RuntimeException("Incidente não encontrado");
            }
            incidentsRepository.deleteById(id);
        }

        private String translateCategory(IncidentCategory category) {
            return switch (category) {
                case DELAY -> "Atraso";
                case BUS_MISSING -> "Ônibus não passou";
                case OVERCROWDED -> "Superlotação";
                case DRIVER -> "Problema com motorista";
                case SAFETY -> "Segurança";
                case ROUTE -> "Rota";
                case COMFORT -> "Conforto";
                default -> "Outro";
            };
        }

        public void updateStatus(Long id, IncidentStatus status) {

            Incident incident = incidentsRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Incidente não encontrado"));

            incident.setStatus(status);
            incidentsRepository.save(incident);
        }

    }
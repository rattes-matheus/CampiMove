package com.campimove.backend.repositories; 

import com.campimove.backend.entities.Incident; 
import com.campimove.backend.enums.IncidentCategory;
import com.campimove.backend.enums.IncidentStatus;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class IncidentSpecification {
    public static Specification<Incident> filterBy(String searchTerm, String status, String category) { 
        return (root, query, criteriaBuilder) -> { 
            
            List<Predicate> predicates = new ArrayList<>();
            
            if (searchTerm != null && !searchTerm.trim().isEmpty()) {
                String likePattern = "%" + searchTerm.toLowerCase(Locale.ROOT) + "%";
                Predicate titleMatch = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("title")), likePattern);
                Predicate descriptionMatch = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("fullDescription")), likePattern);
                
                predicates.add(criteriaBuilder.or(titleMatch, descriptionMatch));
            }
            
            if (status != null && !status.trim().isEmpty()) {
                try {
                    IncidentStatus incidentStatus = IncidentStatus.valueOf(status.toUpperCase());
                    predicates.add(criteriaBuilder.equal(root.get("status"), incidentStatus));
                } catch (IllegalArgumentException e) {}
            }

            if (category != null && !category.trim().isEmpty()) {
                try {
                    IncidentCategory incidentCategory = IncidentCategory.valueOf(category.toUpperCase());
                    predicates.add(criteriaBuilder.equal(root.get("category"), incidentCategory));
                } catch (IllegalArgumentException e) {}
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
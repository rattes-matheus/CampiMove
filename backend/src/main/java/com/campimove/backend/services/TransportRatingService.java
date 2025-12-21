package com.campimove.backend.services;

import com.campimove.backend.dtos.RateTransportRequestDTO;
import com.campimove.backend.dtos.TransportRatingResponseDTO;
import com.campimove.backend.dtos.TransportWithRatingsDTO;
import com.campimove.backend.entities.Transport;
import com.campimove.backend.entities.TransportRating;
import com.campimove.backend.entities.User;
import com.campimove.backend.repositories.TransportRatingRepository;
import com.campimove.backend.repositories.TransportRepository;
import com.campimove.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransportRatingService {

    @Autowired
    private TransportRatingRepository transportRatingRepository;

    @Autowired
    private TransportRepository transportRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public TransportRatingResponseDTO rateTransport(Long transportId, Long userId, RateTransportRequestDTO request) {
        Transport transport = transportRepository.findById(transportId)
                .orElseThrow(() -> new RuntimeException("Transporte não encontrado"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        TransportRating existingRating = transportRatingRepository.findByTransportIdAndUserId(transportId, userId).orElse(null);

        TransportRating rating;
        if (existingRating != null) {
            existingRating.setRating(request.rating());
            existingRating.setReview(request.review());
            existingRating.setCreatedAt(LocalDateTime.now());
            rating = existingRating;
        } else {
            rating = new TransportRating();
            rating.setTransport(transport);
            rating.setUser(user);
            rating.setRating(request.rating());
            rating.setReview(request.review());
            rating.setCreatedAt(LocalDateTime.now());
        }

        TransportRating savedRating = transportRatingRepository.save(rating);
        updateTransportAverageRating(transportId);

        return new TransportRatingResponseDTO(
                savedRating.getId(),
                transportId,
                userId,
                user.getName(),
                savedRating.getRating(),
                savedRating.getReview(),
                savedRating.getCreatedAt()
        );
    }

    private void updateTransportAverageRating(Long transportId) {
        Double average = transportRatingRepository.calculateAverageRatingByTransportId(transportId);
        Long total = transportRatingRepository.countByTransportId(transportId);

        Transport transport = transportRepository.findById(transportId)
                .orElseThrow(() -> new RuntimeException("Transporte não encontrado"));
        transport.setAverageRating(average != null ? average : 0.0);
        transport.setTotalRatings(total != null ? total.intValue() : 0);
        transportRepository.save(transport);
    }

    public List<TransportRatingResponseDTO> getRatingsByTransportId(Long transportId) {
        return transportRatingRepository.findByTransportId(transportId).stream()
                .map(rating -> new TransportRatingResponseDTO(
                        rating.getId(),
                        rating.getTransport().getId(),
                        rating.getUser().getId(),
                        rating.getUser().getName(),
                        rating.getRating(),
                        rating.getReview(),
                        rating.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    public Double getAverageRatingByTransportId(Long transportId) {
        return transportRatingRepository.calculateAverageRatingByTransportId(transportId);
    }

    public List<TransportWithRatingsDTO> getTopRatedTransports() {
        List<Transport> transports = transportRepository.findAll();
        return transports.stream()
                .filter(t -> t.getAverageRating() != null && t.getAverageRating() > 0)
                .sorted((t1, t2) -> Double.compare(t2.getAverageRating(), t1.getAverageRating()))
                .map(t -> new TransportWithRatingsDTO(
                        t.getId(),
                        t.getType(),
                        t.getModel(),
                        t.getCapacity(),
                        t.getContact(),
                        t.isActive(),
                        t.getAverageRating(),
                        t.getTotalRatings()
                ))
                .limit(10)
                .collect(Collectors.toList());
    }

    public List<TransportRatingResponseDTO> getRatingsByUserId(Long userId) {
        return transportRatingRepository.findByUserId(userId).stream()
                .map(rating -> new TransportRatingResponseDTO(
                        rating.getId(),
                        rating.getTransport().getId(),
                        rating.getUser().getId(),
                        rating.getUser().getName(),
                        rating.getRating(),
                        rating.getReview(),
                        rating.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}
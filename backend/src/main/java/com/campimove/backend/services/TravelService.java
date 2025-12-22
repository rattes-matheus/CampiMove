package com.campimove.backend.services;

import com.campimove.backend.dtos.TripDetailsDTO;
import com.campimove.backend.dtos.UpcomingTravelDTO;
import com.campimove.backend.entities.ChatMessageEntity;
import com.campimove.backend.entities.TravelRating;
import com.campimove.backend.entities.User;
import com.campimove.backend.repositories.ChatMessageRepository;
import com.campimove.backend.repositories.TravelRatingRepository;
import com.campimove.backend.repositories.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class TravelService {

    @Autowired
    private ChatMessageRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TravelRatingRepository travelRatingRepository;

    public List<UpcomingTravelDTO> getUpcomingTravelsForUser(String userId) {

        List<String> acceptedRoomIds = repository.findAcceptedRoomIdsByRecipientId(userId);

        if (acceptedRoomIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<ChatMessageEntity> proposalMessages = repository.findProposalMessagesByRoomIds(acceptedRoomIds);

        return proposalMessages.stream().map(message -> {
            try {
                TripDetailsDTO tripDetails = objectMapper.readValue(
                        message.getTripProposal(),
                        TripDetailsDTO.class
                );

                String motoristId = message.getSenderId();
                User motorist = userRepository.findById(Long.valueOf(motoristId))
                        .orElse(null);

                String motoristName = (motorist != null) ? motorist.getName() : "Motorista Desconhecido";

                System.out.println(motoristName);

                TravelRating[] rating = travelRatingRepository.findAllByMotoristName(motoristName);

                if (rating.length == 0) {
                    return new UpcomingTravelDTO(
                            motoristName,
                            tripDetails.origin(),
                            tripDetails.destination(),
                            tripDetails.schedule(),
                            false,
                            0.0
                    );
                }

                return new UpcomingTravelDTO(
                        motoristName,
                        tripDetails.origin(),
                        tripDetails.destination(),
                        tripDetails.schedule(),
                        true,
                        rating[0].getRating()
                );


            } catch (IOException e) {
                e.printStackTrace();
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }

    public List<UpcomingTravelDTO> getUpcomingTravelsForMotorist(String motoristId) {

        List<String> acceptedRoomIds = repository.findAcceptedRoomIdsBySenderId(motoristId);

        if (acceptedRoomIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<ChatMessageEntity> proposalMessages = repository.findProposalMessagesByRoomIds(acceptedRoomIds);

        return proposalMessages.stream().map(message -> {
            try {
                TripDetailsDTO tripDetails = objectMapper.readValue(
                        message.getTripProposal(),
                        TripDetailsDTO.class
                );

                String passengerId = message.getRecipientId();
                User passenger = userRepository.findById(Long.valueOf(passengerId))
                        .orElse(null);

                String passengerName = (passenger != null) ? passenger.getName() : "Passageiro Desconhecido";

                return new UpcomingTravelDTO(
                        passengerName,
                        tripDetails.origin(),
                        tripDetails.destination(),
                        tripDetails.schedule(),
                        false,
                        0.0
                );
            } catch (IOException e) {
                e.printStackTrace();
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }

    public void changeTripStatus(String id, boolean status) {
        List<String> listOfRoomIds = new LinkedList<>();
        listOfRoomIds.add(id);

        ChatMessageEntity proposal = repository.findProposalMessagesByRoomIds(listOfRoomIds).getLast();
        proposal.setIsTripAccepted(status);
        repository.save(proposal);
    }

}
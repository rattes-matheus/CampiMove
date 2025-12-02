package com.campimove.backend.services;

import com.campimove.backend.dtos.UpcomingTravelDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.campimove.backend.dtos.ChatMessageDTO;
import com.campimove.backend.dtos.ConversationStateDTO;
import com.campimove.backend.dtos.TripDetailsDTO;
import com.campimove.backend.entities.ChatMessageEntity;
import com.campimove.backend.entities.User;
import com.campimove.backend.repositories.ChatMessageRepository;
import com.campimove.backend.repositories.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    public void saveMessage(ChatMessageDTO chatMessage, String roomId) {
        ChatMessageEntity entity = new ChatMessageEntity();
        entity.setRoomId(roomId);
        entity.setSenderId(chatMessage.senderId());
        entity.setSenderName(chatMessage.senderName());
        entity.setRecipientId(chatMessage.recipientId());
        entity.setText(chatMessage.text());
        entity.setTimestamp(Instant.parse(chatMessage.timestamp()));

        entity.setIsTripAccepted(chatMessage.isTripAccepted());

        if (chatMessage.tripProposal() != null) {
            try {
                String tripProposalJson = objectMapper.writeValueAsString(chatMessage.tripProposal());
                entity.setTripProposal(tripProposalJson);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }

        repository.save(entity);
    }

    @Autowired
    private UserRepository userRepository;

    public List<ConversationStateDTO> getActiveConversations(String motoristId) {
        List<Object[]> results = repository.findLastMessagesForMotorist(motoristId);

        return results.stream().map(result -> {
            String roomId = (String) result[0];
            String senderId = (String) result[1];
            String lastMessage = (String) result[2];

            Instant timestamp = (Instant) result[3];
            String lastMessageTimestamp = timestamp.toString();
            String otherParticipantId = getOtherParticipantId(roomId, motoristId);

            User otherParticipant = userRepository.findById(Long.valueOf(otherParticipantId)).get();

            return new ConversationStateDTO(
                    otherParticipantId,
                    otherParticipant.getName(),
                    lastMessage,
                    motoristId
            );
        }).collect(Collectors.toList());
    }

    private String getOtherParticipantId(String roomId, String loggedMotoristId) {
        String[] parts = roomId.split("_");
        if (parts.length != 2) {
            return "";
        }
        return parts[0].equals(loggedMotoristId) ? parts[1] : parts[0];
    }

    public List<ChatMessageDTO> getChatHistory(String roomId) {
        List<ChatMessageEntity> entities = repository.findByRoomIdOrderByTimestampAsc(roomId);

        return entities.stream()
                .map(entity -> {

                    TripDetailsDTO tripProposal = null;
                    if (entity.getTripProposal() != null && !entity.getTripProposal().isEmpty()) {
                        try {
                            tripProposal = objectMapper.readValue(entity.getTripProposal(), TripDetailsDTO.class);
                        } catch (JsonProcessingException e) {
                            e.printStackTrace();
                        }
                    }

                    return new ChatMessageDTO(
                            entity.getSenderId(),
                            entity.getSenderName(),
                            entity.getRecipientId(),
                            entity.getText(),
                            entity.getTimestamp().toString(),
                            tripProposal,
                            entity.getIsTripAccepted()
                    );
                })
                .collect(Collectors.toList());
    }
}
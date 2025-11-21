package com.campimove.backend.services;

import com.campimove.backend.controllers.ChatController;
import com.campimove.backend.dtos.ChatMessageDTO;
import com.campimove.backend.entities.ChatMessageEntity;
import com.campimove.backend.entities.User;
import com.campimove.backend.repositories.ChatMessageRepository;
import com.campimove.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository repository;

    public void saveMessage(ChatMessageDTO chatMessage, String roomId) {
        ChatMessageEntity entity = new ChatMessageEntity();
        entity.setRoomId(roomId);
        entity.setSenderId(chatMessage.senderId());
        entity.setSenderName(chatMessage.senderName());
        entity.setRecipientId(chatMessage.recipientId());
        entity.setText(chatMessage.text());
        entity.setTimestamp(Instant.parse(chatMessage.timestamp()));

        repository.save(entity);
    }

    @Autowired
    private UserRepository userRepository;

    public List<ChatController.ConversationState> getActiveConversations(String motoristId) {
        List<Object[]> results = repository.findLastMessagesForMotorist(motoristId);

        return results.stream().map(result -> {
            String roomId = (String) result[0];
            String senderId = (String) result[1];
            String lastMessage = (String) result[2];

            Instant timestamp = (Instant) result[3];
            String lastMessageTimestamp = timestamp.toString();
            String otherParticipantId = getOtherParticipantId(roomId, motoristId);

            User otherParticipant = userRepository.findById(Long.valueOf(otherParticipantId)).get();

            return new ChatController.ConversationState(
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
            // Lógica de erro, mas para o seu caso, deve sempre ter 2 partes.
            return "";
        }
        // Retorna o ID que for diferente do ID do motorista logado
        return parts[0].equals(loggedMotoristId) ? parts[1] : parts[0];
    }

    public List<ChatMessageDTO> getChatHistory(String roomId) {
        List<ChatMessageEntity> entities = repository.findByRoomIdOrderByTimestampAsc(roomId);

        return entities.stream()
                .map(entity -> new ChatMessageDTO(
                        entity.getSenderId(),
                        entity.getSenderName(),
                        entity.getRecipientId(),
                        entity.getText(),
                        entity.getTimestamp().toString()
                ))
                .collect(Collectors.toList());
    }
}
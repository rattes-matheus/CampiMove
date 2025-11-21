package com.campimove.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public record ChatMessage ( String senderId, String senderName, String recipientId, String text, String timestamp){ }

    @MessageMapping("/chat.sendMessage/{roomId}")
    public void sendMessage(
            @DestinationVariable String roomId,
            @Payload ChatMessage chatMessage) {

        messagingTemplate.convertAndSend("/topic/chat/" + roomId, chatMessage);

        messagingTemplate.convertAndSend("/topic/dashboard/" + chatMessage.recipientId(), chatMessage);
    }
}
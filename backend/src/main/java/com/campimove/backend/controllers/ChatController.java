package com.campimove.backend.controllers;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    public static class ChatMessage {
        private String sender;
        private String text;
        private String timestamp;
    }

    @MessageMapping("/chat.sendMessage/{roomId}")
    @SendTo("/topic/chat/{roomId}")
    public ChatMessage sendMessage(
            @DestinationVariable String roomId,
            @Payload ChatMessage chatMessage) {

        return chatMessage;
    }
}
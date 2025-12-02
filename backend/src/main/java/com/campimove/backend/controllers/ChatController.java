package com.campimove.backend.controllers;

import com.campimove.backend.dtos.ChatMessageDTO;
import com.campimove.backend.dtos.ConversationStateDTO;
import com.campimove.backend.services.ChatService; // Importe o serviço
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping; // REST
import org.springframework.web.bind.annotation.PathVariable; // REST
import org.springframework.web.bind.annotation.ResponseBody; // REST

import java.util.List;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatService chatService;

    @MessageMapping("/chat.sendMessage/{roomId}")
    public void sendMessage(
            @DestinationVariable String roomId,
            @Payload ChatMessageDTO chatMessage) {

        chatService.saveMessage(chatMessage, roomId);

        messagingTemplate.convertAndSend("/topic/chat/" + roomId, chatMessage);

        messagingTemplate.convertAndSend("/topic/dashboard/" + chatMessage.recipientId(), chatMessage);
    }

    @GetMapping("/chat/history/{roomId}")
    @ResponseBody // Importante: Garante que o retorno seja JSON
    public List<ChatMessageDTO> getHistory(@PathVariable String roomId) {
        return chatService.getChatHistory(roomId);
    }

    @GetMapping("/chat/conversations/{motoristId}")
    @ResponseBody
    public List<ConversationStateDTO> getActiveConversations(@PathVariable String motoristId) {
        return chatService.getActiveConversations(motoristId);
    }

}
package com.campimove.backend.dtos;

public record ChatMessageDTO ( String senderId, String senderName, String recipientId, String text, String timestamp){ }
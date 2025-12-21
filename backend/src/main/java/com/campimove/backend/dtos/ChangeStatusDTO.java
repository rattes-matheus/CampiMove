package com.campimove.backend.dtos;

public record ChangeStatusDTO(String id, String origin, String destination, String price, String schedule, boolean status) { }

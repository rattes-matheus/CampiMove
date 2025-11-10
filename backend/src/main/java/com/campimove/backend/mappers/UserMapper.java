package com.campimove.backend.mappers;

import com.campimove.backend.dtos.RegisterUserRequest;
import com.campimove.backend.entities.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(RegisterUserRequest request);
}

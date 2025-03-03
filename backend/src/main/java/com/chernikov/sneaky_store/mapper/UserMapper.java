package com.chernikov.sneaky_store.mapper;

import com.chernikov.sneaky_store.dto.UserDTO;
import com.chernikov.sneaky_store.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);


    @Mapping(source = "password", target = "password")
    UserDTO userToUserDTO(User user);

    @Mapping(source = "password", target = "password")
    User userDTOToUser(UserDTO userDTO);
}

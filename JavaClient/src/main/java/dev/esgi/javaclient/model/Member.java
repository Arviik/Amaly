package dev.esgi.javaclient.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Member {
    private int id;
    private String name;
    private String type;
    private String address;
    private String phone;
    private String email;
    private LocalDateTime membershipDate;
    private int organizationID;
    private int userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

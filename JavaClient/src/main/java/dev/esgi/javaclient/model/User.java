package dev.esgi.javaclient.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class User extends Member {
    private String name;
    private String email;
}

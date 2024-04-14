package dev.esgi.javaclient;

import javafx.application.Application;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JavaClientApplication {

    public static void main(String[] args) {
        Application.launch(JavaClientUIApplication.class, args);
    }

}

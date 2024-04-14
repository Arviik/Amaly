package dev.esgi.javaclient;

import dev.esgi.javaclient.stage.StageReadyEvent;
import javafx.application.Application;
import javafx.application.Platform;
import javafx.stage.Stage;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;

public class JavaClientUIApplication extends Application {
    private ConfigurableApplicationContext applicationContext;

    @Override
    public void init() {
        applicationContext = new SpringApplicationBuilder(JavaClientApplication.class).run();
    }

    @Override
    public void start(Stage stage) {
        applicationContext.publishEvent(new StageReadyEvent(stage));
    }

    @Override
    public void stop() {
        applicationContext.close();
        Platform.exit();
    }
}

package dev.esgi.javaclient;

import javafx.fxml.FXML;
import javafx.scene.chart.LineChart;
import org.springframework.stereotype.Component;

@Component
public class BaseController {

    @FXML
    public LineChart<String, Double> chart;
}

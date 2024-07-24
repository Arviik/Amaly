package dev.esgi.javaclient.rest.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

@Component
public class ConnectionChecker {

    private final Logger logger = LogManager.getLogger(this.getClass());
    private final RestClient restClient;

    public ConnectionChecker(RestClient restClient) {
        this.restClient = restClient;
    }

    public boolean checkConnection() {
        try {
            return restClient.get().uri("/health").retrieve().toBodilessEntity().getStatusCode().is2xxSuccessful();
        } catch (ResourceAccessException e) {
            logger.warn("Error while checking api connection : {}", e.getMessage());
            return false;
        }
    }
}

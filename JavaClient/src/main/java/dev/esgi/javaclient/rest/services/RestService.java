package dev.esgi.javaclient.rest.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClient;

import java.lang.reflect.Array;

public class RestService<T> {

    private final Logger logger = LogManager.getLogger(this.getClass());

    private final RestClient restClient;
    private final String apiPath;
    private final Class<T> classType;
    private final Class<T[]> classArrayType;

    public RestService(RestClient restClient, Class<T> classType, String apiPath) {
        this.restClient = restClient;
        this.classType = classType;
        this.classArrayType = createArrayClassType(classType);
        this.apiPath = apiPath;
    }

    public T[] get() {
        return restClient.get()
                .uri(apiPath)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .toEntity(classArrayType)
                .getBody();
    }

    public T getById(int id) {
        return restClient.get()
                .uri(apiPath + "/" + id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .toEntity(classType)
                .getBody();
    }

    public T post(T newObject) {
        ResponseEntity<T> responseEntity = restClient.post()
                .uri(apiPath)
                .contentType(MediaType.APPLICATION_JSON)
                .body(getObjectJsonWithoutId(newObject))
                .retrieve()
                .toEntity(classType);

        logger.info("Requested to ${} ended with status code ${}", apiPath, responseEntity.getStatusCode().value());
        return responseEntity.getBody();
    }

    public T patch(T updatedObject) {
        return restClient.patch()
                .uri(apiPath)
                .contentType(MediaType.APPLICATION_JSON)
                .body(updatedObject)
                .retrieve()
                .toEntity(classType)
                .getBody();
    }

    public T delete(int id) {
        return restClient.delete()
                .uri(apiPath + "/" + id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .toEntity(classType)
                .getBody();
    }

    @SuppressWarnings("unchecked")
    private Class<T[]> createArrayClassType(Class<T> classType) {
        Class<?> aClass = Array.newInstance(classType, 0).getClass();

        if (aClass.isArray() && aClass.getComponentType().equals(classType)) {
            return (Class<T[]>) aClass;
        } else {
            throw new ClassCastException("Cannot cast to Class<T[]>");
        }
    }

    private ObjectNode getObjectJsonWithoutId(T object) {
        ObjectNode node = new ObjectMapper().valueToTree(object);
        node.remove("id");
        return node;
    }
}

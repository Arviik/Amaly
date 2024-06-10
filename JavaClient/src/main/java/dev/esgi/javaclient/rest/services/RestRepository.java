package dev.esgi.javaclient.rest.services;

import dev.esgi.javaclient.model.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;

@Component
public class RestRepository {

    private final Logger logger = LogManager.getLogger(this.getClass());
    private final Map<Class<?>, RestService<?>> restServiceMap = new HashMap<>();

    public RestRepository(RestService<Assignment> assignmentRestService,
                          RestService<Member> memberRestService,
                          RestService<Resource> resourceRestService,
                          RestService<ResourceType> resourceTypeRestService,
                          RestService<Task> taskRestService,
                          RestService<TaskResource> taskResourceRestService) {
        restServiceMap.put(Assignment.class, assignmentRestService);
        restServiceMap.put(Member.class, memberRestService);
        restServiceMap.put(Resource.class, resourceRestService);
        restServiceMap.put(ResourceType.class, resourceTypeRestService);
        restServiceMap.put(Task.class, taskRestService);
        restServiceMap.put(TaskResource.class, taskResourceRestService);
    }

    public <T> T save(T object) {
        try {
            int id = (int) object.getClass().getMethod("getId").invoke(object);

            RestService<T> restService = getRestService(object.getClass());
            if (id == 0) {
                return restService.post(object);
            } else {
                return restService.patch(object);
            }
        } catch (InvocationTargetException | IllegalAccessException | NoSuchMethodException e) {
            logger.error("Error while saving object through RestRepository : {}", e.getMessage());
            return null;
        }
    }

    public <T> T[] getAll(Class<T> classType) {
        RestService<T> restService = getRestService(classType);
        return restService.get();
    }

    public <T> T getById(Class<T> classType, int id) {
        RestService<T> restService = getRestService(classType);
        return restService.getById(id);
    }

    public <T> T delete(Class<T> classType, int id) {
        RestService<T> restService = getRestService(classType);
        return restService.delete(id);
    }

    @SuppressWarnings("unchecked")
    private <T> RestService<T> getRestService(Class<?> classType) {
        RestService<?> restService = restServiceMap.get(classType);
        if (restService == null) {
            throw new IllegalArgumentException("No RestService available for " + classType.getName() + " class type");
        }
        return (RestService<T>) restService;
    }
}

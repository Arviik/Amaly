package dev.esgi.javaclient.rest.config;

import dev.esgi.javaclient.model.*;
import dev.esgi.javaclient.rest.services.RestService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestServiceConfig {

    @Bean
    public RestService<Assignment> assignmentRestService(RestClient restClient) {
        return new RestService<>(restClient, Assignment.class, "/assignments");
    }

    @Bean
    public RestService<Member> memberRestService(RestClient restClient) {
        return new RestService<>(restClient, Member.class, "/members");
    }

    @Bean
    public RestService<Resource> resourceRestService(RestClient restClient) {
        return new RestService<>(restClient, Resource.class, "/resources");
    }

    @Bean
    public RestService<ResourceType> resourceTypeRestService(RestClient restClient) {
        return new RestService<>(restClient, ResourceType.class, "/resource-types");
    }

    @Bean
    public RestService<Task> taskRestService(RestClient restClient) {
        return new RestService<>(restClient, Task.class, "/tasks");
    }

    @Bean
    public RestService<TaskResource> taskResourceRestService(RestClient restClient) {
        return new RestService<>(restClient, TaskResource.class, "/task-resources");
    }
}

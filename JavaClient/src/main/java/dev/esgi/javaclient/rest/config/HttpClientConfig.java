package dev.esgi.javaclient.rest.config;

import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClientBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HttpClientConfig {
    //TODO https://howtodoinjava.com/spring-boot2/resttemplate/resttemplate-httpclient-java-config/

    @Bean
    public CloseableHttpClient httpClient() {
        return HttpClientBuilder.create().build();
    }
}

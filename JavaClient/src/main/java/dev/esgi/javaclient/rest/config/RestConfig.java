package dev.esgi.javaclient.rest.config;

import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class RestConfig {

    @Value("${api.host.baseurl}")
    private String baseurl;

    private final CloseableHttpClient httpClient;

    public RestConfig(CloseableHttpClient httpClient) {
        this.httpClient = httpClient;
    }

    @Bean
    RestClient restClient() {
        return RestClient.builder().baseUrl(baseurl)
                //.requestInterceptor()
                //.defaultHeader("Authorization", fetchToken())
                //.messageConverters()
                .requestFactory(clientHttpRequestFactory()).build();
    }

    @Bean
    public HttpComponentsClientHttpRequestFactory clientHttpRequestFactory() {
        HttpComponentsClientHttpRequestFactory clientHttpRequestFactory = new HttpComponentsClientHttpRequestFactory();
        clientHttpRequestFactory.setHttpClient(httpClient);
        return clientHttpRequestFactory;
    }
}

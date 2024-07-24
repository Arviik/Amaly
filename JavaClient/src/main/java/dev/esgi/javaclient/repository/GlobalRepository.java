package dev.esgi.javaclient.repository;

import dev.esgi.javaclient.rest.utils.ConnectionChecker;
import lombok.Getter;
import org.springframework.stereotype.Component;

@Component
public class GlobalRepository implements Repository {

    @Getter
    private final RestRepository restRepository;
    @Getter
    private final SQLiteRepository sqLiteRepository;
    private final ConnectionChecker connectionChecker;

    public GlobalRepository(RestRepository restRepository, SQLiteRepository sqLiteRepository, ConnectionChecker connectionChecker) {
        this.restRepository = restRepository;
        this.sqLiteRepository = sqLiteRepository;
        this.connectionChecker = connectionChecker;
    }

    public <T> T save(T object) {
        if (connectionChecker.checkConnection()) {
            sqLiteRepository.save(object);
            return restRepository.save(object);
        }
        return sqLiteRepository.save(object);
    }

    public <T> T[] getAll(Class<T> classType) {
        if (connectionChecker.checkConnection()) {
            return restRepository.getAll(classType);
        }
        return sqLiteRepository.getAll(classType);
    }

    public <T> T getById(Class<T> classType, int id) {
        if (connectionChecker.checkConnection()) {
            return restRepository.getById(classType, id);
        }
        return sqLiteRepository.getById(classType, id);
    }

    public <T> T delete(Class<T> classType, int id) {
        if (connectionChecker.checkConnection()) {
            sqLiteRepository.delete(classType, id);
            return restRepository.delete(classType, id);
        }
        return sqLiteRepository.delete(classType, id);
    }
}

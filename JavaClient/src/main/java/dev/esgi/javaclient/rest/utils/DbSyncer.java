package dev.esgi.javaclient.rest.utils;

import dev.esgi.javaclient.model.*;
import dev.esgi.javaclient.repository.RestRepository;
import dev.esgi.javaclient.repository.SQLiteRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class DbSyncer {

    private static final Logger logger = LogManager.getLogger(DbSyncer.class);

    private DbSyncer() {
    }

    private static final List<Class<?>> modelList = new ArrayList<>(
            List.of(
                    Assignment.class,
                    Member.class,
                    Resource.class,
                    ResourceType.class,
                    Task.class,
                    TaskResource.class
            )
    );

    public static void syncSqliteDbFromApi(RestRepository restRepo, SQLiteRepository sqliteRepo) {
        for (Class<?> aClass : modelList) {
            try {
                Object[] restResult = restRepo.getAll(aClass);
                if (Arrays.stream(restResult).findAny().isPresent()) {
                    for (Object o : restResult) {
                        logger.info("Sync saving for {} : {}", aClass.getName(), o);
                        sqliteRepo.save(o);
                    }
                    //sqliteRepo.saveAll(restResult);
                }

                boolean syncStatus = Arrays.equals(restResult, sqliteRepo.getAll(aClass));
                logger.info("Sync statuts for {} : {}", aClass.getName(), syncStatus);
            } catch (Exception e) {
                logger.error("Error while syncing {} : {}", aClass.getName(), e.getMessage());
                e.printStackTrace();
            }
        }
    }

    public static void syncApiFromSqliteDb(RestRepository restRepo, SQLiteRepository sqliteRepo) {
        // implement later if needed
    }
}

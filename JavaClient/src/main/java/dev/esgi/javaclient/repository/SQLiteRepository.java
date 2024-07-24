package dev.esgi.javaclient.repository;

import dev.esgi.javaclient.model.*;
import dev.esgi.javaclient.rest.services.SQLiteService;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.StreamSupport;

@Component
public class SQLiteRepository implements Repository {

    private final Map<Class<?>, SQLiteService<?>> sqliteServiceMap = new HashMap<>();

    public SQLiteRepository(SQLiteService<Assignment> assignmentRepo,
                            SQLiteService<Member> memberRepo,
                            SQLiteService<Resource> resourceRepo,
                            SQLiteService<ResourceType> resourceTypeRepo,
                            SQLiteService<Task> taskRepo,
                            SQLiteService<TaskResource> taskResourceRepo) {
        sqliteServiceMap.put(Assignment.class, assignmentRepo);
        sqliteServiceMap.put(Member.class, memberRepo);
        sqliteServiceMap.put(Resource.class, resourceRepo);
        sqliteServiceMap.put(ResourceType.class, resourceTypeRepo);
        sqliteServiceMap.put(Task.class, taskRepo);
        sqliteServiceMap.put(TaskResource.class, taskResourceRepo);
    }

    public <T> void saveAll(T[] objects) {
        SQLiteService<T> sqLiteService = getSQLiteService(Arrays.stream(objects).findAny().orElseThrow().getClass());
        sqLiteService.saveAll(Arrays.asList(objects));
    }

    public <T> T save(T object) {
        SQLiteService<T> sqLiteService = getSQLiteService(object.getClass());
        return sqLiteService.save(object);
    }

    public <T> T[] getAll(Class<T> classType) {
        SQLiteService<T> sqLiteService = getSQLiteService(classType);
        return toArray(sqLiteService.findAll(), classType);
    }

    public <T> T getById(Class<T> classType, int id) {
        SQLiteService<T> sqLiteService = getSQLiteService(classType);
        return sqLiteService.findById(id).orElseThrow();
    }

    public <T> T delete(Class<T> classType, int id) {
        SQLiteService<T> sqLiteService = getSQLiteService(classType);
        T object = sqLiteService.findById(id).orElseThrow();
        sqLiteService.deleteById(id);
        return object;
    }

    @SuppressWarnings("unchecked")
    private <T> SQLiteService<T> getSQLiteService(Class<?> classType) {
        SQLiteService<?> sqLiteService = sqliteServiceMap.get(classType);
        if (sqLiteService == null) {
            throw new IllegalArgumentException("No SQLiteService available for " + classType.getName() + " class type");
        }
        return (SQLiteService<T>) sqLiteService;
    }

    @SuppressWarnings("unchecked")
    private <T> T[] toArray(Iterable<T> iterable, Class<T> classType) {
        return StreamSupport.stream(iterable.spliterator(),
                false
        ).toArray(size -> (T[]) java.lang.reflect.Array.newInstance(classType, size));
    }
}

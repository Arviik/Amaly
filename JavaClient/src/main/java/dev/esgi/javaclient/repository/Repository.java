package dev.esgi.javaclient.repository;

public interface Repository {

    <T> T save(T object);

    <T> T[] getAll(Class<T> classType);

    <T> T getById(Class<T> classType, int id);

    <T> T delete(Class<T> classType, int id);

}

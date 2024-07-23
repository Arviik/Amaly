package dev.esgi.javaclient.rest.services;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.Optional;

@NoRepositoryBean
public interface SQLiteService<T> extends CrudRepository<T, Integer> {

    Iterable<T> findAll();

    Optional<T> findById(Integer id);

    <S extends T> S save(S entity);

    void deleteById(Integer id);
}

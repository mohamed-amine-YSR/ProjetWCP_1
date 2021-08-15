package org.sid.projetservice.repository;

import org.sid.projetservice.model.Discipline;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

public interface DisciplineRepository extends ReactiveMongoRepository<Discipline, String> {
}

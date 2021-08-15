package org.sid.projetservice.repository;

import org.sid.projetservice.model.Membre;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface MembreRepository extends ReactiveMongoRepository<Membre, String> {
    Mono<Membre> findFirstByNom(String nom);
}

package org.sid.projetservice.repository;

import org.sid.projetservice.model.Centre;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface CentreRepository extends ReactiveMongoRepository<Centre, String> {

    Flux<Centre> findByIdCentreNotNull(Pageable pageable);
}

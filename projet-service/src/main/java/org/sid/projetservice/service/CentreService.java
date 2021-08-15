package org.sid.projetservice.service;

import org.sid.projetservice.model.Centre;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface CentreService {

    Flux<Centre> getAll();

    Mono<Centre> getCentreById(String idC);

    Mono<Centre> saveCentre(Centre centre);

    Mono<Centre> findCentreById(String id);

    Mono<Long> countAllCentres();

    Flux<Centre> getCentresByPage(Integer page, Integer size);
}

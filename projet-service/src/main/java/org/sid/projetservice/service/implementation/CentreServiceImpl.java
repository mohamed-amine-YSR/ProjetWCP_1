package org.sid.projetservice.service.implementation;

import org.sid.projetservice.model.Centre;
import org.sid.projetservice.repository.CentreRepository;
import org.sid.projetservice.service.CentreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CentreServiceImpl implements CentreService {
    @Autowired
    private CentreRepository centreRepository;

    @Override
    public Flux<Centre> getAll() {
        return centreRepository.findAll();
    }

    @Override
    public Mono<Centre> getCentreById(String idC) {
        return centreRepository.findById(idC);
    }

    @Override
    public Mono<Centre> saveCentre(Centre centre) {
        return centreRepository.save(centre);
    }

    @Override
    public Mono<Centre> findCentreById(String id) {
        return centreRepository.findById(id);
    }

    @Override
    public Mono<Long> countAllCentres() {
        return centreRepository.count();
    }

    @Override
    public Flux<Centre> getCentresByPage(Integer page, Integer size) {
        return centreRepository.findByIdCentreNotNull(PageRequest.of(page,size));
    }
}

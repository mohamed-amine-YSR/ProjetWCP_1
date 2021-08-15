package org.sid.projetservice.repository;

import org.sid.projetservice.model.Skill;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

import java.util.List;

public interface SkillRepository extends ReactiveMongoRepository<Skill, String> {
}

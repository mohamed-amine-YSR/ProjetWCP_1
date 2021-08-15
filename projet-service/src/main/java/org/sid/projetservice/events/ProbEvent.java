package org.sid.projetservice.events;

import org.springframework.context.ApplicationEvent;

public class ProbEvent extends ApplicationEvent {
    public ProbEvent(String source) {
        super(source);
    }
}

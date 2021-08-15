package org.sid.projetservice.events;

import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;
import reactor.core.publisher.FluxSink;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Executor;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.function.Consumer;

@Component
class ProbEventPublisher implements
        ApplicationListener<ProbEvent>,
        Consumer<FluxSink<ProbEvent>> {

    private final Executor executor;
    private final BlockingQueue<ProbEvent> queue =
            new LinkedBlockingQueue<>();

    ProbEventPublisher(Executor executor) {
        this.executor = executor;
    }


    @Override
    public void onApplicationEvent(ProbEvent event) {
        this.queue.offer(event);
    }

    @Override
    public void accept(FluxSink<ProbEvent> sink) {
        this.executor.execute(() -> {
            while (true)
                try {
                    ProbEvent event = queue.take();
                    sink.next(event);
                }
                catch (InterruptedException e) {
                    ReflectionUtils.rethrowRuntimeException(e);
                }
        });
    }
}

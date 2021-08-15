package org.sid.projetservice.controller;

import org.sid.projetservice.Security.JWTUtil;
import org.sid.projetservice.Security.PBKDF2Encoder;
import org.sid.projetservice.model.User;
import org.sid.projetservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.security.Principal;

@RestController
public class AuthenticationController {

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private PBKDF2Encoder passwordEncoder;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public Mono<ResponseEntity<?>> login(@RequestBody User user) {
        return userService.findByEmail(user.getUsername()).map((userDetails) -> {
            //System.out.printf(userDetails.toString()+"\n");
            //System.out.println(passwordEncoder.encode(user.getPassword()));
            if (passwordEncoder.encode(user.getPassword()).equals(userDetails.getPassword())) {
                return ResponseEntity.ok(jwtUtil.generateToken(userDetails));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        }).defaultIfEmpty(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @GetMapping("/validateToken")
    public Mono<ResponseEntity<?>> validateToken(ServerWebExchange swe) {
        ServerHttpRequest request = swe.getRequest();
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String authToken = authHeader.substring(7);
            try {
                if (jwtUtil.validateToken(authToken)) {
                    return Mono.just(ResponseEntity.ok("valid"));
                }
            } catch (Exception e) {
                return Mono.just(ResponseEntity.ok("not valid"));
            }
        }
        return Mono.just(ResponseEntity.ok("not valid"));
    }
}

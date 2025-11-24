package com.project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entities.Client;


public interface ClientRepository extends JpaRepository<Client, Long> {

	Optional<Client> findByUserId(Long userId);

}

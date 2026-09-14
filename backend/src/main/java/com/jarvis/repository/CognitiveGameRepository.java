package com.jarvis.repository;

import java.util.List;

import com.jarvis.entity.CognitiveGame;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CognitiveGameRepository extends JpaRepository<CognitiveGame, String> {
    List<CognitiveGame> findByActiveTrueOrderByNameAsc();
}


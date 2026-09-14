package com.jarvis.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "cognitive_games")
public class CognitiveGame extends BaseEntity {
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(length = 700)
    private String description;

    private int suggestedDifficulty = 2;
    private boolean active = true;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getSuggestedDifficulty() {
        return suggestedDifficulty;
    }

    public void setSuggestedDifficulty(int suggestedDifficulty) {
        this.suggestedDifficulty = suggestedDifficulty;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}


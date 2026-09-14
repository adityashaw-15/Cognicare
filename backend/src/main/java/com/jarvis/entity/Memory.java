package com.jarvis.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "memories")
public class Memory extends BaseEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private MemoryCategory category;

    private String personName;
    private String relationship;
    private String placeName;
    private String eventName;
    private String favoriteObject;
    private String favoriteFood;
    private String favoriteSong;
    private LocalDate importantDate;
    private String imageUrl;

    @Column(length = 1200)
    private String note;

    @Column(length = 700)
    private String promptSeed;

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public MemoryCategory getCategory() {
        return category;
    }

    public void setCategory(MemoryCategory category) {
        this.category = category;
    }

    public String getPersonName() {
        return personName;
    }

    public void setPersonName(String personName) {
        this.personName = personName;
    }

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public String getPlaceName() {
        return placeName;
    }

    public void setPlaceName(String placeName) {
        this.placeName = placeName;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getFavoriteObject() {
        return favoriteObject;
    }

    public void setFavoriteObject(String favoriteObject) {
        this.favoriteObject = favoriteObject;
    }

    public String getFavoriteFood() {
        return favoriteFood;
    }

    public void setFavoriteFood(String favoriteFood) {
        this.favoriteFood = favoriteFood;
    }

    public String getFavoriteSong() {
        return favoriteSong;
    }

    public void setFavoriteSong(String favoriteSong) {
        this.favoriteSong = favoriteSong;
    }

    public LocalDate getImportantDate() {
        return importantDate;
    }

    public void setImportantDate(LocalDate importantDate) {
        this.importantDate = importantDate;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getPromptSeed() {
        return promptSeed;
    }

    public void setPromptSeed(String promptSeed) {
        this.promptSeed = promptSeed;
    }
}


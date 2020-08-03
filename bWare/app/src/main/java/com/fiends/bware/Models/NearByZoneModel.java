package com.fiends.bware.Models;

import org.json.JSONArray;

public class NearByZoneModel {

    private String diseaseName;
    private String diseaseDiscription;
    private String startDate;
    private String distance;
    private String location;
    private String radius;

    private Boolean isRedZone;
    private JSONArray dataArray;

    public NearByZoneModel(String diseaseName, String diseaseDiscription, String startDate, String distance) {
        this.diseaseName = diseaseName;
        this.diseaseDiscription = diseaseDiscription;
        this.startDate = startDate;
        this.distance = distance;
    }

    public NearByZoneModel(String location, String radius) {
        this.location = location;
        this.radius = radius;
    }

    public NearByZoneModel(String location, String radius, Boolean isRedZone, JSONArray dataArray) {
        this.location = location;
        this.radius = radius;
        this.isRedZone = isRedZone;
        this.dataArray = dataArray;
    }

    public NearByZoneModel(String location, String radius, JSONArray dataArray) {
        this.location = location;
        this.radius = radius;
        this.dataArray = dataArray;
    }

    public JSONArray getDataArray() {
        return dataArray;
    }

    public void setDataArray(JSONArray dataArray) {
        this.dataArray = dataArray;
    }

    public Boolean getRedZone() {
        return isRedZone;
    }

    public void setRedZone(Boolean redZone) {
        isRedZone = redZone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getRadius() {
        return radius;
    }

    public void setRadius(String radius) {
        this.radius = radius;
    }

    public String getDiseaseName() {
        return diseaseName;
    }

    public void setDiseaseName(String diseaseName) {
        this.diseaseName = diseaseName;
    }

    public String getDiseaseDiscription() {
        return diseaseDiscription;
    }

    public void setDiseaseDiscription(String diseaseDiscription) {
        this.diseaseDiscription = diseaseDiscription;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getDistance() {
        return distance;
    }

    public void setDistance(String distance) {
        this.distance = distance;
    }

}

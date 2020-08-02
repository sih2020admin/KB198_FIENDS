package com.fiends.bware.Models;

import org.json.JSONArray;
import org.json.JSONObject;

public class NotificationModel {

    private Boolean redZone;
    private String title;
    private String body;
    private String date;
    private Boolean viewed;
    private String disease;
    private JSONArray oldValue;

    public NotificationModel(Boolean redZone, String title, String body, String date, Boolean viewed, String disease, JSONArray oldValue) {
        this.redZone = redZone;
        this.title = title;
        this.body = body;
        this.date = date;
        this.viewed = viewed;
        this.disease = disease;
        this.oldValue = oldValue;
    }

    public Boolean getRedZone() {
        return redZone;
    }

    public void setRedZone(Boolean redZone) {
        this.redZone = redZone;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Boolean getViewed() {
        return viewed;
    }

    public void setViewed(Boolean viewed) {
        this.viewed = viewed;
    }

    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }

    public JSONArray getOldValue() {
        return oldValue;
    }

    public void setOldValue(JSONArray oldValue) {
        this.oldValue = oldValue;
    }
}

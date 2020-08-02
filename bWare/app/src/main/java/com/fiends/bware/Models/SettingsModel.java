package com.fiends.bware.Models;

import android.graphics.drawable.Drawable;

public class SettingsModel {

    private String settingsName;
    private Drawable settingsImage;

    public SettingsModel(String settingsName, Drawable settingsImage) {
        this.settingsName = settingsName;
        this.settingsImage = settingsImage;
    }

    public String getSettingsName() {
        return settingsName;
    }

    public void setSettingsName(String settingsName) {
        this.settingsName = settingsName;
    }

    public Drawable getSettingsImage() {
        return settingsImage;
    }

    public void setSettingsImage(Drawable settingsImage) {
        this.settingsImage = settingsImage;
    }
}

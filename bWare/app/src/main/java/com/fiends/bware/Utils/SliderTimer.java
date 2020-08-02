package com.fiends.bware.Utils;

import android.app.Activity;

import androidx.viewpager.widget.ViewPager;

import com.fiends.bware.Models.NearByZoneModel;

import java.util.ArrayList;
import java.util.TimerTask;

public class SliderTimer extends TimerTask {

    private Activity activity;
    private ViewPager nearByZonePager;
    private ArrayList<NearByZoneModel> nearByZoneModels;

    public SliderTimer(Activity activity, ViewPager nearByZonePager, ArrayList<NearByZoneModel> nearByZoneModels) {
        this.activity = activity;
        this.nearByZonePager = nearByZonePager;
        this.nearByZoneModels = nearByZoneModels;
    }

    @Override
    public void run() {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (nearByZonePager.getCurrentItem() < nearByZoneModels.size()-1) {
                    nearByZonePager.setCurrentItem(nearByZonePager.getCurrentItem()+1);
                } else {
                    nearByZonePager.setCurrentItem(0);
                }
            }
        });
    }
}

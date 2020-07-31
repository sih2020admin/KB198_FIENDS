package com.fiends.bware.Utils;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class HaversineAlgorithm {

    private static final double eQuatorialEarthRadius = 6378.1370D;
    private static final double d2r = (Math.PI/180D);

    public boolean Notify(String locationS, String locationM, String radius) {
        double latitude1 = 0;
        double longitude1 = 0;
        double latitude2 = 0;
        double longitude2 = 0;
        int distance = 0;
        try {
            JSONArray jsonArray = new JSONArray(locationS);
            JSONArray jsonArray1 = new JSONArray(locationM);
            latitude1 = Double.parseDouble(jsonArray.get(0).toString());
            longitude1 = Double.parseDouble(jsonArray.get(1).toString());
            latitude2 = Double.parseDouble(jsonArray1.get(0).toString());
            longitude2 = Double.parseDouble(jsonArray1.get(1).toString());
            distance = (int) (1000D * KiloMeter(latitude1, longitude1, latitude2, longitude2));
            if (distance <= Integer.parseInt(radius)) {
                return true;
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return false;
    }

    private static double KiloMeter(double latitude1, double longitude1, double latitude2, double longitude2) {
        double dLong = (longitude2 - longitude1) * d2r;
        double dLat = (latitude2 - latitude1) * d2r;
        double a = Math.pow(Math.sin(dLat / 2D), 2D) + Math.cos(latitude1 * d2r) * Math.cos(latitude2 * d2r) * Math.pow(Math.sin(dLong / 2D), 2D);
        double c = 2D * Math.atan2(Math.sqrt(a), Math.sqrt(1D - a));
        double d = eQuatorialEarthRadius * c;
        return d;
    }

}

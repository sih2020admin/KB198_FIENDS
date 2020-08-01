package com.fiends.bware.Utils;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Handler;
import android.widget.Toast;


public class GetLocation implements LocationListener {

    private Activity activity;
    private String lat, lon;
    private LocationManager locationManager;
    private Response response;
    private Location location;
    private boolean checkGps;
    private Runnable runnable;

    public GetLocation(Activity activity, Response response) {
        this.activity = activity;
        this.response = response;
        getLastLocation();
    }

    public GetLocation(boolean checkGps, Activity activity, Response response) {
        this.activity = activity;
        this.response = response;
        this.checkGps = checkGps;
        getLastLocation();
    }

    public GetLocation(int distance, int time, Activity activity, Response response) {
        this.activity = activity;
        this.response = response;
        getLastLocation(distance, time);
    }

    public GetLocation(boolean checkGps, int distance, int time, Activity activity, Response response) {
        this.activity = activity;
        this.response = response;
        this.checkGps = checkGps;
        getLastLocation(distance, time);
    }

    @SuppressLint("MissingPermission")
    private void getLastLocation() {
        locationManager = (LocationManager) activity.getSystemService(Context.LOCATION_SERVICE);

        if (activity.checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && activity.checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        Criteria criteria = new Criteria();
        String provider = locationManager.getBestProvider(criteria, false);
        location = locationManager.getLastKnownLocation(provider);
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, this);
        onLocationChanged(location);
        locationManager.removeUpdates(this);
    }
    //  [77.2115047, 8.2157735]
    //  [77.20931215, 8.21837098]

    @SuppressLint("MissingPermission")
    private void getLastLocation(int distance, int time) {

        locationManager = (LocationManager) activity.getSystemService(Context.LOCATION_SERVICE);

        if (activity.checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && activity.checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        location = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);

        Location a = location;
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, distance, GetLocation.this);
        Toast.makeText(activity, a.distanceTo(location)+"", Toast.LENGTH_SHORT).show();
        onLocationChanged(location);
        locationManager.removeUpdates(GetLocation.this);

    }

    @Override
    public void onLocationChanged(Location location) {
        if (checkGps) {
            updateLocation(location);
        } else {
            if (Bware.checkLocation(activity)) {
                updateLocation(location);
            } else {
                Bware.turnGPSOn(activity);
            }
        }
    }

    private void updateLocation(Location location) {
        lat = String.valueOf(location.getLatitude());
        lon = String.valueOf(location.getLongitude());
        response.getLocation(lat, lon);
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {

    }

    @Override
    public void onProviderEnabled(String provider) {

    }

    @Override
    public void onProviderDisabled(String provider) {

    }

    public interface Response {
        void getLocation(String latitude, String longitude);
    }
}

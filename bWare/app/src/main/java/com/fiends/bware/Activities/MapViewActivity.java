package com.fiends.bware.Activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.FragmentTransaction;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;

import com.fiends.bware.Models.NearByZoneModel;
import com.fiends.bware.Overrides.ServerResponse;
import com.fiends.bware.R;
import com.fiends.bware.Utils.GetLocation;
import com.fiends.bware.Utils.HaversineAlgorithm;
import com.fiends.bware.Utils.ServerRequest;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.Circle;
import com.google.android.gms.maps.model.CircleOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MapStyleOptions;
import com.google.android.gms.maps.model.MarkerOptions;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;

import im.delight.android.location.SimpleLocation;

public class MapViewActivity extends AppCompatActivity implements OnMapReadyCallback, ServerResponse {

    private GoogleMap mMap;
    private Handler handler;
    private Runnable runnable;
    private View fullScreen;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_map_view);

        fullScreen = findViewById(R.id.full_screen);
        fullScreen.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                        View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR |
                        View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
                        View.SYSTEM_UI_FLAG_FULLSCREEN
        );
        initMap(savedInstanceState);

        handler = new Handler();
        runnable = new Runnable() {
            @Override
            public void run() {
                new GetLocation(MapViewActivity.this, new GetLocation.Response() {
                    @Override
                    public void getLocation(String latitude, String longitude) {
                        String location = "[" + longitude + ", " + latitude + "]";
                        new ServerRequest(MapViewActivity.this).setUrl(getString(R.string.GetRedZone) + "/" + location, MapViewActivity.this).getRedZone("activeOutrages");
                    }
                });
                handler.postDelayed(runnable, 30000);
            }
        };

        runnable.run();

    }

    private void initMap(Bundle savedInstanceState) {

        SupportMapFragment mapFragment = SupportMapFragment.newInstance();
        if (savedInstanceState == null) {
            final FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
            transaction.add(R.id.map_full_screen, mapFragment);
            transaction.commit();
        } else {
            mapFragment = (SupportMapFragment) getSupportFragmentManager()
                    .findFragmentById(R.id.map_full_screen);
        }

        if (mapFragment != null) {
            mapFragment.getMapAsync(this);
        }
    }

    @Override
    public void NearByZoneResponse(boolean success, ArrayList<NearByZoneModel> nearByZoneModels) {

    }

    @Override
    public void RedZone(boolean success, ArrayList<NearByZoneModel> nearByZoneModels, ArrayList<NearByZoneModel> redZoneLocationModel) {
        setUpMapLayer(redZoneLocationModel);
    }

    @Override
    public void MapResponse(boolean success, ArrayList<NearByZoneModel> redZoneLocationModel) {

    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        mMap.setMapStyle(MapStyleOptions.loadRawResourceStyle(this, R.raw.dark_map));
    }

    @Override
    public void DiseaseCount(String state, String district, String place) {

    }

    @Override
    public void DiseaseClick(String diseaseName, String sDate) {

    }

    @SuppressLint("MissingPermission")
    private void setUpMapLayer(ArrayList<NearByZoneModel> redZoneLocationModel) {

        mMap.clear();
        int StrokeColor = Color.argb(100, 255, 0, 0);
        int FillColor = Color.argb(30, 255, 0, 0);
        for (int i = 0; i < redZoneLocationModel.size(); i++) {

            try {
                JSONArray jsonArray = new JSONArray(redZoneLocationModel.get(i).getLocation());
                mMap.addCircle(new CircleOptions()
                        .center(new LatLng(Double.parseDouble(jsonArray.get(1).toString()), Double.parseDouble(jsonArray.get(0).toString())))
                        .radius(Integer.parseInt(redZoneLocationModel.get(i).getRadius()))
                        .strokeWidth(1)
                        .strokeColor(StrokeColor)
                        .fillColor(FillColor)
                        .clickable(true)).setTag(redZoneLocationModel.get(i).getRadius());
                mMap.addCircle(new CircleOptions()
                        .center(new LatLng(Double.parseDouble(jsonArray.get(1).toString()), Double.parseDouble(jsonArray.get(0).toString())))
                        .radius(Integer.parseInt(redZoneLocationModel.get(i).getRadius())/20)
                        .strokeWidth(1)
                        .fillColor(Color.RED));
                mMap.setOnCircleClickListener(new GoogleMap.OnCircleClickListener() {
                    @Override
                    public void onCircleClick(Circle circle) {
                        mMap.addMarker(
                                new MarkerOptions()
                                        .alpha(0.0f)
                                        .position(circle.getCenter())
                                        .title("Radius : " + circle.getTag().toString() + " M")
                                        .snippet("Latitude: " + circle.getCenter().latitude + "    Longitude : " + circle.getCenter().longitude))
                                .showInfoWindow();

                    }
                });
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        SimpleLocation location = new SimpleLocation(this);
        mMap.setMyLocationEnabled(true);
        mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(location.getLatitude(), location.getLongitude()), 14.0f));
    }

    @Override
    public void onBackPressed() {
        startActivity(new Intent(MapViewActivity.this, DashBoardActivity.class));
        finish();
    }
}
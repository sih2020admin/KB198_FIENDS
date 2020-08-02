package com.fiends.bware.Services;

import android.app.Activity;
import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.graphics.Color;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.fiends.bware.Activities.DashBoardActivity;
import com.fiends.bware.Activities.MapViewActivity;
import com.fiends.bware.Activities.NotificationActivity;
import com.fiends.bware.Activities.NotifyMessageActivity;
import com.fiends.bware.Models.NearByZoneModel;
import com.fiends.bware.Overrides.ServerResponse;
import com.fiends.bware.R;
import com.fiends.bware.Utils.BwareFiles;
import com.fiends.bware.Utils.GetLocation;
import com.fiends.bware.Utils.HaversineAlgorithm;
import com.fiends.bware.Utils.ServerRequest;
import com.google.android.gms.maps.GoogleMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.time.Instant;
import java.util.ArrayList;

import im.delight.android.location.SimpleLocation;

import static com.fiends.bware.App.CHANNEL_ID;
import static com.fiends.bware.Utils.Bware.CIRCLE_LAYER_ID;
import static com.fiends.bware.Utils.Bware.DISTANCE;
import static com.fiends.bware.Utils.Bware.RED_ZONE_LAYER_ID;
import static com.fiends.bware.Utils.Bware.RED_ZONE_LAYER_SOURCE;
import static com.fiends.bware.Utils.Bware.RED_ZONE_SOURCE_ID;
import static com.fiends.bware.Utils.Bware.TIME;


public class LocationService extends Service {

    public static final String ACTION_STOP_LOCATION_SERVICE = "ACTION_STOP_LOCATION_SERVICE";
    public static Boolean isRunning = false;

    public static Activity LSactivity;
    private String token;


    @Override
    public void onCreate() {
        super.onCreate();
        token = new BwareFiles(LSactivity).readData("User Token");
        runnable.run();
        mHandlerTask.run();
    }

    Handler mHandler = new Handler();
    Handler handler = new Handler();
    Runnable mHandlerTask = new Runnable() {
        @Override
        public void run() {
            if (!isRunning) {
                startListening();
            }
            mHandler.postDelayed(mHandlerTask, 60000);
        }
    };
    Runnable runnable = new Runnable() {
        @Override
        public void run() {
            if (!isRunning) {

                SimpleLocation locations = new SimpleLocation(LSactivity);
                JSONArray location = new JSONArray();
                try {
                    location.put(locations.getLongitude());
                    location.put(locations.getLatitude());
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                JSONObject jsonLocation = new JSONObject();
                try {
                    jsonLocation.put("location", location);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                new ServerRequest(LSactivity).setUrl(getString(R.string.SendAddress)).sendLocation(jsonLocation, token);
            }
            handler.postDelayed(runnable, 30000);
        }
    };

    private void startListening() {
        JSONObject jsonObject = new JSONObject();
        JSONArray jsonArray = new JSONArray();

        BwareFiles bwareFiles = new BwareFiles(LSactivity);

        new GetLocation(LSactivity, new GetLocation.Response() {
            @Override
            public void getLocation(String latitude, String longitude) {

                Instant instant = null;
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                    instant = Instant.now();
                }

                try {
                    jsonObject.put("TIME", instant.toString());
                    jsonArray.put(longitude);
                    jsonArray.put(latitude);
                    jsonObject.put("LOCATION", jsonArray);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                String locationM = "[" + longitude + ", " + latitude + "]";
                new ServerRequest(LSactivity).setUrl(getString(R.string.GetRedZone) + "/" + locationM, new ServerResponse() {
                    @Override
                    public void NearByZoneResponse(boolean success, ArrayList<NearByZoneModel> nearByZoneModels) {

                    }

                    @Override
                    public void RedZone(boolean success, ArrayList<NearByZoneModel> nearByZoneModels, ArrayList<NearByZoneModel> redZoneLocationModel) {

                        if (success) {
                            for (int i = 0; i < redZoneLocationModel.size(); i++) {
                                HaversineAlgorithm haversineAlgorithm = new HaversineAlgorithm();
                                if (haversineAlgorithm.Notify(redZoneLocationModel.get(i).getLocation(), locationM, redZoneLocationModel.get(i).getRadius())) {
                                    showNotification("You're in Red Zone", String.valueOf("Total Red Zone Count : " + redZoneLocationModel.size()), Color.rgb(200, 0, 0));
                                    break;
                                }
                            }
                            if (redZoneLocationModel.size() == 0) {
                                showNotification("You're Safe Now", String.valueOf("Total Red Zone Count : " + redZoneLocationModel.size()), Color.rgb(0, 200, 0));
                            }
                        } else {
                            showNotification("Wait for the status to update", "Red Zone Status", Color.rgb(95, 41, 103));
                        }
                    }

                    @Override
                    public void MapResponse(boolean success, ArrayList<NearByZoneModel> redZoneLocationModel) {

                    }

                    @Override
                    public void onMapReady(GoogleMap googleMap) {

                    }

                    @Override
                    public void DiseaseCount(String state, String district, String place) {

                    }

                    @Override
                    public void DiseaseClick(String diseaseName, String sDate) {

                    }
                }).getRedZone("activeOutrages");
            }
        });

        if (bwareFiles.getFileLength("LocationUpdates")) {
            bwareFiles.updateData("LocationUpdates", "," + jsonObject);
        } else {
            bwareFiles.saveData("LocationUpdates", String.valueOf(jsonObject));
        }
        showNotification("Wait for the status to update", "Red Zone Status", Color.rgb(95, 41, 103));
    }

    private void showNotification(String message, String count, int color) {
        Intent notificationIntent = new Intent(LocationService.this, MapViewActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(LocationService.this,
                0, notificationIntent, 0);
        Notification notification = new NotificationCompat.Builder(LocationService.this, CHANNEL_ID)
                .setContentTitle(count)
                .setContentText(message)
                .setSmallIcon(R.drawable.ic_notification_icon)
                .setColorized(true)
                .setFullScreenIntent(pendingIntent, true)
                .setColor(color)
                .build();

        startForeground(1, notification);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        if (intent != null) {
            String action = intent.getAction();
            if (action.equals(ACTION_STOP_LOCATION_SERVICE)) {
                stopForeground(true);
                stopSelf();
            }
        }
        return START_NOT_STICKY;
    }

    @Override
    public void onDestroy() {
        mHandler.removeCallbacks(mHandlerTask);
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}

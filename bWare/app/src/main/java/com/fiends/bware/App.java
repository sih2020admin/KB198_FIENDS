package com.fiends.bware;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import android.text.TextUtils;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.Volley;
import com.google.firebase.messaging.FirebaseMessaging;

import java.io.File;

public class App extends Application {

    private File file;
    public static final String CHANNEL_ID = "LocationServiceChannel";
    public static final String TAG = "VolleyPatterns";

    private RequestQueue requestQueue;
    public static App Instance;

    @Override
    public void onCreate() {
        super.onCreate();
        Instance = this;
        createNotificationChannel();
        createBgNotificationChannel();
        file = new File(this.getExternalFilesDir("/").toString(),"Data/");
        if (!file.exists()) {
            file.mkdirs();
        }
    }

    private void createNotificationChannel() {

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel("BwareAlert", "BwareAlert", NotificationManager.IMPORTANCE_HIGH);
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(channel);
        }
    }

    private void createBgNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Location Service Channel",
                    NotificationManager.IMPORTANCE_LOW
            );

            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(serviceChannel);
        }
    }

    public static synchronized App getInstance() {
        return Instance;
    }

    public RequestQueue getRequestQueue() {

        if (requestQueue == null) {
            requestQueue = Volley.newRequestQueue(getApplicationContext());
        }
        return requestQueue;
    }

    public <T> void addToRequestQueue(Request<T> request, String tag) {

        request.setTag(TextUtils.isEmpty(tag) ? TAG : tag);
        VolleyLog.d("Adding request to queue : %s", request.getUrl());
        getRequestQueue().add(request);
    }

    public <T> void addToRequestQueue(Request<T> request) {

        request.setTag(TAG);
        getRequestQueue().add(request);
    }

    public <T> void cancelPendingRequests(Object tag) {
        if (requestQueue != null) {
            requestQueue.cancelAll(tag);
        }
    }

}

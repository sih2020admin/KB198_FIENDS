package com.fiends.bware.Services;

import android.app.PendingIntent;
import android.content.Intent;
import android.graphics.Color;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.fiends.bware.Activities.NotificationActivity;
import com.fiends.bware.Activities.NotifyMessageActivity;
import com.fiends.bware.R;
import com.fiends.bware.Utils.Bware;
import com.fiends.bware.Utils.BwareFiles;
import com.fiends.bware.Utils.HaversineAlgorithm;
import com.fiends.bware.Utils.ServerRequest;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.util.Calendar;


public class MyFirebaseMessagingService extends FirebaseMessagingService {

    @Override
    public void onNewToken(@NonNull String s) {
        File path = new File(this.getExternalFilesDir("/").toString(),"Data/FCMToken.txt");
        String token = "";
        if (path.length() > 0) {
            try {
                BufferedReader bufferedReader = new BufferedReader(new FileReader(path));
                String line;
                while ((line = bufferedReader.readLine()) != null) {
                    token += line;
                }
                bufferedReader.close();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            try {
                FileOutputStream stream = new FileOutputStream(path);
                stream.write(s.getBytes());
                stream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {

<<<<<<< HEAD
=======
        Log.i("WORKINGAK","gddsye");
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
        final Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DAY_OF_MONTH);

        JSONObject notification = null;
        BwareFiles files = new BwareFiles(this);
        try {
            notification = new JSONObject(remoteMessage.getData().toString());
            notification.put("viewed","false");
            notification.put("date",year + "-" + ++month + "-" + day);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        Log.i("Notification 0",remoteMessage.getData().toString());
        if (! Boolean.parseBoolean(remoteMessage.getData().get("flag"))) {

            try {
                notification.put("redzone","false");
            } catch (JSONException e) {
                e.printStackTrace();
            }
            if (files.getJSONFileLength("Notification")) {
                files.updateJSONData("Notification", "," + notification.toString());
            } else {
                files.updateJSONData("Notification", notification.toString());
            }
            JSONObject object = null;
            try {
                object = new JSONObject(remoteMessage.getData().get("obj"));
                Log.i("Notification 1",object.toString());
                Intent notificationIntent = new Intent(MyFirebaseMessagingService.this, NotificationActivity.class);
                PendingIntent pendingIntent = PendingIntent.getActivity(MyFirebaseMessagingService.this,
                        0, notificationIntent, 0);
                shoeNotification(object.getString("title"), object.getString("description"),Color.rgb(3, 218, 197), pendingIntent);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        } else {

            Log.i("Notification 2","Notified");
            String token = "";
            File path = new File(this.getExternalFilesDir("/").toString(),"Data/LocationUpdates.txt");
            try {
                BufferedReader bufferedReader = new BufferedReader(new FileReader(path));
                String line;
                while ((line = bufferedReader.readLine()) != null) {
                    token += line;
                }
                bufferedReader.close();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }

            try {
                final String data =  token;
                JSONArray jsonArray = new JSONArray("["+data+"]");
                JSONObject object = new JSONObject(remoteMessage.getData().get("obj"));

                String location = object.getString("location");
                String startDate = Bware.getDate(object.getString("startDate"));
                String endDate = Bware.getDate(object.getString("endDate"));
                String radius = object.getString("alertRadius");

                for (int i=0; i<jsonArray.length(); i++) {
                    JSONObject jsonObject = new JSONObject(jsonArray.get(i).toString());
                    String locationS = jsonObject.getString("LOCATION");
                    String date = Bware.getDate(jsonObject.getString("TIME"));

                    HaversineAlgorithm haversineAlgorithm = new HaversineAlgorithm();
                    if (haversineAlgorithm.Notify(locationS, location, radius)) {
                        if (Bware.compareDate(startDate, endDate, date)) {
                            try {
                                notification.put("redzone","true");
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                            if (files.getJSONFileLength("Notification")) {
                                files.updateJSONData("Notification", "," + notification.toString());
                            } else {
                                files.updateJSONData("Notification", notification.toString());
                            }
                            Intent notificationIntent = new Intent(MyFirebaseMessagingService.this, NotificationActivity.class);
                            PendingIntent pendingIntent = PendingIntent.getActivity(MyFirebaseMessagingService.this,
                                    0, notificationIntent, 0);
                            shoeNotification(object.getString("title"), object.getString("description"),Color.RED, pendingIntent);
                            break;
                        }
                    }

                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void shoeNotification(String title, String message, int colour, PendingIntent pendingIntent) {

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, "BwareAlert")
                .setContentTitle(title)
                .setSmallIcon(R.drawable.ic_notification_icon)
                .setColorized(true)
                .setAutoCancel(false)
                .setColor(colour)
                .setContentText(message)
                .setContentIntent(pendingIntent);

        NotificationManagerCompat managerCompat = NotificationManagerCompat.from(this);
        managerCompat.notify(999, builder.build());

    }

}

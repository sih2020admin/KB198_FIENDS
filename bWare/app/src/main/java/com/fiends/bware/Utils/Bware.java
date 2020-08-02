package com.fiends.bware.Utils;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentSender;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.location.LocationManager;
import android.os.Build;
import android.util.Log;
import android.widget.ProgressBar;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AlertDialog;

import com.fiends.bware.R;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.Result;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsStatusCodes;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

public class Bware {
    public static final String[] permission = new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.READ_SMS, Manifest.permission.READ_PHONE_NUMBERS};
    public static final int PERMISSION_CODE = 100;
    public static final int TIME = 1;
    public static final int DISTANCE = 5;
    public static final String RED_ZONE_SOURCE_ID = "RED_ZONE_SOURCE_ID";
    public static final String RED_ZONE_LAYER_ID = "RED_ZONE_LAYER_ID";
    public static final String CIRCLE_LAYER_ID = "CIRCLE_LAYER_ID";
    public static final String RED_ZONE_LAYER_SOURCE = "RED_ZONE_LAYER_SOURCE";

    public static final Drawable editTextError(Activity activity) {

        Drawable errorIcon = activity.getResources().getDrawable(R.drawable.edit_text_error_icon);
        errorIcon.setBounds(0, 0, errorIcon.getIntrinsicWidth(), errorIcon.getIntrinsicHeight());
        return errorIcon;
    }

    public static final void setProgressColour(int progress, ProgressBar DiseaseProgress) {
        int clr = progress/4;
        if (clr == 0) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(16,255,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(16,255,0)));
        } else if (clr == 1) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(32,255,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(32,255,0)));
        } else if (clr == 2) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(48,255,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(48,255,0)));
        } else if (clr == 3) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(64,255,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(64,255,0)));
        } else if (clr == 4) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(96,255,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(96,255,0)));
        } else if (clr == 5) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(112,255,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(112,255,0)));
        } else if (clr == 6) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(128,255,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(128,255,0)));
        } else if (clr == 7) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(160,255,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(160,255,0)));
        } else if (clr == 8) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(176,255,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(176,255,0)));
        } else if (clr == 9) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(192,255,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(192,255,0)));
        } else if (clr == 10) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(224,255,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(224,255,0)));
        } else if (clr == 11) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(240,255,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(240,255,0)));
        } else if (clr == 12) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(255,255,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(255,255,0)));
        } else if (clr == 13) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(255,224,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(255,224,0)));
        } else if (clr == 14) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(255,208,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(255,208,0)));
        } else if (clr == 15) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(255,192,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(255,192,0)));
        } else if (clr == 16) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(255,160,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(255,160,0)));
        } else if (clr == 17) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(255,144,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(255,144,0)));
        } else if (clr == 18) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(255,128,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(255,128,0)));
        } else if (clr == 19) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(255,96,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(255,96,0)));
        } else if (clr == 20) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(255,80,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(255,80,0)));
        } else if (clr == 21) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(255,64,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(255,64,0)));
        } else if (clr == 22) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(255,32,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(255,32,0)));
        } else if (clr == 23) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(255,16,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(255,16,0)));
        } else if (clr == 24) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(255,0,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(255,0,0)));
        } else if (clr == 25) {
            DiseaseProgress.setProgressTintList(ColorStateList.valueOf(Color.rgb(255,0,0)));
            DiseaseProgress.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(255,0,0)));
        }
    }

    public static final boolean checkLocation(Activity activity) {

        LocationManager locationManager = (LocationManager) activity.getSystemService(Context.LOCATION_SERVICE);
        if ((locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) && (locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER))) {
            return true;
        } else {
            return false;
        }
    }

    public static final boolean compareDate(String StartDate, String EndDate, String compare) {

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            LocalDate localDate = LocalDate.parse(StartDate);
            LocalDate localDate1 = LocalDate.parse(EndDate);
            List<LocalDate> localDates = new ArrayList<>();
            while (!localDate.isAfter(localDate1)) {
                localDates.add(localDate);
                localDate = localDate.plusDays(1);
            }

            for (int i=0; i<localDates.size(); i++) {
                if (localDates.get(i).toString().equals(compare)) {
                    return true;
                }
            }
        }
        return false;
    }

    public static final String getDate(String startDate) {
        //"startDate":"2020-07-16T18:30:00.000Z"
        String string = "";
        for (int i=0; i<startDate.length(); i++) {
            String ch = String.valueOf(startDate.charAt(i));
            if (ch.equals("T")) {
                break;
            } else {
                string += ch;
            }
        }
        return string;
    }

    public static final Long getTime(String startDate) {
        //"startDate":"2020-07-16T18:30:00.000Z"
        String string = "";
        for (int i=0; i<startDate.length(); i++) {
            String ch = String.valueOf(startDate.charAt(i));
            if (i >= 11 && i<=18) {
                string += ch;
            }
        }
        long hrs = Long.parseLong(String.valueOf(string.charAt(0)+string.charAt(1)));
        long min = Long.parseLong(String.valueOf(string.charAt(3)+string.charAt(4)));
        long sec = Long.parseLong(String.valueOf(string.charAt(6)+string.charAt(7)));
        long milliSeconds =  TimeUnit.HOURS.toMillis(hrs) +
                TimeUnit.MINUTES.toMillis(min) +
                TimeUnit.SECONDS.toMillis(sec);
        return milliSeconds;
    }

    public static final Long checkDifference(Long time1, Long time2) {
        if (time1 >= time2) {
            return TimeUnit.MILLISECONDS.toHours(time1 - time2);
        } else {
            return TimeUnit.MILLISECONDS.toHours(time2 - time1);
        }
    }

    public static final void turnGPSOn(final Activity activity) {
        GoogleApiClient googleApiClient;
        googleApiClient = new GoogleApiClient.Builder(activity.getApplicationContext())
                .addApi(LocationServices.API).build();
        googleApiClient.connect();

        LocationRequest locationRequest = LocationRequest.create();
        locationRequest.setPriority(LocationRequest.PRIORITY_BALANCED_POWER_ACCURACY);
        locationRequest.setInterval(30*1000);
        locationRequest.setFastestInterval(5*1000);
        LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder()
                .addLocationRequest(locationRequest);

        builder.setAlwaysShow(true);

        PendingResult result = LocationServices.SettingsApi
                .checkLocationSettings(googleApiClient, builder.build());
        result.setResultCallback(new ResultCallback() {
            @Override
            public void onResult(@NonNull Result result) {
                final Status status = result.getStatus();

                switch (status.getStatusCode()) {
                    case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
                        try {
                            status.startResolutionForResult(activity, 1000);
                        } catch (IntentSender.SendIntentException e) {

                        }
                        break;
                    case LocationSettingsStatusCodes.SUCCESS:
                        Log.e("SUCCESS : ","SUCCESS");
                        break;
                    case LocationSettingsStatusCodes.SETTINGS_CHANGE_UNAVAILABLE:
                        Log.e("FAILED : ","FAILED");
                        break;
                }
            }
        });
    }

    public static final void showAppExitDialog(Activity activity){

        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setTitle("Please confirm");
        builder.setMessage("Do you want to exit the app?");
        builder.setCancelable(true);

        builder.setPositiveButton("Yes(exit)", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {

                Intent intent = new Intent(Intent.ACTION_MAIN);
                intent.addCategory(Intent.CATEGORY_HOME);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                activity.startActivity(intent);
                activity.finish();
            }
        });

        builder.setNegativeButton("No", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {

            }
        });

        AlertDialog dialog = builder.create();
        dialog.show();
    }
}

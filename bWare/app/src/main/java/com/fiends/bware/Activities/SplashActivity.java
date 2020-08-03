package com.fiends.bware.Activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.animation.Animator;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import com.airbnb.lottie.LottieAnimationView;
import com.fiends.bware.R;
import com.fiends.bware.Utils.Bware;
import com.fiends.bware.Utils.BwareFiles;
import com.fiends.bware.Utils.GetLocation;
import com.fiends.bware.Utils.HaversineAlgorithm;
import com.fiends.bware.Utils.ServerRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

import im.delight.android.location.SimpleLocation;

<<<<<<< HEAD
=======
import static com.fiends.bware.Utils.Bware.showAppExitDialog;

>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
public class SplashActivity extends AppCompatActivity {

    private LottieAnimationView animationView;
    private Button button;
    private LinearLayout Message;
    private SimpleLocation simpleLocation;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        JSONObject jsonObject = new JSONObject();
        String token = new BwareFiles(this).readData("User Token");;
        try {
            jsonObject.put("fcmRegToken",new BwareFiles(this).readData("FCMToken"));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        new ServerRequest(this).setUrl(getString(R.string.SendAddress))
                .sendLocation(jsonObject, token);

        animationView = findViewById(R.id.splash_animation);
        Message = findViewById(R.id.network_message);
        button = findViewById(R.id.retry_btn);
        simpleLocation = new SimpleLocation(this);
        if (simpleLocation.hasLocationEnabled()) {
            changeActivity();
        } else {
            SimpleLocation.openSettings(this);
        }
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                changeActivity();
            }
        });
        animationView.addAnimatorListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animation) {

            }

            @Override
            public void onAnimationEnd(Animator animation) {
                try {
                    if (checkPermission()) {
                        startActivity(new Intent(SplashActivity.this, PermissionActivity.class));
                        finish();
                    } else if (isLoggedIn()) {
                        startActivity(new Intent(SplashActivity.this, DashBoardActivity.class));
                        finish();
                    } else {
                        startActivity(new Intent(SplashActivity.this, RegisterActivity.class));
                        finish();
                    }
                } catch (Exception e) {
                    Log.e("SPLASH_SCREEN", Objects.requireNonNull(e.getMessage()));
                }
            }

            @Override
            public void onAnimationCancel(Animator animation) {

            }

            @Override
            public void onAnimationRepeat(Animator animation) {

            }
        });

    }

    private boolean checkPermission() {
        if (ContextCompat.checkSelfPermission(SplashActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return true;
        }
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.READ_SMS) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.READ_PHONE_NUMBERS) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
            return true;
        }
        return false;
    }

    private boolean isLoggedIn() {
        return new BwareFiles(SplashActivity.this).getFileLength("User Token");
    }

    @SuppressLint("MissingPermission")
    private boolean isNetworkConnected() {

        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        return connectivityManager.getActiveNetwork() != null && connectivityManager.getActiveNetworkInfo().isConnected();
    }

    private void changeActivity() {

        if (isNetworkConnected()) {
            animationView.setVisibility(View.VISIBLE);
            Message.setVisibility(View.INVISIBLE);
            animationView.playAnimation();
        } else {
            animationView.setVisibility(View.INVISIBLE);
            Message.setVisibility(View.VISIBLE);
            animationView.cancelAnimation();
        }
    }

    @Override
<<<<<<< HEAD
    protected void onResume() {
=======
    protected void onStart() {
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
        if (simpleLocation.hasLocationEnabled()) {
            changeActivity();
        } else {
            SimpleLocation.openSettings(this);
        }
<<<<<<< HEAD
        super.onResume();
=======
        super.onStart();
    }

    @Override
    public void onBackPressed() {
        showAppExitDialog(SplashActivity.this);
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
    }
}
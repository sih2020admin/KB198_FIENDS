package com.fiends.bware.Activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.NavigationUI;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.fiends.bware.R;
import com.fiends.bware.Services.LocationService;
import com.fiends.bware.Utils.Bware;
import com.fiends.bware.Utils.ServerRequest;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import im.delight.android.location.SimpleLocation;

import static com.fiends.bware.Services.LocationService.LSactivity;
import static com.fiends.bware.Utils.Bware.showAppExitDialog;

public class DashBoardActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        LSactivity = DashBoardActivity.this;
        ContextCompat.startForegroundService(this, new Intent(this, LocationService.class));
        setContentView(R.layout.activity_dash_board);
        BottomNavigationView navView = findViewById(R.id.nav_view);
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment);
        NavigationUI.setupWithNavController(navView, navController);

    }

    @Override
    public void onBackPressed() {
        showAppExitDialog(DashBoardActivity.this);
    }
}
package com.fiends.bware.Activities;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import com.fiends.bware.R;
import com.fiends.bware.Utils.Bware;
import com.fiends.bware.Utils.BwareFiles;

public class PermissionActivity extends AppCompatActivity {

    private Button appPermission;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_permission);

        appPermission = findViewById(R.id.app_permission_btn);

        appPermission.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ActivityCompat.requestPermissions(PermissionActivity.this, Bware.permission, Bware.PERMISSION_CODE);
            }
        });

    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (grantResults[0]==0 && grantResults[1]==0 && grantResults[2]==0) {
                if (isLoggedIn()) {
                    startActivity(new Intent(PermissionActivity.this, DashBoardActivity.class));
                    finish();
                } else {
                    startActivity(new Intent(PermissionActivity.this, RegisterActivity.class));
                    finish();
                }
            }
        } else {
            if (grantResults[0]==0 && grantResults[1]==0 || grantResults[2]==0) {
                if (isLoggedIn()) {
                    startActivity(new Intent(PermissionActivity.this, DashBoardActivity.class));
                    finish();
                } else {
                    startActivity(new Intent(PermissionActivity.this, RegisterActivity.class));
                    finish();
                }
            }
        }
    }

    private boolean isLoggedIn() {
        return new BwareFiles(PermissionActivity.this).getFileLength("User Token");
    }

}
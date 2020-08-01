package com.fiends.bware.Activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

import com.fiends.bware.R;
import com.fiends.bware.Utils.BwareFiles;

import org.json.JSONException;
import org.json.JSONObject;

public class NotifyMessageActivity extends AppCompatActivity {

    private TextView messageTitle;
    private TextView messageBody;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_notify_message);

        messageTitle = findViewById(R.id.message_title);
        messageBody = findViewById(R.id.message_body);

        messageTitle.setText(getIntent().getExtras().getString("TITLE"));
        messageBody.setText(getIntent().getExtras().getString("BODY"));
    }

    @Override
    public void onBackPressed() {
        startActivity(new Intent(NotifyMessageActivity.this, DashBoardActivity.class));
        finish();
    }
}
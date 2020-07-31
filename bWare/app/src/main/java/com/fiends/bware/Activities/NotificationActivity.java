package com.fiends.bware.Activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.fiends.bware.Adapters.NotificationAdapter;
import com.fiends.bware.Models.NotificationModel;
import com.fiends.bware.R;
import com.fiends.bware.Utils.BwareFiles;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class NotificationActivity extends AppCompatActivity {

    private RecyclerView notificationRecyclerView;
    private NotificationAdapter notificationAdapter;
    private ArrayList<NotificationModel> notificationModels;
    private BwareFiles files;
    private JSONArray jsonArray;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_notification);

        notificationRecyclerView = findViewById(R.id.notification_recycler_view);
        init();

    }

    @Override
    protected void onRestart() {
        super.onRestart();
        init();
    }

    @Override
    protected void onResume() {
        super.onResume();
        init();
    }

    private void init() {
        files = new BwareFiles(NotificationActivity.this);
        notificationModels = new ArrayList<>();
        try {
            System.out.println(files.readJSONData("Notification"));
            jsonArray = new JSONArray("[" + files.readJSONData("Notification") + "]");
            Log.i("NITHIN_AASHIK", "[" + files.readJSONData("Notification") + "]");
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonObject = new JSONObject(jsonArray.get(i).toString());
                JSONObject object = new JSONObject(jsonObject.getString("obj"));
                notificationModels.add(new NotificationModel(Boolean.parseBoolean(jsonObject.getString("redzone")),
                        object.getString("title"),
                        object.getString("description"),
                        jsonObject.getString("date"),
                        Boolean.parseBoolean(jsonObject.getString("viewed")),
                        object.getString("disease"),
                        jsonArray));
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        notificationAdapter = new NotificationAdapter(notificationModels, NotificationActivity.this);
        notificationRecyclerView.setLayoutManager(new GridLayoutManager(NotificationActivity.this, 1, GridLayoutManager.VERTICAL, false));
        notificationRecyclerView.setAdapter(notificationAdapter);
    }

    @Override
    public void onBackPressed() {
        startActivity(new Intent(NotificationActivity.this, DashBoardActivity.class));
        finish();
    }
}
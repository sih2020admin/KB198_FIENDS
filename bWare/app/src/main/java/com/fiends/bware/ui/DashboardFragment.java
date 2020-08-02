package com.fiends.bware.ui;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.fiends.bware.Activities.DashBoardActivity;
import com.fiends.bware.Activities.SplashActivity;
import com.fiends.bware.Adapters.NotificationAdapter;
import com.fiends.bware.Adapters.SettingsAdapter;
import com.fiends.bware.Models.NotificationModel;
import com.fiends.bware.Models.SettingsModel;
import com.fiends.bware.R;
import com.fiends.bware.Utils.BwareFiles;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import static com.fiends.bware.Utils.Bware.showLogOutDialog;


public class DashboardFragment extends Fragment {

    private RecyclerView settingsRecyclerView;
    private SettingsAdapter settingsAdapter;
    private ArrayList<SettingsModel> settingsModels = new ArrayList<>();

    private TextView settingPhoneNumber;
    private ImageView logOutButton;

    @SuppressWarnings("deprecation")
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        View root = inflater.inflate(R.layout.fragment_dashboard, container, false);

        settingPhoneNumber = root.findViewById(R.id.setting_phone_number);
        settingsRecyclerView = root.findViewById(R.id.setting_recycler_view);
        logOutButton = root.findViewById(R.id.logout_button);

        settingPhoneNumber.setText(new BwareFiles(getActivity()).readData("Phone Number"));
        logOutButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ArrayList<String> strings = new ArrayList<>();
                strings.add("Address.txt");
                strings.add("FCMToken.txt");
                strings.add("LocationUpdates.txt");
                strings.add("Phone Number.txt");
                strings.add("Red Zone.json");
                strings.add("User Token.txt");
                showLogOutDialog(getActivity(), strings);
            }
        });

        initSettingsView();
        return root;
    }

    private void initSettingsView() {
        settingsModels.add(new SettingsModel("Update Address", getResources().getDrawable(R.drawable.settings_address)));
        settingsModels.add(new SettingsModel("Notifications", getResources().getDrawable(R.drawable.settings_notification)));
        settingsModels.add(new SettingsModel("App Permission", getResources().getDrawable(R.drawable.settings_app_permission)));
        settingsModels.add(new SettingsModel("Rate Us", getResources().getDrawable(R.drawable.settings_rate_us)));
        settingsModels.add(new SettingsModel("Share App", getResources().getDrawable(R.drawable.settings_share_app)));
        settingsModels.add(new SettingsModel("About App", getResources().getDrawable(R.drawable.settings_about)));
        settingsAdapter = new SettingsAdapter(settingsModels, getActivity());
        settingsRecyclerView.setLayoutManager(new GridLayoutManager(getActivity(), 1, GridLayoutManager.VERTICAL, false));
        settingsRecyclerView.setAdapter(settingsAdapter);
    }

}
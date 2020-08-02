package com.fiends.bware.ui;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

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


public class DashboardFragment extends Fragment {

    private RecyclerView settingsRecyclerView;
    private SettingsAdapter settingsAdapter;
    private ArrayList<SettingsModel> settingsModels = new ArrayList<>();

    private TextView settingPhoneNumber;

    @SuppressWarnings("deprecation")
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        View root = inflater.inflate(R.layout.fragment_dashboard, container, false);

        settingPhoneNumber = root.findViewById(R.id.setting_phone_number);
        settingPhoneNumber.setText(new BwareFiles(getActivity()).readData("Phone Number"));

        settingsRecyclerView = root.findViewById(R.id.setting_recycler_view);
        settingsModels.add(new SettingsModel("Update Address", getResources().getDrawable(R.drawable.settings_address)));
        settingsModels.add(new SettingsModel("Notifications", getResources().getDrawable(R.drawable.settings_notification)));
        settingsModels.add(new SettingsModel("App Permission", getResources().getDrawable(R.drawable.settings_app_permission)));
        settingsModels.add(new SettingsModel("Rate Us", getResources().getDrawable(R.drawable.settings_rate_us)));
        settingsModels.add(new SettingsModel("Share App", getResources().getDrawable(R.drawable.settings_share_app)));
        settingsAdapter = new SettingsAdapter(settingsModels, getActivity());
        settingsRecyclerView.setLayoutManager(new GridLayoutManager(getActivity(), 1, GridLayoutManager.VERTICAL, false));
        settingsRecyclerView.setAdapter(settingsAdapter);
        return root;
    }

}
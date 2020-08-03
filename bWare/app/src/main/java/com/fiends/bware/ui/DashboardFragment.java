package com.fiends.bware.ui;

<<<<<<< HEAD
=======
import android.content.Intent;
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
<<<<<<< HEAD
=======
import android.widget.ImageView;
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

<<<<<<< HEAD
=======
import com.fiends.bware.Activities.DashBoardActivity;
import com.fiends.bware.Activities.SplashActivity;
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
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

<<<<<<< HEAD
=======
import static com.fiends.bware.Utils.Bware.showLogOutDialog;

>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186

public class DashboardFragment extends Fragment {

    private RecyclerView settingsRecyclerView;
    private SettingsAdapter settingsAdapter;
    private ArrayList<SettingsModel> settingsModels = new ArrayList<>();

    private TextView settingPhoneNumber;
<<<<<<< HEAD
=======
    private ImageView logOutButton;
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186

    @SuppressWarnings("deprecation")
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        View root = inflater.inflate(R.layout.fragment_dashboard, container, false);

        settingPhoneNumber = root.findViewById(R.id.setting_phone_number);
<<<<<<< HEAD
        settingPhoneNumber.setText(new BwareFiles(getActivity()).readData("Phone Number"));

        settingsRecyclerView = root.findViewById(R.id.setting_recycler_view);
=======
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
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
        settingsModels.add(new SettingsModel("Update Address", getResources().getDrawable(R.drawable.settings_address)));
        settingsModels.add(new SettingsModel("Notifications", getResources().getDrawable(R.drawable.settings_notification)));
        settingsModels.add(new SettingsModel("App Permission", getResources().getDrawable(R.drawable.settings_app_permission)));
        settingsModels.add(new SettingsModel("Rate Us", getResources().getDrawable(R.drawable.settings_rate_us)));
        settingsModels.add(new SettingsModel("Share App", getResources().getDrawable(R.drawable.settings_share_app)));
<<<<<<< HEAD
        settingsAdapter = new SettingsAdapter(settingsModels, getActivity());
        settingsRecyclerView.setLayoutManager(new GridLayoutManager(getActivity(), 1, GridLayoutManager.VERTICAL, false));
        settingsRecyclerView.setAdapter(settingsAdapter);
        return root;
=======
        settingsModels.add(new SettingsModel("About App", getResources().getDrawable(R.drawable.settings_about)));
        settingsAdapter = new SettingsAdapter(settingsModels, getActivity());
        settingsRecyclerView.setLayoutManager(new GridLayoutManager(getActivity(), 1, GridLayoutManager.VERTICAL, false));
        settingsRecyclerView.setAdapter(settingsAdapter);
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
    }

}
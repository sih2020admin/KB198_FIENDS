package com.fiends.bware.ui;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.fiends.bware.Adapters.NotificationAdapter;
import com.fiends.bware.Models.NotificationModel;
import com.fiends.bware.R;
import com.fiends.bware.Utils.BwareFiles;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;


public class NotificationsFragment extends Fragment {

    private RecyclerView notificationRecyclerView;
    private NotificationAdapter notificationAdapter;
    private ArrayList<NotificationModel> notificationModels;
    private BwareFiles files;
    private JSONArray jsonArray;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        View root = inflater.inflate(R.layout.fragment_notifications, container, false);

        notificationRecyclerView = root.findViewById(R.id.notification_recycler_view);

        init();

        return root;
    }

    @Override
    public void onResume() {
        super.onResume();
        init();
    }

    private void init() {
        files = new BwareFiles(getActivity());
        notificationModels = new ArrayList<>();
        try {
            System.out.println(files.readJSONData("Notification"));
            jsonArray = new JSONArray("[" + files.readJSONData("Notification") + "]");
            Log.i("NITHIN_AASHIK", "[" + files.readJSONData("Notification") + "]");
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonObject = new JSONObject(jsonArray.get(i).toString());
                JSONObject object = new JSONObject(jsonObject.getString("obj"));
                if (Boolean.parseBoolean(jsonObject.getString("redzone"))) {
                    notificationModels.add(new NotificationModel(
                            Boolean.parseBoolean(jsonObject.getString("redzone")),
                            object.getString("title"),
                            object.getString("description"),
                            jsonObject.getString("date"),
                            Boolean.parseBoolean(jsonObject.getString("viewed")),
                            object.getString("title"),
                            jsonArray));
                } else {
                    notificationModels.add(new NotificationModel(
                            Boolean.parseBoolean(jsonObject.getString("redzone")),
                            object.getString("title"),
                            object.getString("description"),
                            jsonObject.getString("date"),
                            Boolean.parseBoolean(jsonObject.getString("viewed")),
                            object.getString("disease"),
                            jsonArray));
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        notificationAdapter = new NotificationAdapter(notificationModels, getActivity());
        notificationRecyclerView.setLayoutManager(new GridLayoutManager(getActivity(), 1, GridLayoutManager.VERTICAL, true));
        notificationRecyclerView.setAdapter(notificationAdapter);
    }

}
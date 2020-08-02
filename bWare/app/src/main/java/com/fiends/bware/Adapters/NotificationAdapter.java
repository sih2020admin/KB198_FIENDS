package com.fiends.bware.Adapters;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.fiends.bware.Activities.NotifyMessageActivity;
import com.fiends.bware.Activities.WebReportActivity;
import com.fiends.bware.Models.NotificationModel;
import com.fiends.bware.R;
import com.fiends.bware.Utils.BwareFiles;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class NotificationAdapter extends RecyclerView.Adapter<NotificationAdapter.ViewHolder> {

    private ArrayList<NotificationModel> notificationModels;
    private Activity activity;

    public NotificationAdapter(ArrayList<NotificationModel> notificationModels, Activity activity) {
        this.notificationModels = notificationModels;
        this.activity = activity;
    }

    @NonNull
    @Override
    public NotificationAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater layoutInflater = LayoutInflater.from(parent.getContext());
        View view = layoutInflater.inflate(R.layout.notification_banner, parent, false);
        return new NotificationAdapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull NotificationAdapter.ViewHolder holder, int position) {
        if (notificationModels.get(position).getRedZone()) {
            holder.redZone.setVisibility(View.VISIBLE);
            holder.itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    updateNotification(position);
                    Intent intent = new Intent(activity, NotifyMessageActivity.class);
                    intent.putExtra("TITLE", notificationModels.get(position).getTitle());
                    intent.putExtra("BODY", notificationModels.get(position).getBody());
                    activity.startActivity(intent);
                }
            });
        } else {
            holder.itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    updateNotification(position);
                    Intent intent = new Intent(activity, WebReportActivity.class);
                    intent.putExtra("DISEASE", notificationModels.get(position).getDisease());
                    activity.startActivity(intent);
                }
            });
        }
        if (!notificationModels.get(position).getViewed()) {
            holder.viewed.setVisibility(View.VISIBLE);
        }
        holder.title.setText(notificationModels.get(position).getTitle());
        holder.body.setText(notificationModels.get(position).getBody());
        holder.date.setText(notificationModels.get(position).getDate());
    }

    private void updateNotification(int position) {
        JSONObject jsonObject;
        try {
            jsonObject = new JSONObject(notificationModels.get(position).getOldValue().get(position).toString());
            jsonObject.remove("viewed");
            jsonObject.put("viewed", "true");
            new BwareFiles(activity).editJSONFile(notificationModels.get(position).getOldValue(),
                    jsonObject,
                    position);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public int getItemCount() {
        return notificationModels.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {

        private ImageView redZone;
        private TextView title;
        private TextView body;
        private TextView date;
        private ImageView viewed;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            title = itemView.findViewById(R.id.near_by_zone_disease_name);
            body = itemView.findViewById(R.id.near_by_zone_disease_discription);
            date = itemView.findViewById(R.id.start_date);
            redZone = itemView.findViewById(R.id.red_zone_indicator);
            viewed = itemView.findViewById(R.id.notification_view_indicator);

        }
    }
}

package com.fiends.bware.Adapters;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.ActivityNotFoundException;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.fiends.bware.Activities.NotificationActivity;
import com.fiends.bware.Activities.UpdateAddressActivity;
import com.fiends.bware.Models.SettingsModel;
import com.fiends.bware.R;

import java.util.ArrayList;

public class SettingsAdapter extends RecyclerView.Adapter<SettingsAdapter.ViewHolder> {

    private ArrayList<SettingsModel> settingsModels;
    private Activity activity;

    public SettingsAdapter(ArrayList<SettingsModel> settingsModels, Activity activity) {
        this.settingsModels = settingsModels;
        this.activity = activity;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater layoutInflater = LayoutInflater.from(parent.getContext());
        View view = layoutInflater.inflate(R.layout.settings_layout_item, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.settingName.setText(settingsModels.get(position).getSettingsName());
        holder.settingImage.setImageDrawable(settingsModels.get(position).getSettingsImage());
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                switch (position) {
                    case 0:
                        activity.startActivity(new Intent(activity, UpdateAddressActivity.class));
                        break;
                    case 1:
                        activity.startActivity(new Intent(activity, NotificationActivity.class));
                        break;
                    case 2:
                        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
                        builder.setTitle("Allowed App Permissions");
                        String[] data = {"Location Permission","SMS Permission", "Telephone Permission"};
                        builder.setItems(data, null);
                        builder.setPositiveButton("Close", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {

                            }
                        });
                        AlertDialog dialog = builder.create();
                        dialog.setCancelable(false);
                        dialog.show();
                        break;
                    case 3:
                        try {
                            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + activity.getPackageName()));
                            activity.startActivity(intent);
                        } catch (ActivityNotFoundException e) {
                            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=" + activity.getPackageName()));
                            activity.startActivity(intent);
                        }
                        break;
                    case 4:
                        Intent intent = new Intent();
                        intent.setAction(Intent.ACTION_SEND);
                        intent.setType("text/plain");
                        intent.putExtra(Intent.EXTRA_TEXT, "https://play.google.com/store/apps/details?id=" + activity.getPackageName());
                        activity.startActivity(intent);
                        break;
                    case 5:
                        Dialog dialog1 = new Dialog(activity);
                        dialog1.setContentView(R.layout.about_dialog);
                        TextView closeBtn = dialog1.findViewById(R.id.about_close);
                        closeBtn.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                dialog1.dismiss();
                            }
                        });
                        dialog1.setCancelable(false);
                        dialog1.show();
                        break;
                }
            }
        });
    }

    @Override
    public int getItemCount() {
        return settingsModels.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {

        private TextView settingName;
        private ImageView settingImage;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            settingImage = itemView.findViewById(R.id.settings_icon);
            settingName = itemView.findViewById(R.id.settings_name);

        }
    }
}

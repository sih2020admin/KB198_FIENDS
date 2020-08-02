package com.fiends.bware.Utils;

import android.app.DatePickerDialog;
import android.app.Dialog;
import android.os.Bundle;
import android.widget.DatePicker;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;

import com.fiends.bware.Overrides.ServerResponse;

import java.util.Calendar;

public class DatePickerFragment extends DialogFragment {

    private TextView date;
    private String disease;
    private ServerResponse serverResponse;
    private String sDate;

    public DatePickerFragment(TextView date, String disease, ServerResponse serverResponse, String sDate) {
        this.date = date;
        this.disease = disease;
        this.serverResponse = serverResponse;
        this.sDate = sDate;
    }

    @NonNull
    @Override
    public Dialog onCreateDialog(@Nullable Bundle savedInstanceState) {

        final Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DAY_OF_MONTH);
        return new DatePickerDialog(getActivity(), new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker view, int year, int month, int dayOfMonth) {
                date.setText(year + "-" + ++month + "-" + dayOfMonth);
                serverResponse.DiseaseClick(disease, sDate);
            }
        }, year, month, day);
    }

}

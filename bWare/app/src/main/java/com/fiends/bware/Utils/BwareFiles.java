package com.fiends.bware.Utils;

import android.app.Activity;
import android.content.Context;
import android.net.Uri;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
<<<<<<< HEAD
=======
import java.util.ArrayList;
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186

public class BwareFiles {

    private Activity activity;
    private File path;
    private File oldFile;
    private Context context;

    public BwareFiles(Activity activity) {
        this.activity = activity;
    }

    public BwareFiles(Context context) {
        this.context = context;
    }

    public BwareFiles saveJSONData(String filename, String data) {

        path = new File(activity.getExternalFilesDir("/").toString(), "Data/" + filename + ".json");

        try {
            FileOutputStream stream = new FileOutputStream(path);
            stream.write(data.getBytes());
            stream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return this;
    }

    public boolean getJSONFileLength(String filename) {
        path = new File(context.getExternalFilesDir("/").toString(), "Data/" + filename + ".json");
        if ((int) path.length() > 0) {
            return true;
        }
        return false;
    }

    public String getFileUri(String filename, String type) {
        path = new File(activity.getExternalFilesDir("/").toString(), "Data/" + filename + "." + type);
        return Uri.fromFile(path).toString();
    }

    public BwareFiles saveData(String filename, String data) {
        path = new File(activity.getExternalFilesDir("/").toString(), "Data/" + filename + ".txt");

        try {
            FileOutputStream stream = new FileOutputStream(path);
            stream.write(data.getBytes());
            stream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return this;
    }

    public BwareFiles saveJSONDataC(String filename, String data) {
        path = new File(context.getExternalFilesDir("/").toString(), "Data/" + filename + ".txt");

        try {
            FileOutputStream stream = new FileOutputStream(path);
            stream.write(data.getBytes());
            stream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return this;
    }

    public BwareFiles updateData(String filename, String data) {
        path = new File(activity.getExternalFilesDir("/").toString(), "Data/" + filename + ".txt");

        try {
            FileWriter stream = new FileWriter(path, true);
            stream.write(data);
            stream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return this;
    }

    public BwareFiles updateJSONData(String filename, String data) {
        path = new File(context.getExternalFilesDir("/").toString(), "Data/" + filename + ".json");

        try {
            FileOutputStream stream = new FileOutputStream(path, true);
            stream.write(data.getBytes());
            stream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return this;
    }

    public String readData(String filename) {
        String token = "";
        path = new File(activity.getExternalFilesDir("/").toString(), "Data/" + filename + ".txt");
        try {
            BufferedReader bufferedReader = new BufferedReader(new FileReader(path));
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                token += line;
            }
            bufferedReader.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return token;
    }

    public String readJSONData(String filename) {
        String token = "";
        path = new File(activity.getExternalFilesDir("/").toString(), "Data/" + filename + ".json");
        try {
            BufferedReader bufferedReader = new BufferedReader(new FileReader(path));
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                token += line;
            }
            bufferedReader.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return token;
    }

    public boolean getFileLength(String filename) {
        path = new File(activity.getExternalFilesDir("/").toString(), "Data/" + filename + ".txt");
        if ((int) path.length() > 0) {
            return true;
        }
        return false;
    }

    public void renameFile(String oldName, String newName) {

        path = new File(activity.getExternalFilesDir("/").toString(), "Data/" + newName + ".txt");
        oldFile = new File(activity.getExternalFilesDir("/"), "Data/" + oldName + ".txt");
        oldFile.renameTo(path);
    }

    public void editJSONFile(JSONArray oldValue, JSONObject newValue, int position) {

        String mainData = "";
        try {
            for (int i = 0; i < oldValue.length(); i++) {
                if (i == position) {
                    mainData += newValue;
                } else {
                    mainData += oldValue.get(i).toString();
                }
                if (i != oldValue.length()-1) {
                    mainData += ",";
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        Log.i("NITHIN_AASHIK", mainData);
        mainData.replaceAll("\\[","");
        mainData.replaceAll("\\]","");
        saveJSONData("Notification", mainData);
    }

<<<<<<< HEAD
=======
    public BwareFiles deleteFiles(ArrayList<String> filename) {

        for (int i=0; i<filename.size(); i++) {
            path = new File(activity.getExternalFilesDir("/").toString(), "Data/" + filename.get(i));
            path.delete();
        }
        return this;
    }

>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
}

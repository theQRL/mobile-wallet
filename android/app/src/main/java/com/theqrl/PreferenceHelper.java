package com.theqrl;

import com.facebook.react.ReactActivity;

// class to access the Shared Preferences from outside MainActivity
public class PreferenceHelper extends ReactActivity {

    // save int to shared preferences
    public static void putInt(String key, Integer value) {
        MainActivity.preferences.edit().putInt(key, value ).commit();
    }

    // get int from shared preferences
    public static Integer getInt(String key) {
        return MainActivity.preferences.getInt(key, -1);
    }

    // save string to shared preferences
    public static void putString(String key, String value) {
        MainActivity.preferences.edit().putString(key, value ).commit();
    }

    // get string from shared preferences
    public static String getString(String key) {
        return MainActivity.preferences.getString(key, "");
    }

    // remove all wallet related information from sharedPrefs
    public static void clearPreferences() {
        MainActivity.preferences.edit().clear().commit();
    }

    // remove a single key/pair value from Preferences
    public static void removeFromPreferences(String key){
        MainActivity.preferences.edit().remove( key ).commit();
    }
}
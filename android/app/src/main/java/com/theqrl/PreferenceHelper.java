package com.theqrl;


import android.os.Bundle;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.SignatureException;
import java.security.UnrecoverableEntryException;
import java.security.cert.CertificateException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;

import static android.content.ContentValues.TAG;


/**
 * Created by abilican on 04.10.18.
 */

// class to access the Shared Preferences from outside MainActivity
public class PreferenceHelper extends ReactActivity {


    public static void putInt(String key, Integer value) {
        MainActivity.preferences.edit().putInt(key, value ).commit();
    }

    public static Integer getInt(String key) {
        return MainActivity.preferences.getInt(key, -1);
    }

    public static void putString(String key, String value) {
        MainActivity.preferences.edit().putString(key, value ).commit();
    }


    public static String getString(String key) {
        return MainActivity.preferences.getString(key, "");
    }









}
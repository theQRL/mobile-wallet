package com.theqrl;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.network.TLSSocketFactory;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.google.protobuf.ByteString;
import com.theqrl.PublicAPI.GetAddressStateReq;
import com.theqrl.PublicAPI.GetAddressStateResp;
import com.theqrl.PublicAPI.GetNodeStateReq;
import com.theqrl.PublicAPI.GetNodeStateResp;
import com.theqrl.PublicAPI.GetObjectReq;
import com.theqrl.PublicAPI.GetObjectResp;
import com.theqrl.PublicAPI.PublicAPIGrpc;
//import com.theqrl.PublicAPI.EncryptedEphemeralMessage;
//import com.theqrl.PublicAPI.GetNodeStateReq;
//import com.theqrl.PublicAPI.GetNodeStateReqOrBuilder;
//import com.theqrl.PublicAPI.qrlPubilicAPI;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.internal.DnsNameResolverProvider;
import io.grpc.okhttp.OkHttpChannelBuilder;
import io.grpc.okhttp.OkHttpChannelProvider;
import io.grpc.stub.StreamObserver;

import static com.theqrl.PublicAPI.PublicAPIGrpc.getGetObjectMethod;
import static com.theqrl.PublicAPI.PublicAPIGrpc.newBlockingStub;


public class AndroidWalletModule extends ReactContextBaseJavaModule {

    static {
        // load the C-library

        System.loadLibrary("qrllib");
        System.loadLibrary("shasha");
        System.loadLibrary("kyber");
        System.loadLibrary("android_wallet_jni");
    }

    public AndroidWalletModule(ReactApplicationContext reactContext) {
        super(reactContext); //required by React Native
    }

    @Override
    public String getName() {
        return "AndroidWallet"; //AndroidWallet is how this module will be referred to from React Native
    }


    // Declaration of native method
    public native String androidWalletJNI(int treeHeight, int hashFunction);
    private ManagedChannel channel;
    //private Qrl blockingStub;

    // Invoking native module from RN and returning a Promise
    // shoud always return void type

//    public void createWallet(Promise promise) {
//        try {
//            String androidWallet = androidWalletJNI();
//            promise.resolve(androidWallet);
//        } catch (Exception e) {
//            promise.reject("ERR", e);
//        }
//    }

    @ReactMethod
    public void createWallet(int treeHeight, int hashFunction, Callback errorCallback, Callback successCallback) {

        //channel = OkHttpChannelProvider.forAddress("devnet-1.automated.theqrl.org", 19009).nameResolverFactory(new DnsNameResolverProvider()).build();
        //channel = ManagedChannelBuilder.forAddress("devnet-1.automated.theqrl.org", 19009).sslSocketFactory(new TLSSocketFactory()).build();

        ManagedChannel channel = OkHttpChannelBuilder.forAddress("testnet-2.automated.theqrl.org", 19009).usePlaintext(true).build();
        PublicAPIGrpc.PublicAPIBlockingStub blockingStub = PublicAPIGrpc.newBlockingStub(channel);

        String walletAddress = "010500c0183a30c9170c8daf0a25d91f2102c49994a04e81a18286c1e345121f33037301c70c38";
        int len = walletAddress.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(walletAddress.charAt(i), 16) << 4)
                    + Character.digit(walletAddress.charAt(i+1), 16));
        }

        GetAddressStateReq getAddressStateReq = GetAddressStateReq.newBuilder().setAddress(ByteString.copyFrom(data)).build();
        GetAddressStateResp getAddressStateResp = blockingStub.getAddressState(getAddressStateReq);
        //System.out.println(getAddressStateResp.getState());
        //System.out.println(getAddressStateResp.getState().getAddress());
        System.out.println(getAddressStateResp.getState().getBalance());

//        GetNodeStateReq getNodeStateReq = GetNodeStateReq.newBuilder().build();
//        GetNodeStateResp getNodeStateResp = blockingStub.getNodeState(getNodeStateReq);
//        System.out.println(getNodeStateResp.getInfo().getBlockHeight());
//        System.out.println("Invoking native method");


        try {
            String androidWallet = androidWalletJNI(treeHeight, hashFunction);
            successCallback.invoke(androidWallet);
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }


    @ReactMethod
    // Method to update the wallet's balance
    public void refreshWallet(String walletAddress, Callback errorCallback, Callback successCallback) {
        try {
            ManagedChannel channel = OkHttpChannelBuilder.forAddress("testnet-2.automated.theqrl.org", 19009).usePlaintext(true).build();
            PublicAPIGrpc.PublicAPIBlockingStub blockingStub = PublicAPIGrpc.newBlockingStub(channel);

            int len = walletAddress.length();
            byte[] data = new byte[len / 2];
            for (int i = 0; i < len; i += 2) {
                data[i / 2] = (byte) ((Character.digit(walletAddress.charAt(i), 16) << 4)
                        + Character.digit(walletAddress.charAt(i+1), 16));
            }

            GetAddressStateReq getAddressStateReq = GetAddressStateReq.newBuilder().setAddress(ByteString.copyFrom(data)).build();
            GetAddressStateResp getAddressStateResp = blockingStub.getAddressState(getAddressStateReq);
            //System.out.println(getAddressStateResp.getState().getTransactionHashesList().get(1) );

            int tx_count = getAddressStateResp.getState().getTransactionHashesCount();


            int tx_end;
            if (tx_count < 10) {
                tx_end = -1;
            }
            else {
                tx_end = tx_count - 11;
            }

            for (int i = tx_count - 1 ; i > tx_end ; i -= 1) {

                System.out.println(getAddressStateResp.getState().getAddress().toString());
                ByteString txhashbytes = getAddressStateResp.getState().getTransactionHashesList().get(i);
                String str1 = new String(String.valueOf(getAddressStateResp.getState().getTransactionHashesList().get(i)));

                //System.out.println(txhashbytes.toByteArray());
                //System.out.println(txhashbytes.byteAt(0) );

//                byte[] byteArray = txhashbytes.toByteArray();
//                StringBuffer hexString = new StringBuffer();
//                for (byte b : byteArray) {
//                    int intVal = b & 0xff;
//                    if (intVal < 0x10)
//                        hexString.append("0");
//                    hexString.append(Integer.toHexString(intVal));
//                }
//                System.out.println(hexString.toString());
//
//                String txhash = hexString.toString();
//
//                int txhashlen = txhash.length();
//                byte[] txhashdata = new byte[txhashlen / 2];
//                for (int j = 0; j < len; j += 2) {
//                    txhashdata[j / 2] = (byte) ((Character.digit(txhash.charAt(i), 16) << 4)
//                            + Character.digit(txhash.charAt(i+1), 16));
//                }


                GetObjectReq getObjectReq = GetObjectReq.newBuilder().setQuery(txhashbytes).build();
                GetObjectResp getObjectResp = blockingStub.getObject(getObjectReq);
                System.out.println(getObjectResp.getTransaction().getTx().getTransfer());
            }


            successCallback.invoke(Long.toString(getAddressStateResp.getState().getBalance()));
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }



    // This is to return data from Java to Javascript
//    @ReactMethod
//    public void helloWorld(Callback errorCallback, Callback successCallback) { //this method will be called from JS by React Native
//        try {
//            String hello = helloWorldJNI();
//            successCallback.invoke(hello);
//            //promise.resolve(hello);
//        } catch (Exception e) {
//            errorCallback.invoke(e.getMessage());
//            //promise.reject("ERR", e);
//        }
//        //promise.resolve("Hello World!");
//    }



//    public void helloWorld(Promise promise) { //this method will be called from JS by React Native
//        promise.resolve("Hello World!");
//    }


}

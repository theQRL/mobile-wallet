package com.theqrl;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.network.TLSSocketFactory;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.theqrl.PublicAPI.GetAddressStateReq;
import com.theqrl.PublicAPI.GetNodeStateReq;
import com.theqrl.PublicAPI.GetNodeStateResp;
import com.theqrl.PublicAPI.PublicAPIGrpc;
//import com.theqrl.PublicAPI.EncryptedEphemeralMessage;
//import com.theqrl.PublicAPI.GetNodeStateReq;
//import com.theqrl.PublicAPI.GetNodeStateReqOrBuilder;
//import com.theqrl.PublicAPI.qrlPubilicAPI;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.internal.DnsNameResolverProvider;
import io.grpc.okhttp.OkHttpChannelBuilder;
import io.grpc.okhttp.OkHttpChannelProvider;
import io.grpc.stub.StreamObserver;

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
    @ReactMethod
//    public void createWallet(Promise promise) {
//        try {
//            String androidWallet = androidWalletJNI();
//            promise.resolve(androidWallet);
//        } catch (Exception e) {
//            promise.reject("ERR", e);
//        }
//    }


    public void createWallet(int treeHeight, int hashFunction, Callback errorCallback, Callback successCallback) {


        ManagedChannel channel = OkHttpChannelBuilder.forAddress("devnet-1.automated.theqrl.org", 19009).usePlaintext(true).build();

        //channel = OkHttpChannelProvider.forAddress("devnet-1.automated.theqrl.org", 19009).nameResolverFactory(new DnsNameResolverProvider()).build();
        //channel = ManagedChannelBuilder.forAddress("devnet-1.automated.theqrl.org", 19009).sslSocketFactory(new TLSSocketFactory()).build();
        PublicAPIGrpc.PublicAPIBlockingStub blockingStub = PublicAPIGrpc.newBlockingStub(channel);

        GetAddressStateReq getAddressStateReq = GetAddressStateReq.newBuilder().build();


        GetNodeStateReq getNodeStateReq = GetNodeStateReq.newBuilder().build();
        GetNodeStateResp getNodeStateResp = blockingStub.getNodeState(getNodeStateReq);
        System.out.println(getNodeStateResp.getInfo().getBlockHeight());
        System.out.println("Invoking native method");
        //GetNodeStateReq.Builder nodeStateReq = GetNodeStateReq.newBuilder();


        try {
            String androidWallet = androidWalletJNI(treeHeight, hashFunction);
            successCallback.invoke(androidWallet);
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

//
// Created by abilican on 22.03.18.
//


#include "android_wallet.h"
#include <qrl/xmssBase.h>
#include <qrl/xmssFast.h>

//#include <qrl/hashing.h>
#include <qrl/misc.h>
#include <qrl/xmssBasic.h>
#include <android/log.h>

#include <jni.h>
#include <string>
#include <syslog.h>
#include <kyber/ref/randombytes.h>


#ifdef __cplusplus
extern "C" {
#endif

AndroidWallet::AndroidWallet()
{
}

string AndroidWallet::androidWalletJNI(jint treeHeight, jint hashFunction)
{
    // fixed seed for testing purpose
    // would need to generate the seed on the RN side to avoid code duplication (iOS/Android)
    //std::vector<unsigned char> seed(48, 0);

    // empty array of unsigned char
    unsigned char seed_array[48];
    // filling the array with randombytes
    randombytes(seed_array, 48);
    // converting array to vector
    std::vector<unsigned char> seed(seed_array, seed_array + sizeof seed_array / sizeof seed_array[0]);

    __android_log_print(ANDROID_LOG_INFO, "Tag", "HASH FUNCTION IS : %i", (int)hashFunction);

    switch( (int)hashFunction) {
        case 1: {
            __android_log_print(ANDROID_LOG_INFO, "Tag", "HASH FUNCTION IS 1 = SHAKE_128");
            XmssBasic xmss = XmssBasic(seed, treeHeight, eHashFunction::SHAKE_128, eAddrFormatType::SHA256_2X);
            auto address = bin2hstr(xmss.getAddress());
            return address.c_str();
        }
        case 2: {
            __android_log_print(ANDROID_LOG_INFO, "Tag", "HASH FUNCTION IS 1 = SHAKE_256");
            XmssBasic xmss = XmssBasic(seed, treeHeight, eHashFunction::SHAKE_256, eAddrFormatType::SHA256_2X);
            auto address = bin2hstr(xmss.getAddress());
            return address.c_str();
        }
        case 3: {
            __android_log_print(ANDROID_LOG_INFO, "Tag", "HASH FUNCTION IS 1 = SHA2_256");
            XmssBasic xmss = XmssBasic(seed, treeHeight, eHashFunction::SHA2_256, eAddrFormatType::SHA256_2X);
            auto address = bin2hstr(xmss.getAddress());
            auto hexseed = bin2hstr(xmss.getSeed());
            __android_log_print(ANDROID_LOG_INFO, "Tag", "HEXSEED IS : %s", hexseed.c_str() );
            return address.c_str();
        }
        default : {//Optional
            __android_log_print(ANDROID_LOG_INFO, "Tag", "HASH FUNCTION IS DEFAULT");
            XmssBasic xmss = XmssBasic(seed, treeHeight, eHashFunction::SHAKE_128, eAddrFormatType::SHA256_2X);
            auto address = bin2hstr(xmss.getAddress());
            return address.c_str();
        }
    }



//    // create wallet
//    XmssBasic xmss(seed2, treeHeight, eHashFunction::SHAKE_128, eAddrFormatType::SHA256_2X);
//    auto address = bin2hstr(xmss.getAddress());
//    __android_log_print(ANDROID_LOG_INFO, "Tag", "TREE HEIGHT FROM RN IS %s", (string *) treeHeight );
//    __android_log_print(ANDROID_LOG_INFO, "Tag", "TREE HEIGHT FROM RN IS %s", (string *) hashFunction );
//    __android_log_print(ANDROID_LOG_INFO, "Tag", "WALLET ADDRESS %s", address.c_str() );
//    // send callback to RN
//    return address.c_str();
//    //return "Hello World from cpp";
}

#ifdef __cplusplus
}
#endif
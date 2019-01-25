//
// Created by abilican on 22.03.18.
//


#include "android_wallet.h"
#include <qrl/xmssBase.h>
#include <qrl/xmssFast.h>
#include <shasha/shasha.h>
#include <qrl/hashing.h>

//#include <qrl/hashing.h>
#include <qrl/misc.h>
#include <qrl/xmssBasic.h>
#include <android/log.h>

#include <jni.h>
#include <string>
#include <syslog.h>
#include <kyber/ref/randombytes.h>
#include <sstream>


#ifdef __cplusplus
extern "C" {
#endif

AndroidWallet::AndroidWallet()
{
}

// create QRL wallet with a given tree height and hash function
string AndroidWallet::createWallet(jint treeHeight, jint hashFunction)
{
    // empty array of unsigned char
    unsigned char seed_array[48];
    // filling the array with randombytes
    randombytes(seed_array, 48);
    // converting array to vector
    std::vector<unsigned char> seed(seed_array, seed_array + sizeof seed_array / sizeof seed_array[0]);

    __android_log_print(ANDROID_LOG_INFO, "Tag", "HASH FUNCTION IS : %i", (int)hashFunction);
    eHashFunction walletHashFunction;

    switch( (int)hashFunction) {
        case 1: {
            walletHashFunction = eHashFunction::SHAKE_128;
            break;
        }
        case 2: {
            walletHashFunction = eHashFunction::SHAKE_256;
            break;
        }
        case 3: {
            walletHashFunction = eHashFunction::SHA2_256;
            break;
        }
        default : {//Optional
            walletHashFunction = eHashFunction::SHAKE_128;
            break;
        }
    }
    // creating new wallet
    XmssFast xmss = XmssFast(seed, treeHeight, walletHashFunction, eAddrFormatType::SHA256_2X);
    std::string hexSeed = bin2hstr(xmss.getExtendedSeed());
    hexSeed.append(" ");
    std::string address = bin2hstr(xmss.getAddress() );
    hexSeed.append(address);
    hexSeed.append(" ");
    std::string xmsspk = bin2hstr(xmss.getPK() );
    hexSeed.append(xmsspk);
    return hexSeed.c_str();
}

// create QRL wallet from hexseed
string AndroidWallet::openWalletWithHexseed(string hexseed)
{
    QRLDescriptor desc = QRLDescriptor::fromExtendedSeed(hstr2bin( hexseed ));
    XmssFast xmss = XmssFast( hstr2bin(hexseed.substr(6)), desc.getHeight(), desc.getHashFunction(), eAddrFormatType::SHA256_2X);
    std::string hexSeed = bin2hstr(xmss.getExtendedSeed());
    hexSeed.append(" ");
    std::string address = bin2hstr(xmss.getAddress() );
    hexSeed.append(address);
    hexSeed.append(" ");
    std::string xmsspk = bin2hstr(xmss.getPK() );
    hexSeed.append(xmsspk);
//    hexSeed.append(" ");
    // convert height to string and append to hexSeed
//    hexSeed.append( std::to_string(desc.getHeight()) );
//    hexSeed.append(" ");
    return hexSeed.c_str();
}

// return mnemonic to user
string AndroidWallet::getMnemonic(string hexseed) {
    QRLDescriptor desc = QRLDescriptor::fromExtendedSeed(hstr2bin( hexseed ));
    XmssFast xmss = XmssFast( hstr2bin(hexseed.substr(6)), desc.getHeight());
    std::string mnemonic = bin2mnemonic(xmss.getExtendedSeed());
    return mnemonic.c_str();
}

// transgerCoins to send QRL
string AndroidWallet::transferCoins(string recipient, int amount, int fee, string hexseed, int otsIndex){


    __android_log_print(ANDROID_LOG_INFO, "Tag", "RECIPIENT CPP : %s", recipient.c_str() );
    std::vector<unsigned char> concatenatedVector(55);
    // fee to byte array cpp
    int64_t feeInt = (int64_t) fee;
    for (int i = 0; i < 8; i++) {
        concatenatedVector[7 - i] = (feeInt >> (i * 8));
    }

    // converting recipient address string to char array
    // https://stackoverflow.com/questions/3408706/hexadecimal-string-to-byte-array-in-c
    int nrec = recipient.length();
    char rechexBytes[nrec+1];
    strcpy(rechexBytes, recipient.c_str());
    char *recpos = rechexBytes;
    // Alternatively
//    const char rechexBytes[] = "0105003e32fcbcdcaf09485272f1aa1c1e318daaa8cf7cd03bacf7cfceeddf936bb88efe1e4d21", *recpos = rechexBytes;
    unsigned char val[39];
    int vectorPos = 8;
    for (int count = 0; count < (sizeof(rechexBytes)/2) ; count++) {
        sscanf(recpos, "%2hhx", &val[count]);
        concatenatedVector[vectorPos] = val[count];
        recpos += 2;
        vectorPos++;
    }

    // amount to byte array
    int vectorPos2 = 54;
    int64_t amountInt = (int64_t) amount;
    for (int i = 0; i < 8; i++){
        concatenatedVector[vectorPos2 - i] = (amountInt >> (i * 8) );
    }


    for (int i = 0; i < concatenatedVector.size(); i++){
        __android_log_print(ANDROID_LOG_INFO, "Tag", "concatenatedVector : %hhu", concatenatedVector[i] );
    }

    // shaSum
    auto shaSum = sha2_256(concatenatedVector);
    __android_log_print(ANDROID_LOG_INFO, "Tag", "SHASUM : %s", bin2hstr(shaSum).c_str() );





    int n = hexseed.substr(6).length();
    char hexseedBytes[n+1];
    strcpy(hexseedBytes, hexseed.substr(6).c_str());
    char *hexpos = hexseedBytes;
    // Alternatively
//    const char hexseedBytes[] = "hexstringstringminus6charsfrombeginning", *hexpos = hexseedBytes;
    std::vector<uint8_t> hexSeedVector(48);
    unsigned char hexval[48];
    //int hexPos = 0;
    for (int count = 0; count < (sizeof(hexseedBytes)/2) ; count++) {
        sscanf(hexpos, "%2hhx", &hexval[count]);
        hexSeedVector[count] = (uint8_t) hexval[count];
        hexpos += 2;
        //hexPos++;
    }

    // opening wallet and signing shasum
    QRLDescriptor desc = QRLDescriptor::fromExtendedSeed(hstr2bin( hexseed ));
    XmssFast xmss_obj( hexSeedVector, desc.getHeight() );
    xmss_obj.setIndex(otsIndex);
    // signing shasum
    auto signature = xmss_obj.sign(shaSum);


    std::vector<unsigned char> concatenatedVectorTx = {};
    // append shaSum
    for(int i=0; i< shaSum.size(); i++){
        concatenatedVectorTx.push_back( (uint8_t) shaSum[i]);
    }
    // append signature
    for(int i=0; i< signature.size(); i++){
        concatenatedVectorTx.push_back( (uint8_t) signature[i]);
    }
    // append PK
    for(int i=0; i< xmss_obj.getPK().size() ; i++){
        concatenatedVectorTx.push_back( (uint8_t) xmss_obj.getPK()[i] );
    }

    auto shaSumTx = sha2_256(concatenatedVectorTx);

//    std::string message = "a";
//    std::vector<unsigned char> data2(message.begin(), message.end());
//    auto signature2 = xmss_obj.sign(data2);

    std::string data = bin2hstr(signature);
    data += bin2hstr(shaSumTx);
    return data;
}


#ifdef __cplusplus
}
#endif
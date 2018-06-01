//
// Created by abilican on 22.03.18.
//


#include "android_wallet.h"
//#include <qrl/xmssBase.h>
//#include <qrl/hashing.h>
//#include <qrl/xmssBasic.h>
#include <qrl/misc.h>

#ifdef __cplusplus
extern "C" {
#endif

AndroidWallet::AndroidWallet()
{
}

string AndroidWallet::androidWalletJNI()
{
    // fixed seed for testing purpose
    // would need to generate the seed on the RN side to avoid code duplication (iOS/Android)
    //std::vector<unsigned char> seed(48, 0);

    // create wallet
    //XmssBasic xmss(seed, 4, eHashFunction::SHAKE_128, eAddrFormatType::SHA256_2X);
    //auto address = bin2hstr(xmss.getAddress());

    // send callback to RN
    return "Hello World from cpp";
}

#ifdef __cplusplus
}
#endif
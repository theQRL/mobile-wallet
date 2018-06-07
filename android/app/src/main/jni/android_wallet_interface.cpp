
#include "android_wallet_interface.h"
#include "android_wallet.h"
//#include "android_wallet.h"

//#include "android_wallet.h"
//#include <qrl/xmssBase.h>
//#include <qrl/xmssFast.h>
//#include <qrl/hashing.h>
#include <qrl/misc.h>
#include <qrl/xmssBasic.h>



#ifdef __cplusplus
extern "C" {
#endif

// JNI entries implementation

JNIEXPORT jstring JNICALL Java_com_theqrl_AndroidWalletModule_androidWalletJNI(JNIEnv* pEnv, jobject pThis)
{
    AndroidWallet androidWallet;
    //printf("Hello World from C function!\n");
    //return pEnv-> NewStringUTF("Ho Ho Hoooo");
    return pEnv-> NewStringUTF(androidWallet.androidWalletJNI().c_str());
    //return (*pEnv) -> NewStringUTF(pEnv, "sdfsdf");
    //return pEnv->NewStringUTF(hello.helloWorldJNI().c_str());
}


#ifdef __cplusplus
}
#endif

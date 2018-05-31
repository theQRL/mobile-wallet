
#include "com_theqrl_HelloWorldModule.h"
#include "helloworld.h"

JNIEXPORT jstring JNICALL Java_com_theqrl_HelloWorldModule_helloWorldJNI(JNIEnv* pEnv, jobject pThis)
{
    HelloWorld hello;
    return pEnv-> NewStringUTF(hello.helloWorldJNI().c_str());
    //return (*pEnv) -> NewStringUTF(pEnv, "sdfsdf");
    //return pEnv->NewStringUTF(hello.helloWorldJNI().c_str());
}
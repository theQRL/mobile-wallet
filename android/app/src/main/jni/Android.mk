
LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)

LOCAL_SRC_FILES := hello_world.c
LOCAL_MODULE := hello_world_jni


include $(BUILD_SHARED_LIBRARY)

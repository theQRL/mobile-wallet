# Distributed under the MIT software license, see the accompanying
# file LICENSE or http://www.opensource.org/licenses/mit-license.php.

cmake_minimum_required(VERSION 3.5)
project(qrllib)

set(CMAKE_CXX_STANDARD 14)
#set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14 -Wall -Wextra -pedantic")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fPIC -Wno-deprecated-declarations")
set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS} -std=c++14 -O3 -Wno-deprecated")

set(CMAKE_VERBOSE_MAKEFILE FALSE)
set(CMAKE_ERROR_DEPRECATED FALSE)
set(CMAKE_WARN_DEPRECATED FALSE)

set(REF_ANDROID_SRC android/app/src/main/jni/android_wallet.cpp android/app/src/main/jni/android_wallet_interface.cpp )

include_directories(
        ${CMAKE_CURRENT_SOURCE_DIR}/qrllib/src/api
        ${CMAKE_CURRENT_SOURCE_DIR}/qrllib/src
        ${CMAKE_CURRENT_SOURCE_DIR}/qrllib/deps
)

file(GLOB LIB_QRL_INCLUDES
        qrllib/src/xmss-alt
        ${CMAKE_CURRENT_SOURCE_DIR}/qrllib/src/qrl
        )

file(GLOB LIB_SHASHA_INCLUDES
        ${CMAKE_CURRENT_SOURCE_DIR}/qrllib/src/shasha
        )

file(GLOB_RECURSE LIB_QRL_SRC
        "${CMAKE_CURRENT_SOURCE_DIR}/qrllib/src/qrl/*.cpp")

set(LIBXMSSALT_SRC
        qrllib/src/xmss-alt/algsxmss_fast.c
        qrllib/src/xmss-alt/algsxmss.c
        qrllib/src/xmss-alt/hash.c
        qrllib/src/xmss-alt/hash_address.c
        qrllib/src/xmss-alt/xmss_common.c
        qrllib/src/xmss-alt/wots.c
        qrllib/src/xmss-alt/fips202.c
        )

file(GLOB_RECURSE LIB_SHASHA_SRC
        ${CMAKE_CURRENT_SOURCE_DIR}/qrllib/src/shasha/*.cpp
        )

# Forcing XMSS to be compiled as C++
SET_SOURCE_FILES_PROPERTIES(${LIB_QRL_SRC} PROPERTIES LANGUAGE CXX)
SET_SOURCE_FILES_PROPERTIES(${LIBXMSSALT_SRC} PROPERTIES LANGUAGE CXX)
SET_SOURCE_FILES_PROPERTIES(${LIB_SHASHA_SRC} PROPERTIES LANGUAGE CXX)


add_library(shasha SHARED ${LIB_SHASHA_SRC})
target_include_directories(shasha PRIVATE ${LIB_SHASHA_INCLUDES} )

add_library(qrllib SHARED ${LIB_QRL_SRC} ${LIBXMSSALT_SRC})
target_include_directories(qrllib PRIVATE ${LIB_QRL_INCLUDES} ${LIB_SHASHA_INCLUDES})

add_library(android_wallet_jni SHARED ${REF_ANDROID_SRC})
target_include_directories(android_wallet_jni PRIVATE android/app/src/main/jni/)

# Allow cpp logging
find_library(ANDROID_LOG_LIB log)

target_link_libraries( qrllib shasha)
target_link_libraries(android_wallet_jni qrllib shasha)
target_link_libraries(android_wallet_jni ${ANDROID_LOG_LIB} )

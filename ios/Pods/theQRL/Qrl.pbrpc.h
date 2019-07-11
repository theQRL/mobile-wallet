#if !defined(GPB_GRPC_FORWARD_DECLARE_MESSAGE_PROTO) || !GPB_GRPC_FORWARD_DECLARE_MESSAGE_PROTO
#import "Qrl.pbobjc.h"
#endif

#if !defined(GPB_GRPC_PROTOCOL_ONLY) || !GPB_GRPC_PROTOCOL_ONLY
#import <ProtoRPC/ProtoService.h>
#import <ProtoRPC/ProtoRPC.h>
#import <RxLibrary/GRXWriteable.h>
#import <RxLibrary/GRXWriter.h>
#endif

@class CollectEphemeralMessageReq;
@class CollectEphemeralMessageResp;
@class GetAddressFromPKReq;
@class GetAddressFromPKResp;
@class GetAddressStateReq;
@class GetAddressStateResp;
@class GetKnownPeersReq;
@class GetKnownPeersResp;
@class GetLatestDataReq;
@class GetLatestDataResp;
@class GetNodeStateReq;
@class GetNodeStateResp;
@class GetObjectReq;
@class GetObjectResp;
@class GetPeersStatReq;
@class GetPeersStatResp;
@class GetStatsReq;
@class GetStatsResp;
@class LatticePublicKeyTxnReq;
@class MessageTxnReq;
@class PushEphemeralMessageReq;
@class PushTransactionReq;
@class PushTransactionResp;
@class SlaveTxnReq;
@class TokenTxnReq;
@class TransferCoinsReq;
@class TransferCoinsResp;
@class TransferTokenTxnReq;

#if !defined(GPB_GRPC_FORWARD_DECLARE_MESSAGE_PROTO) || !GPB_GRPC_FORWARD_DECLARE_MESSAGE_PROTO
#endif

@class GRPCProtoCall;


NS_ASSUME_NONNULL_BEGIN

@protocol PublicAPI <NSObject>

#pragma mark GetNodeState(GetNodeStateReq) returns (GetNodeStateResp)

- (void)getNodeStateWithRequest:(GetNodeStateReq *)request handler:(void(^)(GetNodeStateResp *_Nullable response, NSError *_Nullable error))handler;

- (GRPCProtoCall *)RPCToGetNodeStateWithRequest:(GetNodeStateReq *)request handler:(void(^)(GetNodeStateResp *_Nullable response, NSError *_Nullable error))handler;


#pragma mark GetKnownPeers(GetKnownPeersReq) returns (GetKnownPeersResp)

- (void)getKnownPeersWithRequest:(GetKnownPeersReq *)request handler:(void(^)(GetKnownPeersResp *_Nullable response, NSError *_Nullable error))handler;

- (GRPCProtoCall *)RPCToGetKnownPeersWithRequest:(GetKnownPeersReq *)request handler:(void(^)(GetKnownPeersResp *_Nullable response, NSError *_Nullable error))handler;


#pragma mark GetPeersStat(GetPeersStatReq) returns (GetPeersStatResp)

- (void)getPeersStatWithRequest:(GetPeersStatReq *)request handler:(void(^)(GetPeersStatResp *_Nullable response, NSError *_Nullable error))handler;

- (GRPCProtoCall *)RPCToGetPeersStatWithRequest:(GetPeersStatReq *)request handler:(void(^)(GetPeersStatResp *_Nullable response, NSError *_Nullable error))handler;


#pragma mark GetStats(GetStatsReq) returns (GetStatsResp)

- (void)getStatsWithRequest:(GetStatsReq *)request handler:(void(^)(GetStatsResp *_Nullable response, NSError *_Nullable error))handler;

- (GRPCProtoCall *)RPCToGetStatsWithRequest:(GetStatsReq *)request handler:(void(^)(GetStatsResp *_Nullable response, NSError *_Nullable error))handler;


#pragma mark GetAddressState(GetAddressStateReq) returns (GetAddressStateResp)

- (void)getAddressStateWithRequest:(GetAddressStateReq *)request handler:(void(^)(GetAddressStateResp *_Nullable response, NSError *_Nullable error))handler;

- (GRPCProtoCall *)RPCToGetAddressStateWithRequest:(GetAddressStateReq *)request handler:(void(^)(GetAddressStateResp *_Nullable response, NSError *_Nullable error))handler;


#pragma mark GetObject(GetObjectReq) returns (GetObjectResp)

- (void)getObjectWithRequest:(GetObjectReq *)request handler:(void(^)(GetObjectResp *_Nullable response, NSError *_Nullable error))handler;

- (GRPCProtoCall *)RPCToGetObjectWithRequest:(GetObjectReq *)request handler:(void(^)(GetObjectResp *_Nullable response, NSError *_Nullable error))handler;


#pragma mark GetLatestData(GetLatestDataReq) returns (GetLatestDataResp)

- (void)getLatestDataWithRequest:(GetLatestDataReq *)request handler:(void(^)(GetLatestDataResp *_Nullable response, NSError *_Nullable error))handler;

- (GRPCProtoCall *)RPCToGetLatestDataWithRequest:(GetLatestDataReq *)request handler:(void(^)(GetLatestDataResp *_Nullable response, NSError *_Nullable error))handler;


#pragma mark TransferCoins(TransferCoinsReq) returns (TransferCoinsResp)

- (void)transferCoinsWithRequest:(TransferCoinsReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler;

- (GRPCProtoCall *)RPCToTransferCoinsWithRequest:(TransferCoinsReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler;


#pragma mark PushTransaction(PushTransactionReq) returns (PushTransactionResp)

- (void)pushTransactionWithRequest:(PushTransactionReq *)request handler:(void(^)(PushTransactionResp *_Nullable response, NSError *_Nullable error))handler;

- (GRPCProtoCall *)RPCToPushTransactionWithRequest:(PushTransactionReq *)request handler:(void(^)(PushTransactionResp *_Nullable response, NSError *_Nullable error))handler;


#pragma mark GetMessageTxn(MessageTxnReq) returns (TransferCoinsResp)

- (void)getMessageTxnWithRequest:(MessageTxnReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler;

- (GRPCProtoCall *)RPCToGetMessageTxnWithRequest:(MessageTxnReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler;


#pragma mark GetTokenTxn(TokenTxnReq) returns (TransferCoinsResp)

- (void)getTokenTxnWithRequest:(TokenTxnReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler;

- (GRPCProtoCall *)RPCToGetTokenTxnWithRequest:(TokenTxnReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler;


#pragma mark GetTransferTokenTxn(TransferTokenTxnReq) returns (TransferCoinsResp)

- (void)getTransferTokenTxnWithRequest:(TransferTokenTxnReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler;

- (GRPCProtoCall *)RPCToGetTransferTokenTxnWithRequest:(TransferTokenTxnReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler;


#pragma mark GetSlaveTxn(SlaveTxnReq) returns (TransferCoinsResp)

- (void)getSlaveTxnWithRequest:(SlaveTxnReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler;

- (GRPCProtoCall *)RPCToGetSlaveTxnWithRequest:(SlaveTxnReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler;


#pragma mark GetLatticePublicKeyTxn(LatticePublicKeyTxnReq) returns (TransferCoinsResp)

- (void)getLatticePublicKeyTxnWithRequest:(LatticePublicKeyTxnReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler;

- (GRPCProtoCall *)RPCToGetLatticePublicKeyTxnWithRequest:(LatticePublicKeyTxnReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler;


#pragma mark GetAddressFromPK(GetAddressFromPKReq) returns (GetAddressFromPKResp)

- (void)getAddressFromPKWithRequest:(GetAddressFromPKReq *)request handler:(void(^)(GetAddressFromPKResp *_Nullable response, NSError *_Nullable error))handler;

- (GRPCProtoCall *)RPCToGetAddressFromPKWithRequest:(GetAddressFromPKReq *)request handler:(void(^)(GetAddressFromPKResp *_Nullable response, NSError *_Nullable error))handler;


#pragma mark PushEphemeralMessage(PushEphemeralMessageReq) returns (PushTransactionResp)

/**
 * ------- Ephemeral API -------
 */
- (void)pushEphemeralMessageWithRequest:(PushEphemeralMessageReq *)request handler:(void(^)(PushTransactionResp *_Nullable response, NSError *_Nullable error))handler;

/**
 * ------- Ephemeral API -------
 */
- (GRPCProtoCall *)RPCToPushEphemeralMessageWithRequest:(PushEphemeralMessageReq *)request handler:(void(^)(PushTransactionResp *_Nullable response, NSError *_Nullable error))handler;


#pragma mark CollectEphemeralMessage(CollectEphemeralMessageReq) returns (CollectEphemeralMessageResp)

/**
 * ------------------------------
 */
- (void)collectEphemeralMessageWithRequest:(CollectEphemeralMessageReq *)request handler:(void(^)(CollectEphemeralMessageResp *_Nullable response, NSError *_Nullable error))handler;

/**
 * ------------------------------
 */
- (GRPCProtoCall *)RPCToCollectEphemeralMessageWithRequest:(CollectEphemeralMessageReq *)request handler:(void(^)(CollectEphemeralMessageResp *_Nullable response, NSError *_Nullable error))handler;


@end

@protocol AdminAPI <NSObject>

@end


#if !defined(GPB_GRPC_PROTOCOL_ONLY) || !GPB_GRPC_PROTOCOL_ONLY
/**
 * Basic service implementation, over gRPC, that only does
 * marshalling and parsing.
 */
@interface PublicAPI : GRPCProtoService<PublicAPI>
- (instancetype)initWithHost:(NSString *)host NS_DESIGNATED_INITIALIZER;
+ (instancetype)serviceWithHost:(NSString *)host;
@end
/**
 * Basic service implementation, over gRPC, that only does
 * marshalling and parsing.
 */
@interface AdminAPI : GRPCProtoService<AdminAPI>
- (instancetype)initWithHost:(NSString *)host NS_DESIGNATED_INITIALIZER;
+ (instancetype)serviceWithHost:(NSString *)host;
@end
#endif

NS_ASSUME_NONNULL_END


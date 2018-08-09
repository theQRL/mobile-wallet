#import "Qrl.pbobjc.h"

#import <ProtoRPC/ProtoService.h>
#import <RxLibrary/GRXWriteable.h>
#import <RxLibrary/GRXWriter.h>



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


#pragma mark PushTransaction(PushTransactionReq) returns (PushTransactionResp)

- (void)pushTransactionWithRequest:(PushTransactionReq *)request handler:(void(^)(PushTransactionResp *_Nullable response, NSError *_Nullable error))handler;

- (GRPCProtoCall *)RPCToPushTransactionWithRequest:(PushTransactionReq *)request handler:(void(^)(PushTransactionResp *_Nullable response, NSError *_Nullable error))handler;


#pragma mark TransferCoins(TransferCoinsReq) returns (TransferCoinsResp)

- (void)transferCoinsWithRequest:(TransferCoinsReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler;

- (GRPCProtoCall *)RPCToTransferCoinsWithRequest:(TransferCoinsReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler;


#pragma mark GetAddressFromPK(GetAddressFromPKReq) returns (GetAddressFromPKResp)

- (void)getAddressFromPKWithRequest:(GetAddressFromPKReq *)request handler:(void(^)(GetAddressFromPKResp *_Nullable response, NSError *_Nullable error))handler;

- (GRPCProtoCall *)RPCToGetAddressFromPKWithRequest:(GetAddressFromPKReq *)request handler:(void(^)(GetAddressFromPKResp *_Nullable response, NSError *_Nullable error))handler;


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


@end

/**
 * Basic service implementation, over gRPC, that only does
 * marshalling and parsing.
 */
@interface PublicAPI : GRPCProtoService<PublicAPI>
- (instancetype)initWithHost:(NSString *)host NS_DESIGNATED_INITIALIZER;
+ (instancetype)serviceWithHost:(NSString *)host;
@end
@protocol AdminAPI <NSObject>

@end

/**
 * Basic service implementation, over gRPC, that only does
 * marshalling and parsing.
 */
@interface AdminAPI : GRPCProtoService<AdminAPI>
- (instancetype)initWithHost:(NSString *)host NS_DESIGNATED_INITIALIZER;
+ (instancetype)serviceWithHost:(NSString *)host;
@end

NS_ASSUME_NONNULL_END

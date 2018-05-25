#import "Qrl.pbrpc.h"

#import <ProtoRPC/ProtoRPC.h>
#import <RxLibrary/GRXWriter+Immediate.h>

@implementation PublicAPI

// Designated initializer
- (instancetype)initWithHost:(NSString *)host {
  return (self = [super initWithHost:host packageName:@"qrl" serviceName:@"PublicAPI"]);
}

// Override superclass initializer to disallow different package and service names.
- (instancetype)initWithHost:(NSString *)host
                 packageName:(NSString *)packageName
                 serviceName:(NSString *)serviceName {
  return [self initWithHost:host];
}

+ (instancetype)serviceWithHost:(NSString *)host {
  return [[self alloc] initWithHost:host];
}


#pragma mark GetNodeState(GetNodeStateReq) returns (GetNodeStateResp)

- (void)getNodeStateWithRequest:(GetNodeStateReq *)request handler:(void(^)(GetNodeStateResp *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCToGetNodeStateWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCToGetNodeStateWithRequest:(GetNodeStateReq *)request handler:(void(^)(GetNodeStateResp *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"GetNodeState"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[GetNodeStateResp class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
#pragma mark GetKnownPeers(GetKnownPeersReq) returns (GetKnownPeersResp)

- (void)getKnownPeersWithRequest:(GetKnownPeersReq *)request handler:(void(^)(GetKnownPeersResp *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCToGetKnownPeersWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCToGetKnownPeersWithRequest:(GetKnownPeersReq *)request handler:(void(^)(GetKnownPeersResp *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"GetKnownPeers"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[GetKnownPeersResp class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
#pragma mark GetStats(GetStatsReq) returns (GetStatsResp)

- (void)getStatsWithRequest:(GetStatsReq *)request handler:(void(^)(GetStatsResp *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCToGetStatsWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCToGetStatsWithRequest:(GetStatsReq *)request handler:(void(^)(GetStatsResp *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"GetStats"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[GetStatsResp class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
#pragma mark GetAddressState(GetAddressStateReq) returns (GetAddressStateResp)

- (void)getAddressStateWithRequest:(GetAddressStateReq *)request handler:(void(^)(GetAddressStateResp *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCToGetAddressStateWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCToGetAddressStateWithRequest:(GetAddressStateReq *)request handler:(void(^)(GetAddressStateResp *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"GetAddressState"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[GetAddressStateResp class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
#pragma mark GetObject(GetObjectReq) returns (GetObjectResp)

- (void)getObjectWithRequest:(GetObjectReq *)request handler:(void(^)(GetObjectResp *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCToGetObjectWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCToGetObjectWithRequest:(GetObjectReq *)request handler:(void(^)(GetObjectResp *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"GetObject"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[GetObjectResp class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
#pragma mark GetLatestData(GetLatestDataReq) returns (GetLatestDataResp)

- (void)getLatestDataWithRequest:(GetLatestDataReq *)request handler:(void(^)(GetLatestDataResp *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCToGetLatestDataWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCToGetLatestDataWithRequest:(GetLatestDataReq *)request handler:(void(^)(GetLatestDataResp *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"GetLatestData"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[GetLatestDataResp class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
#pragma mark TransferCoins(TransferCoinsReq) returns (TransferCoinsResp)

- (void)transferCoinsWithRequest:(TransferCoinsReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCToTransferCoinsWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCToTransferCoinsWithRequest:(TransferCoinsReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"TransferCoins"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[TransferCoinsResp class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
#pragma mark PushTransaction(PushTransactionReq) returns (PushTransactionResp)

- (void)pushTransactionWithRequest:(PushTransactionReq *)request handler:(void(^)(PushTransactionResp *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCToPushTransactionWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCToPushTransactionWithRequest:(PushTransactionReq *)request handler:(void(^)(PushTransactionResp *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"PushTransaction"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[PushTransactionResp class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
#pragma mark GetTokenTxn(TokenTxnReq) returns (TransferCoinsResp)

- (void)getTokenTxnWithRequest:(TokenTxnReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCToGetTokenTxnWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCToGetTokenTxnWithRequest:(TokenTxnReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"GetTokenTxn"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[TransferCoinsResp class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
#pragma mark GetTransferTokenTxn(TransferTokenTxnReq) returns (TransferCoinsResp)

- (void)getTransferTokenTxnWithRequest:(TransferTokenTxnReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCToGetTransferTokenTxnWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCToGetTransferTokenTxnWithRequest:(TransferTokenTxnReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"GetTransferTokenTxn"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[TransferCoinsResp class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
#pragma mark GetSlaveTxn(SlaveTxnReq) returns (TransferCoinsResp)

- (void)getSlaveTxnWithRequest:(SlaveTxnReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCToGetSlaveTxnWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCToGetSlaveTxnWithRequest:(SlaveTxnReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"GetSlaveTxn"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[TransferCoinsResp class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
#pragma mark GetLatticePublicKeyTxn(LatticePublicKeyTxnReq) returns (TransferCoinsResp)

- (void)getLatticePublicKeyTxnWithRequest:(LatticePublicKeyTxnReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCToGetLatticePublicKeyTxnWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCToGetLatticePublicKeyTxnWithRequest:(LatticePublicKeyTxnReq *)request handler:(void(^)(TransferCoinsResp *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"GetLatticePublicKeyTxn"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[TransferCoinsResp class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
#pragma mark PushEphemeralMessage(PushEphemeralMessageReq) returns (PushTransactionResp)

/**
 * ------- Ephemeral API -------
 */
- (void)pushEphemeralMessageWithRequest:(PushEphemeralMessageReq *)request handler:(void(^)(PushTransactionResp *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCToPushEphemeralMessageWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
/**
 * ------- Ephemeral API -------
 */
- (GRPCProtoCall *)RPCToPushEphemeralMessageWithRequest:(PushEphemeralMessageReq *)request handler:(void(^)(PushTransactionResp *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"PushEphemeralMessage"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[PushTransactionResp class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
#pragma mark CollectEphemeralMessage(CollectEphemeralMessageReq) returns (CollectEphemeralMessageResp)

/**
 * ------------------------------
 */
- (void)collectEphemeralMessageWithRequest:(CollectEphemeralMessageReq *)request handler:(void(^)(CollectEphemeralMessageResp *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCToCollectEphemeralMessageWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
/**
 * ------------------------------
 */
- (GRPCProtoCall *)RPCToCollectEphemeralMessageWithRequest:(CollectEphemeralMessageReq *)request handler:(void(^)(CollectEphemeralMessageResp *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"CollectEphemeralMessage"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[CollectEphemeralMessageResp class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
#pragma mark GetTokenDetailedList(Empty) returns (TokenDetailedList)

- (void)getTokenDetailedListWithRequest:(Empty *)request handler:(void(^)(TokenDetailedList *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCToGetTokenDetailedListWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCToGetTokenDetailedListWithRequest:(Empty *)request handler:(void(^)(TokenDetailedList *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"GetTokenDetailedList"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[TokenDetailedList class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
@end
@implementation AdminAPI

// Designated initializer
- (instancetype)initWithHost:(NSString *)host {
  return (self = [super initWithHost:host packageName:@"qrl" serviceName:@"AdminAPI"]);
}

// Override superclass initializer to disallow different package and service names.
- (instancetype)initWithHost:(NSString *)host
                 packageName:(NSString *)packageName
                 serviceName:(NSString *)serviceName {
  return [self initWithHost:host];
}

+ (instancetype)serviceWithHost:(NSString *)host {
  return [[self alloc] initWithHost:host];
}


@end

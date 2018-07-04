/**
 * @fileoverview gRPC Web JS generated client stub for qrl
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!


goog.provide('proto.qrl.PublicAPIClient');
goog.provide('proto.qrl.AdminAPIClient');

goog.require('grpc.web.GrpcWebClientBase');
goog.require('grpc.web.AbstractClientBase');
goog.require('grpc.web.ClientReadableStream');
goog.require('grpc.web.Error');
goog.require('proto.qrl.CollectEphemeralMessageReq');
goog.require('proto.qrl.CollectEphemeralMessageResp');
goog.require('proto.qrl.Empty');
goog.require('proto.qrl.GetAddressStateReq');
goog.require('proto.qrl.GetAddressStateResp');
goog.require('proto.qrl.GetKnownPeersReq');
goog.require('proto.qrl.GetKnownPeersResp');
goog.require('proto.qrl.GetLatestDataReq');
goog.require('proto.qrl.GetLatestDataResp');
goog.require('proto.qrl.GetNodeStateReq');
goog.require('proto.qrl.GetNodeStateResp');
goog.require('proto.qrl.GetObjectReq');
goog.require('proto.qrl.GetObjectResp');
goog.require('proto.qrl.GetStatsReq');
goog.require('proto.qrl.GetStatsResp');
goog.require('proto.qrl.LatticePublicKeyTxnReq');
goog.require('proto.qrl.PushEphemeralMessageReq');
goog.require('proto.qrl.PushTransactionReq');
goog.require('proto.qrl.PushTransactionResp');
goog.require('proto.qrl.SlaveTxnReq');
goog.require('proto.qrl.TokenDetailedList');
goog.require('proto.qrl.TokenTxnReq');
goog.require('proto.qrl.TransferCoinsReq');
goog.require('proto.qrl.TransferCoinsResp');
goog.require('proto.qrl.TransferTokenTxnReq');



goog.scope(function() {

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @constructor
 * @struct
 * @final
 */
proto.qrl.PublicAPIClient =
    function(hostname, credentials, options) {
  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.qrl.GetNodeStateReq,
 *   !proto.qrl.GetNodeStateResp>}
 */
const methodInfo_GetNodeState = new grpc.web.AbstractClientBase.MethodInfo(
  proto.qrl.GetNodeStateResp,
  /** @param {!proto.qrl.GetNodeStateReq} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.qrl.GetNodeStateResp.deserializeBinary
);


/**
 * @param {!proto.qrl.GetNodeStateReq} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.qrl.GetNodeStateResp)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.qrl.GetNodeStateResp>|undefined}
 *     The XHR Node Readable Stream
 */
proto.qrl.PublicAPIClient.prototype.getNodeState =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/qrl.PublicAPI/GetNodeState',
      request,
      metadata,
      methodInfo_GetNodeState,
      callback);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.qrl.GetKnownPeersReq,
 *   !proto.qrl.GetKnownPeersResp>}
 */
const methodInfo_GetKnownPeers = new grpc.web.AbstractClientBase.MethodInfo(
  proto.qrl.GetKnownPeersResp,
  /** @param {!proto.qrl.GetKnownPeersReq} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.qrl.GetKnownPeersResp.deserializeBinary
);


/**
 * @param {!proto.qrl.GetKnownPeersReq} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.qrl.GetKnownPeersResp)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.qrl.GetKnownPeersResp>|undefined}
 *     The XHR Node Readable Stream
 */
proto.qrl.PublicAPIClient.prototype.getKnownPeers =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/qrl.PublicAPI/GetKnownPeers',
      request,
      metadata,
      methodInfo_GetKnownPeers,
      callback);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.qrl.GetStatsReq,
 *   !proto.qrl.GetStatsResp>}
 */
const methodInfo_GetStats = new grpc.web.AbstractClientBase.MethodInfo(
  proto.qrl.GetStatsResp,
  /** @param {!proto.qrl.GetStatsReq} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.qrl.GetStatsResp.deserializeBinary
);


/**
 * @param {!proto.qrl.GetStatsReq} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.qrl.GetStatsResp)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.qrl.GetStatsResp>|undefined}
 *     The XHR Node Readable Stream
 */
proto.qrl.PublicAPIClient.prototype.getStats =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/qrl.PublicAPI/GetStats',
      request,
      metadata,
      methodInfo_GetStats,
      callback);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.qrl.GetAddressStateReq,
 *   !proto.qrl.GetAddressStateResp>}
 */
const methodInfo_GetAddressState = new grpc.web.AbstractClientBase.MethodInfo(
  proto.qrl.GetAddressStateResp,
  /** @param {!proto.qrl.GetAddressStateReq} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.qrl.GetAddressStateResp.deserializeBinary
);


/**
 * @param {!proto.qrl.GetAddressStateReq} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.qrl.GetAddressStateResp)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.qrl.GetAddressStateResp>|undefined}
 *     The XHR Node Readable Stream
 */
proto.qrl.PublicAPIClient.prototype.getAddressState =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/qrl.PublicAPI/GetAddressState',
      request,
      metadata,
      methodInfo_GetAddressState,
      callback);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.qrl.GetObjectReq,
 *   !proto.qrl.GetObjectResp>}
 */
const methodInfo_GetObject = new grpc.web.AbstractClientBase.MethodInfo(
  proto.qrl.GetObjectResp,
  /** @param {!proto.qrl.GetObjectReq} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.qrl.GetObjectResp.deserializeBinary
);


/**
 * @param {!proto.qrl.GetObjectReq} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.qrl.GetObjectResp)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.qrl.GetObjectResp>|undefined}
 *     The XHR Node Readable Stream
 */
proto.qrl.PublicAPIClient.prototype.getObject =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/qrl.PublicAPI/GetObject',
      request,
      metadata,
      methodInfo_GetObject,
      callback);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.qrl.GetLatestDataReq,
 *   !proto.qrl.GetLatestDataResp>}
 */
const methodInfo_GetLatestData = new grpc.web.AbstractClientBase.MethodInfo(
  proto.qrl.GetLatestDataResp,
  /** @param {!proto.qrl.GetLatestDataReq} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.qrl.GetLatestDataResp.deserializeBinary
);


/**
 * @param {!proto.qrl.GetLatestDataReq} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.qrl.GetLatestDataResp)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.qrl.GetLatestDataResp>|undefined}
 *     The XHR Node Readable Stream
 */
proto.qrl.PublicAPIClient.prototype.getLatestData =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/qrl.PublicAPI/GetLatestData',
      request,
      metadata,
      methodInfo_GetLatestData,
      callback);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.qrl.TransferCoinsReq,
 *   !proto.qrl.TransferCoinsResp>}
 */
const methodInfo_TransferCoins = new grpc.web.AbstractClientBase.MethodInfo(
  proto.qrl.TransferCoinsResp,
  /** @param {!proto.qrl.TransferCoinsReq} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.qrl.TransferCoinsResp.deserializeBinary
);


/**
 * @param {!proto.qrl.TransferCoinsReq} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.qrl.TransferCoinsResp)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.qrl.TransferCoinsResp>|undefined}
 *     The XHR Node Readable Stream
 */
proto.qrl.PublicAPIClient.prototype.transferCoins =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/qrl.PublicAPI/TransferCoins',
      request,
      metadata,
      methodInfo_TransferCoins,
      callback);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.qrl.PushTransactionReq,
 *   !proto.qrl.PushTransactionResp>}
 */
const methodInfo_PushTransaction = new grpc.web.AbstractClientBase.MethodInfo(
  proto.qrl.PushTransactionResp,
  /** @param {!proto.qrl.PushTransactionReq} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.qrl.PushTransactionResp.deserializeBinary
);


/**
 * @param {!proto.qrl.PushTransactionReq} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.qrl.PushTransactionResp)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.qrl.PushTransactionResp>|undefined}
 *     The XHR Node Readable Stream
 */
proto.qrl.PublicAPIClient.prototype.pushTransaction =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/qrl.PublicAPI/PushTransaction',
      request,
      metadata,
      methodInfo_PushTransaction,
      callback);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.qrl.TokenTxnReq,
 *   !proto.qrl.TransferCoinsResp>}
 */
const methodInfo_GetTokenTxn = new grpc.web.AbstractClientBase.MethodInfo(
  proto.qrl.TransferCoinsResp,
  /** @param {!proto.qrl.TokenTxnReq} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.qrl.TransferCoinsResp.deserializeBinary
);


/**
 * @param {!proto.qrl.TokenTxnReq} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.qrl.TransferCoinsResp)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.qrl.TransferCoinsResp>|undefined}
 *     The XHR Node Readable Stream
 */
proto.qrl.PublicAPIClient.prototype.getTokenTxn =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/qrl.PublicAPI/GetTokenTxn',
      request,
      metadata,
      methodInfo_GetTokenTxn,
      callback);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.qrl.TransferTokenTxnReq,
 *   !proto.qrl.TransferCoinsResp>}
 */
const methodInfo_GetTransferTokenTxn = new grpc.web.AbstractClientBase.MethodInfo(
  proto.qrl.TransferCoinsResp,
  /** @param {!proto.qrl.TransferTokenTxnReq} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.qrl.TransferCoinsResp.deserializeBinary
);


/**
 * @param {!proto.qrl.TransferTokenTxnReq} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.qrl.TransferCoinsResp)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.qrl.TransferCoinsResp>|undefined}
 *     The XHR Node Readable Stream
 */
proto.qrl.PublicAPIClient.prototype.getTransferTokenTxn =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/qrl.PublicAPI/GetTransferTokenTxn',
      request,
      metadata,
      methodInfo_GetTransferTokenTxn,
      callback);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.qrl.SlaveTxnReq,
 *   !proto.qrl.TransferCoinsResp>}
 */
const methodInfo_GetSlaveTxn = new grpc.web.AbstractClientBase.MethodInfo(
  proto.qrl.TransferCoinsResp,
  /** @param {!proto.qrl.SlaveTxnReq} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.qrl.TransferCoinsResp.deserializeBinary
);


/**
 * @param {!proto.qrl.SlaveTxnReq} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.qrl.TransferCoinsResp)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.qrl.TransferCoinsResp>|undefined}
 *     The XHR Node Readable Stream
 */
proto.qrl.PublicAPIClient.prototype.getSlaveTxn =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/qrl.PublicAPI/GetSlaveTxn',
      request,
      metadata,
      methodInfo_GetSlaveTxn,
      callback);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.qrl.LatticePublicKeyTxnReq,
 *   !proto.qrl.TransferCoinsResp>}
 */
const methodInfo_GetLatticePublicKeyTxn = new grpc.web.AbstractClientBase.MethodInfo(
  proto.qrl.TransferCoinsResp,
  /** @param {!proto.qrl.LatticePublicKeyTxnReq} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.qrl.TransferCoinsResp.deserializeBinary
);


/**
 * @param {!proto.qrl.LatticePublicKeyTxnReq} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.qrl.TransferCoinsResp)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.qrl.TransferCoinsResp>|undefined}
 *     The XHR Node Readable Stream
 */
proto.qrl.PublicAPIClient.prototype.getLatticePublicKeyTxn =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/qrl.PublicAPI/GetLatticePublicKeyTxn',
      request,
      metadata,
      methodInfo_GetLatticePublicKeyTxn,
      callback);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.qrl.PushEphemeralMessageReq,
 *   !proto.qrl.PushTransactionResp>}
 */
const methodInfo_PushEphemeralMessage = new grpc.web.AbstractClientBase.MethodInfo(
  proto.qrl.PushTransactionResp,
  /** @param {!proto.qrl.PushEphemeralMessageReq} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.qrl.PushTransactionResp.deserializeBinary
);


/**
 * @param {!proto.qrl.PushEphemeralMessageReq} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.qrl.PushTransactionResp)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.qrl.PushTransactionResp>|undefined}
 *     The XHR Node Readable Stream
 */
proto.qrl.PublicAPIClient.prototype.pushEphemeralMessage =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/qrl.PublicAPI/PushEphemeralMessage',
      request,
      metadata,
      methodInfo_PushEphemeralMessage,
      callback);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.qrl.CollectEphemeralMessageReq,
 *   !proto.qrl.CollectEphemeralMessageResp>}
 */
const methodInfo_CollectEphemeralMessage = new grpc.web.AbstractClientBase.MethodInfo(
  proto.qrl.CollectEphemeralMessageResp,
  /** @param {!proto.qrl.CollectEphemeralMessageReq} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.qrl.CollectEphemeralMessageResp.deserializeBinary
);


/**
 * @param {!proto.qrl.CollectEphemeralMessageReq} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.qrl.CollectEphemeralMessageResp)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.qrl.CollectEphemeralMessageResp>|undefined}
 *     The XHR Node Readable Stream
 */
proto.qrl.PublicAPIClient.prototype.collectEphemeralMessage =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/qrl.PublicAPI/CollectEphemeralMessage',
      request,
      metadata,
      methodInfo_CollectEphemeralMessage,
      callback);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.qrl.Empty,
 *   !proto.qrl.TokenDetailedList>}
 */
const methodInfo_GetTokenDetailedList = new grpc.web.AbstractClientBase.MethodInfo(
  proto.qrl.TokenDetailedList,
  /** @param {!proto.qrl.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.qrl.TokenDetailedList.deserializeBinary
);


/**
 * @param {!proto.qrl.Empty} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.qrl.TokenDetailedList)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.qrl.TokenDetailedList>|undefined}
 *     The XHR Node Readable Stream
 */
proto.qrl.PublicAPIClient.prototype.getTokenDetailedList =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/qrl.PublicAPI/GetTokenDetailedList',
      request,
      metadata,
      methodInfo_GetTokenDetailedList,
      callback);
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @constructor
 * @struct
 * @final
 */
proto.qrl.AdminAPIClient =
    function(hostname, credentials, options) {
  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


}); // goog.scope


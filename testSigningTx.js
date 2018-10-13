
const tx = res;
let thisSeedBin
thisSeedBin = qrllib.hstr2bin('01050038b4fb758efcf0a67a43d39bc5c038f78a478a6dfd83322368303705934fee4b7bd772c61127171760365bd1edb264c5')
let hexSeed = qrllib.bin2hstr(thisSeedBin).substring(6)
// Save the seed back as binary format
thisSeedBin = qrllib.hstr2bin(hexSeed)
XMSS_OBJECT = new qrllib.Xmss(thisSeedBin, 10)
// const xmss_pk = XMSS_OBJECT.getPK()
// const thisAddressBytes = XMSS_OBJECT.getAddress()
XMSS_OBJECT.setIndex(18)





















// Concatenates multiple typed arrays into one.
concatenateTypedArrays = (resultConstructor, ...arrays) => {
    let totalLength = 0
    for (let arr of arrays) {
      totalLength += arr.length
    }
    let result = new resultConstructor(totalLength)
    let offset = 0
    for (let arr of arrays) {
      result.set(arr, offset)
      offset += arr.length
    }
    return result
}


// Take input and convert to unsigned uint64 bigendian bytes
toBigendianUint64BytesUnsigned = (input) => {
  if(!Number.isInteger(input)) {
    input = parseInt(input)
  }

  const byteArray = [0, 0, 0, 0, 0, 0, 0, 0]

  for ( let index = 0; index < byteArray.length; index ++ ) {
    const byte = input & 0xff
    byteArray[index] = byte
    input = (input - byte) / 256
  }

  byteArray.reverse()

  const result = new Uint8Array(byteArray)
  return result
}













// Concatenate Uint8Arrays
let concatenatedArrays = concatenateTypedArrays(Uint8Array, tx.extended_transaction_unsigned.addr_from, toBigendianUint64BytesUnsigned(tx.extended_transaction_unsigned.tx.fee))
// Now append all recipient (outputs) to concatenatedArrays
const addrsToRaw = tx.extended_transaction_unsigned.tx.transfer.addrs_to
const amountsRaw = tx.extended_transaction_unsigned.tx.transfer.amounts
for (var i = 0; i < addrsToRaw.length; i++) {
    concatenatedArrays = concatenateTypedArrays(Uint8Array,concatenatedArrays,addrsToRaw[i]) // Add address
    concatenatedArrays = concatenateTypedArrays(Uint8Array,concatenatedArrays,toBigendianUint64BytesUnsigned(amountsRaw[i])) // Add amount
}
// Convert Uint8Array to VectorUChar
const hashableBytes = new qrllib.VectorUChar()
for (i = 0; i < concatenatedArrays.length; i += 1) {
    hashableBytes.push_back(concatenatedArrays[i])
}
// Create sha256 sum of concatenatedarray
let shaSum = qrllib.sha2_256(hashableBytes)
// Sign the sha sum
tx.extended_transaction_unsigned.tx.signature = binaryToBytes(XMSS_OBJECT.sign(shaSum))
// Calculate transaction hash
let txnHashConcat = concatenateTypedArrays(Uint8Array,binaryToBytes(shaSum),tx.extended_transaction_unsigned.tx.signature,binaryToBytes(XMSS_OBJECT.getPK()))

const txnHashableBytes = new qrllib.VectorUChar()
for (i = 0; i < txnHashConcat.length; i += 1) {
    txnHashableBytes.push_back(txnHashConcat[i])
}

let txnHash = qrllib.bin2hstr(qrllib.sha2_256(txnHashableBytes))

// transferCoins returns a TransferCoinsResp, one needs to get the Transaction out and sign it
const confirmTxn = { transaction_signed: res.extended_transaction_unsigned.tx }
// confirmTxn.transaction_signed.master_addr = testfromaddress_bytes;
confirmTxn.transaction_signed.fee = tx.extended_transaction_unsigned.tx.fee
confirmTxn.transaction_signed.public_key = mocknetfromxmsspk_bytes
confirmTxn.transaction_signed.signature = binaryToBytes(XMSS_OBJECT.sign(shaSum))
confirmTxn.transaction_signed.nonce = 12
confirmTxn.transaction_signed.transaction_hash = txnHash
confirmTxn.transaction_signed.transfer.addrs_to = tx.extended_transaction_unsigned.tx.transfer.addrs_to
confirmTxn.transaction_signed.transfer.amounts = tx.extended_transaction_unsigned.tx.transfer.amounts

// pushTransaction API call
qrlClient.pushTransaction(confirmTxn, (err, res2) => {
    if (err){
        console.log("Error: ", err.message);
        return;
    }
    // console.log("RES2 : ", res2)
    response = res;
    response2 = res2;
    resolve();
});
});
});

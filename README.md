# phr_chaincode

Steps:
export CORE_PEER_ADDRESS=peer0.a.example.com:7051
CORE_PEER_LOCALMSPID="aMSP"
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/artifacts/crypto-config/peerOrganizations/a.example.com/peers/peer1.a.example.com/tls/ca.crt

git clone https://github.com/ggdranzor/phr_chaincode.git

peer chaincode install -n phr_chaincode -v 1.1 -p /etc/hyperledger/phr_chaincode/ -l node    always on 7051 of each peer of org a and org  8051 n so on

peer chaincode instantiate -n phr_chaincode -v 1.1 -c '{"Args":["init"]}' -o orderer.example.com:7050 -C common --tls --cafile /etc/hyperledger/crypto/orderer/tls/ca.crt

export CORE_PEER_CHAINCODELISTENADDRESS=peer0.a.example.com:7052
export CORE_PEER_NETWORKID=dockercompose_default

'use strict'

const shim = require('fabric-shim');
const util = require('util');

let Chaincode = class {
	async Init(stub){
		return shim.success();
	}
	async Invoke(stub){
		let ret = stub.getFunctionAndParameters();
		console.info(ret);

		let method = this [ret.fcn];
		if(!method){
			console.error('no function of name:' + ret.fcn + ' found');
      		throw new Error('Received unknown function ' + ret.fcn + ' invocation');
		}
		try {
	      let payload = await method(stub, ret.params);
	      return shim.success(payload);
	    } catch (err) {
	      console.log(err);
	      return shim.error(err);
	    }
	}
	//Dummy data in state database
	async initLedger(stub,args){
		let requestRecords = [];
		requestRecords.push({
			reqID:'0001',
			providerID:'PR011',
			providerType:'physician',
			patientID:'PA006',
			category:'lifestyle',
			requestStatus:'pending'
		});
		requestRecords.push({
			reqID:'0002',
			providerID:'PR02',
			providerType:'pharmacist',
			patientID:'PA006',
			category:'medication',
			requestStatus:'accepted',
		});
		requestRecords.push({
			reqID:'0003',
			providerID:'PR022',
			providerType:'specialist',
			patientID:'PA007',
			category:'medication',
			requestStatus:'accepted',
		});
		for (let i = 0; i < requestRecord.length; i++) {
      			await stub.putState(requestRecord.reqID, Buffer.from(JSON.stringify(requestRecord[i])));
      			console.info('Added <--> ', requestRecord[i]);
    		}
    		console.info('============= END : Initialize Ledger ===========');
	}
	async Request(stub,args){
		console.info('============= START : Request Record ===========');
		if(args.length !=6){
			throw new Error('Incorrect number of arguments. Expecting 6');
		}
		const record ={
			requestID: args[0],
			providerID: args[1],
			providerType: args[2],
			patientID: args[3],
			category: args[4],
			requestStatus: 'pending'
		}

		await stub.putState(args[0], Buffer.from(JSON.stringify(record)));
    	console.info('============= END : Request Record ===========');
	}
	async Response(stub,args){
		console.info('============= START : Patient Response ===========');

		if(args[1] === "denied"){
			let recordBytes = await stub .getState(args[0]);
			let record = JSON.parse(recordBytes);
			record.requestStatus: 'denied'
			await stub.putState(args[0], Buffer.from(JSON.stringify(record)));
		}
		else if (args[1] === "accepted"){
			let recordBytes = await stub .getState(args[0]);
			let record = JSON.parse(recordBytes);
			record.requestStatus: 'accepted'
			await stub.putState(args[0], Buffer.from(JSON.stringify(record)));
		}
		else {
			throw new Error('Incorrect number of arguments. Expecting 2 or 3');
		}

		console.info('============= END : Patient Response ===========');
	}

	async Revoke(stub,args){
		console.info('============= START : Request Revoked ===========');

		if(args.length != 1) {
			throw new Error('Incorrect number of arguments. Expecting 1');
		}
		let recordBytes = await stub .getState(args[0]);
		let record = JSON.parse(recordBytes);
		record.requestStatus: 'Revoked'
		await stub.putState(args[0], Buffer.from(JSON.stringify(record)));
	
		console.info('============= END : Request Revoked ===========');
	}
	async ProviderViewData(stub,args){
		console.info('============= START : Provider View Data ===========');
		if(args.length != 1) {
			throw new Error('Incorrect number of arguments. Expecting 2 or 3');
		}
		let recordBytes = await stub.getState(args[0]);
		let record = JSON.parse(recordBytes);

		let newDate = new Date(Date.now());
		let datestr= newDate.toDateString();
		let timestr=newDate.toTimeString();
		let timeStamp = datestr + timestr ;

		let message = "RequestID: "+ record.requestID + " Provider: " + record.providerID + " is viewing Patient: " + record.patientID + " category: " + record.category + " data at timestamp: "+timeStamp;

		console.log(message);

		console.info('============= END : Provider View Data ===========');
	}
	async ProviderQueryRequest(stub,args){
		let startKey = 'REQ0';
    	let endKey = 'REQ100';
		if(args.length != 1) {
			throw new Error('Incorrect number of arguments. Expecting 1: providerID');
		}
		let iterator = await stub.getStateByRange(startKey, endKey);
		let results = [];
		while (true){
			let record = await iterator.next();
			if (record.value && record.value.value.toString()){
				let jsonRecord = {};
				console.log(res.value.value.toString('utf8'));
				jsonRecord = record.value.key;
				try {
					jsonRecord.Record = JSON.parse(record.value.value.toString('utf8'));
				}
				catch (err) {
					console.log(err);
					jsonRecord = record.value.value.toString('utf8');
				}
				if (jsonRecord.providerID === args[0]){
					console.log(jsonRecord);
					results.push(jsonRecord);
				}				
			}
			if(record.done){
				console.log('End of Data');
				await iterator.close();
				console.info(results)
				return Buffer.from(JSON.stringify(results));
			}
		}
	}
	async PatientQueryRequest(stub,args){
		let startKey = 'REQ0';
    	let endKey = 'REQ100';
    	if(args.length != 1) {
			throw new Error('Incorrect number of arguments. Expecting 1: patientID');
		}
		let iterator = await stub.getStateByRange(startKey, endKey);
		let results = [];
		while (true){
			let record = await iterator.next();
			if (record.value && record.value.value.toString()){
				let jsonRecord = {};
				console.log(res.value.value.toString('utf8'));
				jsonRecord = record.value.key;
				try {
					jsonRecord.Record = JSON.parse(record.value.value.toString('utf8'));
				}
				catch (err) {
					console.log(err);
					jsonRecord = record.value.value.toString('utf8');
				}
				if (jsonRecord.patientID === args[0]){
					console.log(jsonRecord);
					results.push(jsonRecord);
				}				
			}
			if(record.done){
				console.log('End of Data');
				await iterator.close();
				console.info(results)
				return Buffer.from(JSON.stringify(results));
			}
		}
	}
};

	





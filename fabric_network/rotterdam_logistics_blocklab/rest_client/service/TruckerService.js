var config = require('config');
var LogisticsNetwork = require('../connector/LogisticsNetwork');

var TruckerPreferences = require('../domain/TruckerPreferences');
var UpdateTruckerPreferencesCommand = require('../domain/tx/UpdateTruckerPreferencesCommand');
var TruckerBidOnContainerDeliveryJobOfferForList = require('../domain/TruckerBidOnContainerDeliveryJobOfferForList');

class TruckerService 
{
	/**
		@param {String} TruckerId
		@return {Promise} of a Trucker
	*/
	getTrucker(truckerId) 
	{
		console.log("Got truckerId: " + truckerId);

		return new LogisticsNetwork().getTruckerParticipantRegistry()
			.then((truckerParticipantRegistry) => truckerParticipantRegistry.get(truckerId))
			.catch((error) => {
				throw error;
			});
	}

	/**
		@param {String} TruckerId
		@return {Promise} of a TruckerPreferences
	*/
	getTruckerPreferences(truckerId) 
	{
		return this.getTrucker(truckerId)
			.then((trucker) => new TruckerPreferences(trucker));
	}

	/**
		@param {String} TruckerId
		@param {String} TruckCapacity
		@param {DateTime} availableFrom
		@param {DateTime} availableTo
		@param {String[]} allowedDestinations
		*/
	updateTruckerPreferences(truckerId, truckCapacity, availableFrom, availableTo, allowedDestinations) 
	{
		console.log(`[updateTruckerPreferences] updating trucker preferences for ${truckerId} to: ${truckCapacity}
		${availableFrom}, ${availableTo}, ${allowedDestinations}`);

		const namespace = "nl.tudelft.blockchain.logistics";
		const txName = "UpdateTruckerPreferences";

		return new LogisticsNetwork().submitTransaction(
			namespace,
			txName,
			(tx, factory) => {
				return new UpdateTruckerPreferencesCommand(
					{
						truckerId: truckerId,
						truckCapacity: truckCapacity,
						availableFrom: availableFrom,
						availableTo: availableTo,
						allowedDestinations: allowedDestinations
					})
					.hydrateTx(tx, factory);
			});
	}

	/**
		@param {String} TruckerId
		@return {Promise} of TruckerBidOnContainerJobOffer[]
	*/
	getTruckerBids(truckerId)
	{
		let truckerReference = "resource:nl.tudelft.blockchain.logistics.Trucker#" + truckerId;
		console.log("[getTruckerBids] for trucker: " + truckerId);

		return new LogisticsNetwork().executeNamedQuery('FindAllTruckerBidOnContainerJobOffer', {truckerId: truckerReference})
			.then((assets) => assets.map(x => new TruckerBidOnContainerDeliveryJobOfferForList(x)))
			.catch((error) => {
				throw error;
			});
	}
}

module.exports = TruckerService;
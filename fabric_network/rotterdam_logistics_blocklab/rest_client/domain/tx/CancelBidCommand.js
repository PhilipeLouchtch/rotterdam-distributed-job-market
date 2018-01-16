'use strict';

class CancelBidCommand
{
	constructor(obj)
	{
		this.containerDeliveryJobOfferId = obj.containerDeliveryJobOfferId;
		this.truckerBidId = obj.truckerBidId;
	}

	getContainerDeliveryJobOfferId()
	{
		return this.containerDeliveryJobOfferId;
	}

	getTruckerBidId()
	{
		return this.truckerBidId;
	}

	hydrateTx(tx, factory)
	{
		tx.containerDeliveryJobOffer = factory.newRelationship("nl.tudelft.blockchain.logistics", "ContainerDeliveryJobOffer", this.containerDeliveryJobOfferId);
		tx.truckerBid = factory.newRelationship("nl.tudelft.blockchain.logistics", "TruckerBidOnContainerJobOffer", this.truckerBidId);

		return tx;
	}
}

module.exports = CancelBidCommand;